// Structured Knowledge Base for BIT Mesra Guest House Booking Portal

const GUESTHOUSE_KNOWLEDGE = {
  overview: {
    name: 'Birla Institute of Technology (BIT) Mesra Guest House',
    location: 'Main Campus, BIT Mesra, Ranchi, Jharkhand - 835215, India',
    connectivity: 'Located ~16 km from Ranchi Railway Station (Hatia / Ranchi Jn) and ~25 km from Birsa Munda Airport (IXR). Taxis, Ola/Uber, and auto-rickshaws operate 24/7 directly to campus.',
    totalRooms: 33,
    floors: [
      { floor: 1, rooms: '101 to 117 (17 Executive Suites)', description: 'Ground level access, elevator adjacent, nearest to reception & dining hall.' },
      { floor: 2, rooms: '201 to 216 (16 Executive Suites)', description: 'Elevated view of campus greenery and serene lake frontage.' },
    ],
  },
  tariff: {
    roomType: 'AC Executive Suite',
    ratePerNight: 1200,
    currency: 'INR (₹)',
    taxes: 'Inclusive of all taxes, institutional amenities, high-speed Wi-Fi, and 100% DG power backup.',
    calculation: 'Total Cost = Number of Nights × ₹1,200',
  },
  timings: {
    checkIn: '12:00 PM (Noon)',
    checkOut: '11:00 AM',
    earlyCheckInPolicy: 'Early check-in from 8:00 AM is complimentary subject to room vacancy from previous night.',
    lateCheckOutPolicy: 'Late check-out up to 2:00 PM available upon prior front-desk approval.',
  },
  facilities: [
    'Split Air Conditioning (1.5 Ton) with individual remote control in all 33 rooms',
    'High-Speed Campus Academic Wi-Fi (1 Gbps NKN optical fiber connection)',
    '43-inch Smart LED TV with satellite channels',
    'Attached modern bathroom with 24x7 geyser hot water & fresh toiletries',
    'Spacious work/study desk with ergonomic chair and reading lamp',
    'Electric tea/coffee kettle with daily replenishments and complimentary mineral water',
    '24/7 Power backup with dedicated campus diesel generators',
    'Elevator and wheelchair accessible ground floor access',
  ],
  dining: {
    venue: 'Guest House Dining Hall (Ground Floor)',
    timings: {
      breakfast: '7:30 AM - 9:30 AM',
      lunch: '12:30 PM - 2:30 PM',
      eveningTea: '4:30 PM - 6:00 PM',
      dinner: '8:00 PM - 10:00 PM',
    },
    mealType: 'Fresh, nutritious North & South Indian vegetarian and non-vegetarian thali meals at subsidized university mess rates.',
    roomService: 'Morning bed tea and light snacks can be requested at reception.',
  },
  parking: {
    availability: 'Spacious complimentary on-campus parking for cars and two-wheelers with 24-hour campus security.',
  },
  idRules: {
    Student: 'Valid BIT Mesra Roll Number, Academic Department, and Year of Study.',
    Parent: "Visiting student's full name, Roll Number, relationship, and Valid Govt ID (Aadhaar, Voter ID, Passport, or DL).",
    Alumni: 'Graduation Passout Year, Branch / Degree, and Valid Govt ID.',
    'Other College Guest': 'Home Institution/University Name, Sponsoring BIT Faculty / Department, and Valid Govt ID.',
  },
  cancellationPolicy: {
    freeCancellation: 'Full 100% refund if cancelled at least 24 hours prior to the check-in date (12:00 PM).',
    lateCancellation: '50% retention charge if cancelled within 24 hours of check-in.',
    refundProcessing: 'Refunds are automatically processed to the original payment mode within 3-5 working days.',
  },
  extraBed: {
    policy: 'One extra rollaway cot can be arranged for ₹300 per night upon request at check-in for accompanying children or extra guests.',
  },
  wardenOffice: {
    office: 'Warden Office, Guest House Reception, BIT Mesra, Ranchi - 835215',
    phone: '+91 651 2275444 / +91 651 2275896 (Ext: 4432)',
    email: 'guesthouse@bitmesra.ac.in / warden.gh@bitmesra.ac.in',
    officeHours: 'Monday – Saturday: 9:00 AM – 6:00 PM. Emergency reception operates 24/7.',
  },
};

function queryKnowledgeBase(topic) {
  const query = (topic || '').toLowerCase();

  if (query.includes('tariff') || query.includes('price') || query.includes('cost') || query.includes('rate') || query.includes('how much') || query.includes('charge')) {
    return {
      title: 'Tariff & Room Pricing',
      content: `The BIT Mesra Guest House offers 33 AC Executive Suites at a flat rate of ₹1,200 per night per room. All rates include high-speed Wi-Fi, air conditioning, daily housekeeping, hot water geyser, and 100% DG power backup. Total = Nights × ₹1,200.`,
      raw: GUESTHOUSE_KNOWLEDGE.tariff,
    };
  }

  if (query.includes('timing') || query.includes('checkin') || query.includes('check-in') || query.includes('checkout') || query.includes('check-out') || query.includes('early check')) {
    return {
      title: 'Check-In & Check-Out Timings',
      content: `Standard Check-In is at 12:00 PM (Noon), and Check-Out is at 11:00 AM. Early check-in from 8:00 AM and late check-out up to 2:00 PM are available upon front-desk availability without extra charge.`,
      raw: GUESTHOUSE_KNOWLEDGE.timings,
    };
  }

  if (query.includes('id') || query.includes('rule') || query.includes('document') || query.includes('eligibility') || query.includes('who can book') || query.includes('gate pass')) {
    return {
      title: 'Identity Verification & Gate Pass Rules',
      content: `Eligible Categories for accommodation:
1. Students: BIT Roll Number, Department, and Year.
2. Parents: Visiting student's name, roll number, relationship, and Govt ID.
3. Alumni: Passout year, branch/degree, and Govt ID.
4. Other College Guests: Institution name, sponsoring BIT department/faculty, and Govt ID.
A physical or DigiLocker Govt ID must be presented at the campus security gate and reception.`,
      raw: GUESTHOUSE_KNOWLEDGE.idRules,
    };
  }

  if (query.includes('food') || query.includes('dining') || query.includes('meal') || query.includes('breakfast') || query.includes('dinner') || query.includes('lunch') || query.includes('canteen')) {
    return {
      title: 'Dining Hall & Meal Timings',
      content: `The Guest House has a dedicated dining hall on the Ground Floor:
• Breakfast: 7:30 AM – 9:30 AM
• Lunch: 12:30 PM – 2:30 PM
• Evening Tea: 4:30 PM – 6:00 PM
• Dinner: 8:00 PM – 10:00 PM
Fresh, hygienic vegetarian and non-vegetarian thali meals are prepared daily at subsidized university mess rates.`,
      raw: GUESTHOUSE_KNOWLEDGE.dining,
    };
  }

  if (query.includes('wifi') || query.includes('internet') || query.includes('network')) {
    return {
      title: 'Campus Wi-Fi Connectivity',
      content: `Complimentary high-speed Wi-Fi (1 Gbps National Knowledge Network - NKN) is available throughout all 33 guest suites. Network credentials and guest login vouchers are provided at the reception desk during check-in.`,
      raw: { wifi: '1 Gbps Academic Network' },
    };
  }

  if (query.includes('hot water') || query.includes('geyser') || query.includes('bath') || query.includes('toilet') || query.includes('shower')) {
    return {
      title: 'Washroom & Hot Water Facility',
      content: `Every Executive Suite features an attached private bathroom equipped with a dedicated 24x7 geyser for instant hot water, fresh sanitized towels, and complimentary toiletries.`,
      raw: { hotWater: '24/7 Instant Geyser' },
    };
  }

  if (query.includes('extra bed') || query.includes('mattress') || query.includes('extra person') || query.includes('children')) {
    return {
      title: 'Extra Bed / Guest Policy',
      content: `Each Executive Suite accommodates 2 adults comfortably. An extra rollaway bed can be arranged for ₹300 per night by requesting the front desk. Children below 10 years stay complimentary with parents.`,
      raw: GUESTHOUSE_KNOWLEDGE.extraBed,
    };
  }

  if (query.includes('floor') || query.includes('first floor') || query.includes('second floor') || query.includes('view') || query.includes('elevator') || query.includes('lift')) {
    return {
      title: 'Floor Options & Layout',
      content: `The Guest House spans 2 floors:
• Floor 1 (Rooms 101-117): Ground level access, wheelchair accessible, closest to the reception desk and dining hall.
• Floor 2 (Rooms 201-216): Elevated tranquil suites overlooking the lush green campus gardens and lake frontage.
Guests can select their preferred floor during booking.`,
      raw: GUESTHOUSE_KNOWLEDGE.overview.floors,
    };
  }

  if (query.includes('cancellation') || query.includes('refund') || query.includes('cancel policy')) {
    return {
      title: 'Cancellation & Refund Policy',
      content: `Guests can cancel bookings with 100% full refund up to 24 hours before the scheduled check-in date. Cancellations within 24 hours incur a 50% charge. Refunds are credited back to your account within 3 to 5 business days.`,
      raw: GUESTHOUSE_KNOWLEDGE.cancellationPolicy,
    };
  }

  if (query.includes('parking') || query.includes('car') || query.includes('vehicle')) {
    return {
      title: 'Parking & Vehicle Facilities',
      content: `Free, secure on-campus parking is available for all guests right outside the Guest House complex with 24-hour university security.`,
      raw: GUESTHOUSE_KNOWLEDGE.parking,
    };
  }

  if (query.includes('contact') || query.includes('phone') || query.includes('email') || query.includes('warden') || query.includes('address') || query.includes('location') || query.includes('reach') || query.includes('airport') || query.includes('station')) {
    return {
      title: 'Contact Information & Getting Here',
      content: `Warden Office, Guest House Reception, BIT Mesra, Ranchi - 835215.
• Phone: +91 651 2275444 / Ext: 4432
• Email: guesthouse@bitmesra.ac.in
• From Ranchi Railway Station: ~16 km (~35 mins by cab/auto)
• From Birsa Munda Airport: ~25 km (~45 mins by cab)
Reception operates 24/7 for guest assistance.`,
      raw: GUESTHOUSE_KNOWLEDGE.wardenOffice,
    };
  }

  // Default summary
  return {
    title: 'BIT Mesra Guest House Overview',
    content: `BIT Mesra Guest House features 33 AC Executive Suites across 2 floors at a flat rate of ₹1,200/night. Facilities include high-speed Wi-Fi, ground floor dining hall, 24x7 geyser hot water, complimentary parking, and 24/7 security. Check-in: 12:00 PM, Check-out: 11:00 AM.`,
    raw: GUESTHOUSE_KNOWLEDGE,
  };
}

module.exports = {
  GUESTHOUSE_KNOWLEDGE,
  queryKnowledgeBase,
};
