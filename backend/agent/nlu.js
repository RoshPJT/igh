// Natural Language Understanding & Dynamic Slot Extractor for BIT Mesra Guesthouse

const MONTH_NAMES = {
  jan: '01', january: '01',
  feb: '02', february: '02',
  mar: '03', march: '03',
  apr: '04', april: '04',
  may: '05',
  jun: '06', june: '06',
  jul: '07', july: '07',
  aug: '08', august: '08',
  sep: '09', september: '09',
  oct: '10', october: '10',
  nov: '11', november: '11',
  dec: '12', december: '12',
};

const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};

function formatIsoDate(year, month, day) {
  const y = String(year);
  const m = String(month).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Parses human dates into YYYY-MM-DD
function parseDateString(str, referenceYear = new Date().getFullYear()) {
  if (!str) return null;
  const clean = str.trim().toLowerCase();

  // YYYY-MM-DD
  const isoMatch = clean.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    return formatIsoDate(isoMatch[1], isoMatch[2], isoMatch[3]);
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = clean.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    return formatIsoDate(dmyMatch[3], dmyMatch[2], dmyMatch[1]);
  }

  // "today", "tomorrow", "day after tomorrow"
  const now = new Date();
  if (clean === 'today') {
    return now.toISOString().split('T')[0];
  }
  if (clean === 'tomorrow') {
    const tmrw = new Date(now.getTime() + 86400000);
    return tmrw.toISOString().split('T')[0];
  }
  if (clean === 'day after tomorrow') {
    const dat = new Date(now.getTime() + 86400000 * 2);
    return dat.toISOString().split('T')[0];
  }

  // "15 Nov", "15 November", "15th November 2026"
  const wordMatch = clean.match(/(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]+)(?:\s+(\d{4}))?/i);
  if (wordMatch) {
    const day = parseInt(wordMatch[1], 10);
    const monthWord = wordMatch[2].toLowerCase();
    const year = wordMatch[3] ? parseInt(wordMatch[3], 10) : referenceYear;
    const monthNum = MONTH_NAMES[monthWord] || MONTH_NAMES[Object.keys(MONTH_NAMES).find((k) => monthWord.startsWith(k))];
    if (monthNum) {
      return formatIsoDate(year, monthNum, day);
    }
  }

  // "Nov 15"
  const wordFirstMatch = clean.match(/([a-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?/i);
  if (wordFirstMatch) {
    const monthWord = wordFirstMatch[1].toLowerCase();
    const day = parseInt(wordFirstMatch[2], 10);
    const year = wordFirstMatch[3] ? parseInt(wordFirstMatch[3], 10) : referenceYear;
    const monthNum = MONTH_NAMES[monthWord] || MONTH_NAMES[Object.keys(MONTH_NAMES).find((k) => monthWord.startsWith(k))];
    if (monthNum) {
      return formatIsoDate(year, monthNum, day);
    }
  }

  return null;
}

// Extracts slot entities from user text
function extractSlots(text, currentYear = new Date().getFullYear()) {
  const slots = {};
  if (!text) return slots;

  const raw = text.trim();
  const lower = raw.toLowerCase();

  // 1. Booking ID / Code (e.g. BIT-GH-1001)
  const bookingIdMatch = raw.match(/\b(BIT-GH-\d{4})\b/i);
  if (bookingIdMatch) {
    slots.bookingId = bookingIdMatch[1].toUpperCase();
  }

  // 2. Complaint ID (e.g. CMP-2026-101)
  const complaintIdMatch = raw.match(/\b(CMP-\d{4}-\d{3,4})\b/i);
  if (complaintIdMatch) {
    slots.complaintId = complaintIdMatch[1].toUpperCase();
  }

  // 3. Date Range extraction: e.g. "from 15 November to 18 November", "15 Nov - 18 Nov", "15 to 18 Nov"
  const rangeMatch = lower.match(/(?:from\s+)?(\d{1,2}(?:st|nd|rd|th)?(?:\s+[a-z]+)?)\s*(?:to|-|until)\s*(\d{1,2}(?:st|nd|rd|th)?\s+[a-z]+(?:\s+\d{4})?)/i);
  if (rangeMatch) {
    let partA = rangeMatch[1].trim();
    let partB = rangeMatch[2].trim();

    // If partA is just a day number like "15" and partB has "18 Nov"
    if (/^\d{1,2}(?:st|nd|rd|th)?$/.test(partA)) {
      const monthPart = partB.replace(/^\d{1,2}(?:st|nd|rd|th)?\s*/, '');
      partA = `${partA} ${monthPart}`;
    }

    const d1 = parseDateString(partA, currentYear);
    const d2 = parseDateString(partB, currentYear);
    if (d1 && d2) {
      slots.checkIn = d1;
      slots.checkOut = d2;
    }
  }

  // Standalone dates if range was not found
  if (!slots.checkIn) {
    const ciMatch = lower.match(/(?:check[- ]?in|arriving|arrival|from)\s*(?:on|date|is)?\s*[:]?\s*([0-9a-z /-]+)/i);
    if (ciMatch) {
      const parsed = parseDateString(ciMatch[1], currentYear);
      if (parsed) slots.checkIn = parsed;
    }
  }

  if (!slots.checkOut) {
    const coMatch = lower.match(/(?:check[- ]?out|departing|departure|till|until|to)\s*(?:on|date|is)?\s*[:]?\s*([0-9a-z /-]+)/i);
    if (coMatch) {
      const parsed = parseDateString(coMatch[1], currentYear);
      if (parsed) slots.checkOut = parsed;
    }
  }

  // If user just provided a single date directly like "15 November" or "tomorrow"
  if (!slots.checkIn && !slots.checkOut) {
    const directDate = parseDateString(raw, currentYear);
    if (directDate) {
      slots.candidateDate = directDate;
    }
  }

  // 4. Guest Count
  const guestMatch = lower.match(/\b(\d+|one|two|three|four|five|six)\s*(?:guests?|people|persons?|adults?|members?)\b/i);
  if (guestMatch) {
    const val = guestMatch[1].toLowerCase();
    slots.guests = NUMBER_WORDS[val] ? NUMBER_WORDS[val] : parseInt(val, 10);
  } else if (lower.includes('for my parents and me') || lower.includes('three of us')) {
    slots.guests = 3;
  } else if (lower.includes('for my parents') || lower.includes('for my wife and me') || lower.includes('for two of us')) {
    slots.guests = 2;
  } else if (lower.includes('for myself') || lower.includes('just for me') || lower.includes('single')) {
    slots.guests = 1;
  }

  // 5. Room Number (e.g. "room 102", "room 205", "suite 114")
  const roomMatch = raw.match(/\b(?:room|suite|rm\.?)\s*(?:no\.?|#)?\s*([12]\d{2})\b/i);
  if (roomMatch) {
    slots.roomNumber = parseInt(roomMatch[1], 10);
  } else {
    // Isolated 3-digit room number 101-117, 201-216
    const isolatedRoomMatch = raw.match(/\b(10[1-9]|11[0-7]|20[1-9]|21[0-6])\b/);
    if (isolatedRoomMatch) {
      slots.roomNumber = parseInt(isolatedRoomMatch[1], 10);
    }
  }

  // 6. Guest Type
  if (lower.includes('student') || lower.includes('studying')) {
    slots.guestType = 'Student';
  } else if (lower.includes('parent') || lower.includes('father') || lower.includes('mother')) {
    slots.guestType = 'Parent';
  } else if (lower.includes('alumni') || lower.includes('alumnus') || lower.includes('graduated')) {
    slots.guestType = 'Alumni';
  } else if (lower.includes('visitor') || lower.includes('other college') || lower.includes('guest faculty') || lower.includes('external')) {
    slots.guestType = 'Other College Guest';
  }

  // 7. Full Name (Excludes categories like "a student", "a parent")
  const nameMatch = raw.match(/\b(?:my name is|name\s*[:=]|call me|guest\s+name\s*[:=]|i am\s+(?!a\s+|an\s+|the\s+))([a-zA-Z]+(?:\s+[a-zA-Z]+)+)/i);
  if (nameMatch) {
    const candidateName = nameMatch[1].trim();
    const candidateLower = candidateName.toLowerCase();
    if (
      !candidateLower.includes('student') &&
      !candidateLower.includes('parent') &&
      !candidateLower.includes('alumni') &&
      !candidateLower.includes('visitor') &&
      !candidateLower.includes('guest')
    ) {
      slots.name = candidateName;
    }
  }

  // 8. Phone Number (Domestic & International with country codes)
  const phoneMatch = raw.match(/(?:\+(\d{1,4})[\s-]?)?(\d{7,14})\b/);
  if (phoneMatch) {
    slots.phone = phoneMatch[0].trim();
  }

  // 9. Email Address
  const emailMatch = raw.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/);
  if (emailMatch) {
    slots.email = emailMatch[0].trim();
  }

  // 10. Roll Number (BIT format: BTECH/10045/22, MCA/10023/23, etc.)
  const rollMatch = raw.match(/\b([A-Z]{2,6}\/\d{4,6}\/\d{2})\b/i);
  if (rollMatch) {
    slots.rollNumber = rollMatch[1].toUpperCase();
  }

  // 11. Confirmation flags
  if (/^(yes|yep|sure|proceed|confirm|ok|okay|do it|go ahead|pay now)$/i.test(lower) || lower.includes('confirm booking') || lower.includes('proceed to book') || lower.includes('pay now')) {
    slots.isConfirmed = true;
  }
  if (/^(no|cancel|stop|don't|abort|exit)$/i.test(lower)) {
    slots.isCancelled = true;
  }

  // 12. Complaint / Maintenance issues
  if (
    lower.includes('complaint') ||
    lower.includes('not working') ||
    lower.includes('not cooling') ||
    lower.includes('broken') ||
    lower.includes('issue') ||
    lower.includes('problem') ||
    lower.includes('dirty') ||
    lower.includes('leaking') ||
    lower.includes('no hot water') ||
    lower.includes('ac not') ||
    lower.includes('slow net')
  ) {
    slots.isComplaint = true;

    if (lower.includes('ac') || lower.includes('cooling') || lower.includes('air conditioning') || lower.includes('remote') || lower.includes('temperature')) {
      slots.complaintCategory = 'Air Conditioning';
    } else if (lower.includes('water') || lower.includes('geyser') || lower.includes('tap') || lower.includes('plumbing') || lower.includes('leak') || lower.includes('flush')) {
      slots.complaintCategory = 'Plumbing / Geyser';
    } else if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('internet') || lower.includes('network')) {
      slots.complaintCategory = 'Wi-Fi / Internet';
    } else if (lower.includes('clean') || lower.includes('dirty') || lower.includes('towel') || lower.includes('linen') || lower.includes('housekeeping')) {
      slots.complaintCategory = 'Cleanliness / Housekeeping';
    } else if (lower.includes('light') || lower.includes('fan') || lower.includes('switch') || lower.includes('power') || lower.includes('electric')) {
      slots.complaintCategory = 'Electrical / Lights';
    } else {
      slots.complaintCategory = 'General';
    }

    slots.issueDescription = raw;
  }

  return slots;
}

// Determines the primary intent of the user message
function classifyIntent(text, slots = {}) {
  const lower = (text || '').toLowerCase();

  if (
    slots.complaintId ||
    slots.isComplaint ||
    lower.includes('complaint') ||
    lower.includes('report issue') ||
    lower.includes('not working') ||
    lower.includes('not cooling') ||
    lower.includes('broken')
  ) {
    return 'COMPLAINT';
  }

  if (lower.includes('cancel') || lower.includes('cancellation')) {
    return 'CANCEL';
  }

  if (lower.includes('modify') || lower.includes('change date') || lower.includes('reschedule') || lower.includes('change room')) {
    return 'MODIFY';
  }

  if (slots.bookingId || lower.includes('track') || lower.includes('status') || lower.includes('find my booking')) {
    return 'STATUS';
  }

  if (lower.includes('pay') || lower.includes('payment') || lower.includes('razorpay')) {
    return 'PAYMENT';
  }

  if (
    lower.includes('book') ||
    lower.includes('reservation') ||
    lower.includes('reserve') ||
    slots.checkIn ||
    slots.checkOut ||
    slots.roomNumber
  ) {
    return 'BOOKING';
  }

  if (
    lower.includes('available') ||
    lower.includes('vacancy') ||
    lower.includes('empty room') ||
    lower.includes('is there a room')
  ) {
    return 'AVAILABILITY';
  }

  if (
    lower.includes('tariff') ||
    lower.includes('price') ||
    lower.includes('cost') ||
    lower.includes('rule') ||
    lower.includes('timing') ||
    lower.includes('check in') ||
    lower.includes('check out') ||
    lower.includes('contact') ||
    lower.includes('food') ||
    lower.includes('mess') ||
    lower.includes('parking')
  ) {
    return 'FAQ';
  }

  return 'GENERAL';
}

module.exports = {
  parseDateString,
  extractSlots,
  classifyIntent,
};
