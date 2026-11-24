const { tools } = require('./tools');
const { extractSlots, classifyIntent, parseDateString } = require('./nlu');
const { queryKnowledgeBase } = require('./knowledgeBase');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// In-memory session store (can be replaced with Redis/DB in multi-node setups)
const sessionStore = new Map();

function getOrCreateSession(sessionId = 'default') {
  if (!sessionStore.has(sessionId)) {
    sessionStore.set(sessionId, {
      sessionId,
      stage: 'IDLE',
      bookingDraft: {
        checkIn: null,
        checkOut: null,
        guests: 2,
        roomNumber: null,
        guestType: null,
        name: null,
        phone: null,
        email: null,
        rollNumber: null,
        department: null,
        yearOfStudy: null,
        studentName: null,
        studentRollNumber: null,
        relationship: null,
        govtIdType: null,
        govtIdNumber: null,
        passoutYear: null,
        branch: null,
        homeCollege: null,
        sponsoringDept: null,
      },
      complaintDraft: {
        roomNumber: null,
        guestName: null,
        bookingId: null,
        issueDescription: null,
        category: null,
      },
      pendingAction: null,
      lastInteraction: Date.now(),
    });
  }
  return sessionStore.get(sessionId);
}

// Determines missing guest details
function getMissingGuestFields(draft) {
  const missing = [];
  if (!draft.name) missing.push('Full Name');
  if (!draft.phone) missing.push('Phone Number');
  if (!draft.guestType) {
    missing.push('Guest Category (Student, Parent, Alumni, or Guest)');
  } else {
    if (draft.guestType === 'Student' && !draft.rollNumber) {
      missing.push('Student Roll Number (e.g. BTECH/10045/22)');
    } else if (draft.guestType === 'Parent' && (!draft.studentName || !draft.studentRollNumber)) {
      if (!draft.studentName) missing.push("Visiting Student's Full Name");
      if (!draft.studentRollNumber) missing.push("Student's Roll Number");
    } else if (draft.guestType === 'Alumni' && !draft.passoutYear) {
      missing.push('Graduation Passout Year');
    } else if (draft.guestType === 'Other College Guest' && !draft.homeCollege) {
      missing.push('Home University / Institution Name');
    }
  }
  return missing;
}

// Formats booking summary card
function buildBookingSummary(draft) {
  const nights = Math.max(
    1,
    Math.ceil((new Date(draft.checkOut) - new Date(draft.checkIn)) / (1000 * 60 * 60 * 24))
  );
  const rate = 1200;
  const totalAmount = nights * rate;

  return {
    roomNumber: draft.roomNumber,
    roomType: 'AC Executive Suite',
    floor: draft.roomNumber >= 200 ? 2 : 1,
    checkIn: draft.checkIn,
    checkOut: draft.checkOut,
    nights,
    ratePerNight: rate,
    totalAmount,
    guestType: draft.guestType,
    guestName: draft.name,
    phone: draft.phone,
    email: draft.email || 'Not provided',
    specificCredential:
      draft.rollNumber ||
      draft.studentRollNumber ||
      draft.passoutYear ||
      draft.homeCollege ||
      'Verified',
  };
}

class AgentOrchestrator {
  async handleMessage({ message, sessionId = 'default', conversationHistory = [], userProfile = null }) {
    const session = getOrCreateSession(sessionId);
    session.lastInteraction = Date.now();

    // Sync logged-in guest profile into session state if available
    if (userProfile) {
      if (userProfile.name && !session.bookingDraft.name) session.bookingDraft.name = userProfile.name;
      if (userProfile.phone && !session.bookingDraft.phone) session.bookingDraft.phone = userProfile.phone;
      if (userProfile.guestType && !session.bookingDraft.guestType) session.bookingDraft.guestType = userProfile.guestType;
      if (userProfile.rollNumber && !session.bookingDraft.rollNumber) session.bookingDraft.rollNumber = userProfile.rollNumber;
    }

    const text = (message || '').trim();
    const extracted = extractSlots(text);
    const intent = classifyIntent(text, extracted);

    // Merge slots into session state
    if (extracted.checkIn) session.bookingDraft.checkIn = extracted.checkIn;
    if (extracted.checkOut) session.bookingDraft.checkOut = extracted.checkOut;
    if (extracted.guests) session.bookingDraft.guests = extracted.guests;
    if (extracted.roomNumber) session.bookingDraft.roomNumber = extracted.roomNumber;
    if (extracted.guestType) session.bookingDraft.guestType = extracted.guestType;
    if (extracted.name) session.bookingDraft.name = extracted.name;
    if (extracted.phone) session.bookingDraft.phone = extracted.phone;
    if (extracted.email) session.bookingDraft.email = extracted.email;
    if (extracted.rollNumber) session.bookingDraft.rollNumber = extracted.rollNumber;

    // Direct single date candidate resolution
    if (extracted.candidateDate && !session.bookingDraft.checkIn) {
      session.bookingDraft.checkIn = extracted.candidateDate;
    } else if (extracted.candidateDate && session.bookingDraft.checkIn && !session.bookingDraft.checkOut) {
      if (new Date(extracted.candidateDate) > new Date(session.bookingDraft.checkIn)) {
        session.bookingDraft.checkOut = extracted.candidateDate;
      }
    }

    // Merge complaint slots
    if (extracted.roomNumber) session.complaintDraft.roomNumber = extracted.roomNumber;
    if (extracted.name) session.complaintDraft.guestName = extracted.name;
    if (extracted.bookingId) session.complaintDraft.bookingId = extracted.bookingId;
    if (extracted.issueDescription) session.complaintDraft.issueDescription = extracted.issueDescription;
    if (extracted.complaintCategory) session.complaintDraft.category = extracted.complaintCategory;

    // Check if user is cancelling / resetting the active flow
    if (extracted.isCancelled && session.stage !== 'IDLE') {
      session.stage = 'IDLE';
      session.pendingAction = null;
      return {
        reply: 'The current operation has been cancelled. How else can I assist you with your stay at BIT Mesra?',
        sessionState: session,
        uiCard: null,
        source: 'orchestrator',
      };
    }

    // -------------------------------------------------------------
    // Branch A: Pending Cancellation Action Confirmation
    // -------------------------------------------------------------
    if (session.pendingAction && session.pendingAction.type === 'CANCEL_BOOKING') {
      if (extracted.isConfirmed) {
        const cancelResult = await tools.cancel_booking({
          bookingId: session.pendingAction.bookingId,
          reason: 'Cancelled by guest via conversational assistant',
          confirmed: true,
        });
        session.pendingAction = null;
        session.stage = 'IDLE';
        return {
          reply: `✅ **Booking Cancelled Successfully**\n\nBooking **${cancelResult.bookingId}** has been cancelled. The room has been released and any eligible refund will be credited according to guest house policy.`,
          sessionState: session,
          uiCard: {
            type: 'booking_cancelled',
            bookingId: cancelResult.bookingId,
            roomNumber: cancelResult.booking?.roomNumber,
          },
          source: 'orchestrator',
        };
      } else {
        session.pendingAction = null;
        return {
          reply: 'Booking cancellation was aborted. Your reservation remains active and confirmed.',
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }
    }

    // -------------------------------------------------------------
    // Branch B: Complaint Management Intent
    // -------------------------------------------------------------
    if (intent === 'COMPLAINT' || session.stage === 'COLLECTING_COMPLAINT_SLOTS') {
      session.stage = 'COLLECTING_COMPLAINT_SLOTS';

      // Check missing complaint info
      if (!session.complaintDraft.roomNumber) {
        return {
          reply: 'I can certainly help you lodge a maintenance or service request. Which **room number** are you staying in?',
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      if (!session.complaintDraft.issueDescription) {
        return {
          reply: `Got it, Room ${session.complaintDraft.roomNumber}. Please describe the issue or problem you are experiencing (e.g. AC cooling, geyser hot water, Wi-Fi connectivity).`,
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      // We have both room number and issue description -> create complaint
      const complaintRes = await tools.register_complaint({
        roomNumber: session.complaintDraft.roomNumber,
        guestName: session.complaintDraft.guestName || session.bookingDraft.name || 'Guest',
        bookingId: session.complaintDraft.bookingId || session.bookingDraft.bookingId || '',
        issueDescription: session.complaintDraft.issueDescription,
        category: session.complaintDraft.category || 'General',
      });

      // Reset complaint draft
      session.complaintDraft = { roomNumber: null, guestName: null, bookingId: null, issueDescription: null, category: null };
      session.stage = 'IDLE';

      return {
        reply: `🔧 **Maintenance Ticket Created**\n\nYour complaint has been registered with Ticket ID **${complaintRes.complaintId}** for Room **${complaintRes.complaint.roomNumber}**.\n• Category: ${complaintRes.complaint.category}\n• Status: **${complaintRes.complaint.status}**\n• Our facility staff and Warden have been notified to address this promptly.`,
        sessionState: session,
        uiCard: {
          type: 'complaint_ticket',
          complaint: complaintRes.complaint,
        },
        source: 'orchestrator',
      };
    }

    // -------------------------------------------------------------
    // Branch C: Booking Cancellation Request
    // -------------------------------------------------------------
    if (intent === 'CANCEL') {
      const bId = extracted.bookingId || session.bookingDraft.bookingId;
      if (!bId) {
        return {
          reply: 'To cancel a reservation, please provide your **Booking ID** (e.g. `BIT-GH-1001`).',
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      const bookingStatus = await tools.get_booking_status({ bookingId: bId });
      if (!bookingStatus.success) {
        return {
          reply: `⚠️ ${bookingStatus.message}`,
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      session.pendingAction = { type: 'CANCEL_BOOKING', bookingId: bId };
      return {
        reply: `⚠️ **Cancellation Confirmation Required**\n\nAre you sure you want to cancel booking **${bId}** for **Room ${bookingStatus.booking.roomNumber}** (${bookingStatus.booking.checkIn} to ${bookingStatus.booking.checkOut})?\n\nReply **"Yes"** to confirm or **"No"** to keep your reservation.`,
        sessionState: session,
        uiCard: {
          type: 'cancel_confirmation',
          booking: bookingStatus.booking,
        },
        source: 'orchestrator',
      };
    }

    // -------------------------------------------------------------
    // Branch D: Booking Status / Tracking Intent
    // -------------------------------------------------------------
    if (intent === 'STATUS') {
      const bId = extracted.bookingId;
      const phone = extracted.phone;

      if (!bId && !phone) {
        return {
          reply: 'To check your reservation status, please share your **Booking ID** (e.g., `BIT-GH-1001`) or registered **phone number**.',
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      const statusRes = await tools.get_booking_status({ bookingId: bId, phone });
      if (!statusRes.success) {
        return {
          reply: `⚠️ ${statusRes.message}`,
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      const b = statusRes.booking;
      return {
        reply: `📋 **Booking Details (${b.bookingId})**\n\n• **Guest:** ${b.guestDetails?.name || 'Guest'} (${b.guestType})\n• **Room:** Room ${b.roomNumber} (Floor ${b.roomNumber >= 200 ? 2 : 1})\n• **Dates:** ${b.checkIn} to ${b.checkOut} (${b.nights} nights)\n• **Tariff:** ₹${b.amount}\n• **Status:** \`${b.status}\` | Payment: \`${b.paymentStatus}\``,
        sessionState: session,
        uiCard: {
          type: 'booking_status',
          booking: b,
        },
        source: 'orchestrator',
      };
    }

    // -------------------------------------------------------------
    // Branch E: Booking Modification Intent
    // -------------------------------------------------------------
    if (intent === 'MODIFY') {
      const bId = extracted.bookingId;
      if (!bId) {
        return {
          reply: 'To modify an existing booking, please provide your **Booking ID** along with your desired new dates or room number (e.g., `Modify BIT-GH-1002 to 18 Nov to 20 Nov`).',
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      if (!extracted.checkIn && !extracted.roomNumber) {
        return {
          reply: `Found Booking **${bId}**. What changes would you like to make? (e.g. new check-in/out dates or room number).`,
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      const modifyRes = await tools.modify_booking({
        bookingId: bId,
        newCheckIn: extracted.checkIn,
        newCheckOut: extracted.checkOut,
        newRoomNumber: extracted.roomNumber,
      });

      if (!modifyRes.success) {
        return {
          reply: `⚠️ ${modifyRes.message}`,
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      return {
        reply: `✅ **Booking Modified Successfully**\n\n${modifyRes.message}`,
        sessionState: session,
        uiCard: {
          type: 'booking_status',
          booking: modifyRes.booking,
        },
        source: 'orchestrator',
      };
    }

    // -------------------------------------------------------------
    // Branch F: Payment Intent
    // -------------------------------------------------------------
    if (intent === 'PAYMENT' || session.stage === 'AWAITING_PAYMENT') {
      const bId = extracted.bookingId || session.bookingDraft.bookingId;
      if (!bId) {
        return {
          reply: 'Please provide the **Booking ID** you would like to complete payment for.',
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      // Process or initiate payment
      const payInit = await tools.initiate_payment({ bookingId: bId });
      if (!payInit.success) {
        return {
          reply: `⚠️ ${payInit.message}`,
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      // If user provided a confirmation / simulated payment click
      if (extracted.isConfirmed || text.toLowerCase().includes('pay now')) {
        const verifyRes = await tools.verify_payment({
          bookingId: bId,
          paymentMethod: 'UPI (Razorpay Gateway)',
        });
        session.stage = 'IDLE';
        return {
          reply: `🎉 **Payment Verified & Booking Confirmed!**\n\n${verifyRes.message}\nYour official stay allotment voucher has been issued.`,
          sessionState: session,
          uiCard: {
            type: 'stay_voucher',
            booking: verifyRes.booking,
          },
          source: 'orchestrator',
        };
      }

      return {
        reply: `💳 **Payment Gateway Request**\n\n• **Booking ID:** ${payInit.bookingId}\n• **Total Amount:** **₹${payInit.amount}**\n• **Room:** Room ${payInit.roomNumber}\n\nPlease click below to complete the Razorpay checkout:`,
        sessionState: session,
        uiCard: {
          type: 'payment_checkout',
          paymentDetails: payInit,
        },
        source: 'orchestrator',
      };
    }

    // -------------------------------------------------------------
    // Branch G: Conversational Booking Workflow & Dynamic Slot Filling
    // -------------------------------------------------------------
    if (
      intent === 'BOOKING' ||
      intent === 'AVAILABILITY' ||
      session.stage === 'COLLECTING_BOOKING_SLOTS' ||
      session.stage === 'SELECTING_ROOM' ||
      session.stage === 'COLLECTING_GUEST_DETAILS' ||
      session.stage === 'AWAITING_CONFIRMATION'
    ) {
      if (session.stage === 'IDLE') {
        session.stage = 'COLLECTING_BOOKING_SLOTS';
      }

      // If user is already awaiting confirmation, handle confirmation first
      if (session.stage === 'AWAITING_CONFIRMATION') {
        if (extracted.isConfirmed) {
          const createRes = await tools.create_booking({
            guestType: session.bookingDraft.guestType || 'Student',
            guestDetails: {
              name: session.bookingDraft.name,
              phone: session.bookingDraft.phone,
              email: session.bookingDraft.email,
              rollNumber: session.bookingDraft.rollNumber,
              studentName: session.bookingDraft.studentName,
              studentRollNumber: session.bookingDraft.studentRollNumber,
              relationship: session.bookingDraft.relationship,
              passoutYear: session.bookingDraft.passoutYear,
              branch: session.bookingDraft.branch,
              homeCollege: session.bookingDraft.homeCollege,
              govtIdType: session.bookingDraft.govtIdType || 'Government ID',
              govtIdNumber: session.bookingDraft.govtIdNumber || 'Verified',
            },
            roomNumber: session.bookingDraft.roomNumber,
            checkIn: session.bookingDraft.checkIn,
            checkOut: session.bookingDraft.checkOut,
            instantConfirm: true,
          });

          if (!createRes.success) {
            return {
              reply: `⚠️ ${createRes.message}`,
              sessionState: session,
              uiCard: null,
              source: 'orchestrator',
            };
          }

          session.stage = 'AWAITING_PAYMENT';
          session.bookingDraft.bookingId = createRes.bookingId;

          const payInit = await tools.initiate_payment({ bookingId: createRes.bookingId });

          return {
            reply: `🎉 **Booking Created Successfully!**\n\nYour reservation ID is **${createRes.bookingId}** for Room **${session.bookingDraft.roomNumber}**.\n\nYou can complete your payment now using the Razorpay portal below:`,
            sessionState: session,
            uiCard: {
              type: 'payment_checkout',
              paymentDetails: payInit,
              booking: createRes.booking,
            },
            source: 'orchestrator',
          };
        } else if (extracted.isCancelled) {
          session.stage = 'IDLE';
          return {
            reply: 'Booking was not confirmed. You can start a new search or ask questions anytime.',
            sessionState: session,
            uiCard: null,
            source: 'orchestrator',
          };
        }
      }

      // 1. Missing Check-In Date
      if (!session.bookingDraft.checkIn) {
        return {
          reply: 'I would be happy to help you reserve a room at the BIT Mesra Guest House! 🏛️\n\nWhat date would you like to **check in**?',
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      // 2. Missing Check-Out Date
      if (!session.bookingDraft.checkOut) {
        return {
          reply: `Great, check-in noted for **${session.bookingDraft.checkIn}**. What date will you be **checking out**?`,
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      // Validate date order
      if (new Date(session.bookingDraft.checkIn) >= new Date(session.bookingDraft.checkOut)) {
        session.bookingDraft.checkOut = null;
        return {
          reply: '⚠️ The check-out date must be after the check-in date. Please provide a valid check-out date.',
          sessionState: session,
          uiCard: null,
          source: 'orchestrator',
        };
      }

      // 3. Dates are known. Is room selected?
      if (!session.bookingDraft.roomNumber) {
        session.stage = 'SELECTING_ROOM';
        const avail = await tools.check_availability({
          checkIn: session.bookingDraft.checkIn,
          checkOut: session.bookingDraft.checkOut,
        });

        if (avail.totalAvailable === 0) {
          return {
            reply: `⚠️ I checked our database, and unfortunately all 29 public rooms are fully booked for **${session.bookingDraft.checkIn}** to **${session.bookingDraft.checkOut}**.\n\nWould you like to try alternative dates?`,
            sessionState: session,
            uiCard: null,
            source: 'orchestrator',
          };
        }

        const nights = avail.nights;
        const totalAmount = avail.totalAmount;

        return {
          reply: `🏨 I found **${avail.totalAvailable} available rooms** for **${session.bookingDraft.checkIn}** to **${session.bookingDraft.checkOut}** (${nights} night${nights > 1 ? 's' : ''}).\n\nPlease select your preferred room below, or tell me your room number:`,
          sessionState: session,
          uiCard: {
            type: 'room_selection',
            checkIn: session.bookingDraft.checkIn,
            checkOut: session.bookingDraft.checkOut,
            nights,
            ratePerNight: 1200,
            totalAmount,
            rooms: avail.rooms.slice(0, 10),
          },
          source: 'orchestrator',
        };
      }

      // 4. Room is selected. Check missing guest details.
      const missingDetails = getMissingGuestFields(session.bookingDraft);
      if (missingDetails.length > 0) {
        session.stage = 'COLLECTING_GUEST_DETAILS';

        return {
          reply: `Room **${session.bookingDraft.roomNumber}** selected! To complete your reservation, please provide the remaining details:\n\n${missingDetails.map((m) => `• **${m}**`).join('\n')}`,
          sessionState: session,
          uiCard: {
            type: 'guest_details_form',
            currentDraft: session.bookingDraft,
            missingFields: missingDetails,
          },
          source: 'orchestrator',
        };
      }

      // 5. All details collected! Transition to AWAITING_CONFIRMATION and show summary
      if (session.stage === 'COLLECTING_GUEST_DETAILS' || session.stage === 'COLLECTING_BOOKING_SLOTS') {
        session.stage = 'AWAITING_CONFIRMATION';
        const summary = buildBookingSummary(session.bookingDraft);

        return {
          reply: `📋 **Booking Summary Ready**\n\nPlease review your reservation details below. Click **"Confirm & Book"** or reply **"Yes"** to confirm:`,
          sessionState: session,
          uiCard: {
            type: 'booking_summary',
            summary,
          },
          source: 'orchestrator',
        };
      }
    }

    // -------------------------------------------------------------
    // Branch H: FAQ & Knowledge Base Query
    // -------------------------------------------------------------
    if (intent === 'FAQ') {
      const policy = queryKnowledgeBase(text);
      return {
        reply: `ℹ️ **${policy.title}**\n\n${policy.content}`,
        sessionState: session,
        uiCard: null,
        source: 'knowledgeBase',
      };
    }

    // -------------------------------------------------------------
    // Branch I: General / Unmatched conversational greeting
    // -------------------------------------------------------------
    return {
      reply: `Welcome to the **BIT Mesra Guest House AI Receptionist**! 🏛️\n\nI can directly assist you with:\n• **Book a Room:** Select from 29 bookable rooms across 2 floors.\n• **Check Availability:** View real-time room availability for your dates.\n• **Track or Modify Booking:** Check status with your registered mobile number or Booking ID.\n• **Lodge Complaints:** Report AC, plumbing, or Wi-Fi issues.\n• **Facilities & Tariffs:** Small Room (₹1,000), Small Double Regular (₹1,200), Large Double (₹1,500) (+5% GST).\n\nHow can I help you today?`,
      sessionState: session,
      uiCard: null,
      source: 'orchestrator',
    };
  }
}

const orchestrator = new AgentOrchestrator();

module.exports = {
  orchestrator,
};
