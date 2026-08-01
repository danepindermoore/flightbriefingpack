/*
=========================================================
British Airways Roster Data
Flight Briefing Pack
Version: 1.0.0
=========================================================

Master reference for British Airways roster codes.

The roster parser remains the source of truth for
dates, times and flights.

This file describes what each roster code represents
and how Flight Briefing Pack should handle it.

=========================================================
*/

const BA_ROSTER_DATA = {

    //=====================================================
    // OFF DAYS
    //=====================================================

    OFF: {

        officialName: "OFF",

        calendarTitle: "OFF DUTY",

        description: "Roster code used for an OFF day. The earliest you can report after an OFF day is 6am, and the latest you can clear before an OFF day is 10pm (with a 30-minute grace period).",

        category: "off",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "green",

        icon: "off"

    },

    "OFF DUTY": {

        officialName: "OFF DUTY",

        calendarTitle: "OFF DUTY",

        description: "Roster code used for an OFF day. The earliest you can report after an OFF day is 6am, and the latest you can clear before an OFF day is 10pm (with a 30-minute grace period).",

        category: "off",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "green",

        icon: "off"

    },

    NOP: {

        officialName: "NOP",

        calendarTitle: "NON OP",

        description: "The roster code for a Non-Operational day.",

        category: "off",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "green",

        icon: "off"

    },

    "NON OP": {

        officialName: "NON OP",

        calendarTitle: "NON OP",

        description: "The roster code for a Non-Operational day.",

        category: "off",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "green",

        icon: "off"

    },

    NOR: {

        officialName: "NOR",

        calendarTitle: "NON OP",

        description: "The roster code for a Non-Operational day received after a cancellation. You can volunteer to be contacted and/or check your roster ahead of this type of day to be allocated a replacement duty.",

        category: "off",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "green",

        icon: "off"

    },

    NOU: {

        officialName: "NOU",

        calendarTitle: "NON OP",

        description: "Another roster code for a Non-Operational day. You may have been usable, but there were no duties available to allocate you.",

        category: "off",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "green",

        icon: "off"

    },

    SDO: {

        officialName: "SDO",

        calendarTitle: "STANDBY DAY OFF",

        description: "Standby Day Off. A flexible day off that can be moved within a Flexiblock to ensure you are usable throughout the block. As of October 2025, this type of day may form part of your monthly days off.",

        category: "off",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "green",

        icon: "off"

    },

    "STANDBY FLEXI DAY OFF": {

        officialName: "STANDBY FLEXI DAY OFF",

        calendarTitle: "STANDBY FLEXI DAY OFF",

        description: "Standby Flexi Day Off.",

        category: "off",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "green",

        icon: "off"

    },

    TDY: {

        officialName: "TDY",

        calendarTitle: "TRUMP DAY",

        description: "Roster code for a Trump Day. Pre-assigned days off that form part of your monthly days off.",

        category: "off",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "green",

        icon: "off"

    },

    OIL: {

        officialName: "OIL",

        calendarTitle: "OFF IN LIEU",

        description: "An owed day given when your trip has extended into an OFF day. Must be used within six months from the date of accrual.",

        category: "off",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "green",

        icon: "off"

    },

    //=====================================================
    // LEAVE
    //=====================================================

    ADL: {

        officialName: "ADL",

        calendarTitle: "ADHOC UNPAID LEAVE",

        description: "Adhoc Unpaid Leave. Time off that is either requested or allocated if you are unable to fulfil duties (for example due to a no-show). This day is unpaid and deducted at 1/365th of your basic salary.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    AL: {

        officialName: "AL",

        calendarTitle: "ANNUAL LEAVE",

        description: "Roster code for Annual Leave, marking pre-approved days officially off duty for rest, travel or personal time. Split into years and seasons, with minimum leave required in each season.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    BVL: {

        officialName: "BVL",

        calendarTitle: "BEREAVEMENT LEAVE",

        description: "Roster code used to grant time off for bereavement purposes, such as following the death of a close family member or loved one.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    CAL: {

        officialName: "CAL",

        calendarTitle: "CARER'S LEAVE",

        description: "Roster code used to grant time off to care for an immediate family member or dependent who is unwell, injured or in need of essential support.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    CMP: {

        officialName: "CMP",

        calendarTitle: "COMPASSIONATE LEAVE",

        description: "Roster code signifying approved time away from duties to deal with urgent personal or family matters.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    DPL: {

        officialName: "DPL",

        calendarTitle: "DEPENDENCY LEAVE",

        description: "Roster code indicating authorised time off granted to care for a dependent, such as a child, partner or relative, during illness, emergencies or other situations requiring direct support.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    FVI: {

        officialName: "FVI",

        calendarTitle: "FERTILITY TREATMENT",

        description: "Roster code used to denote time off for fertility treatment, covering medical appointments and procedures related to assisted conception.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    NNL: {

        officialName: "NNL",

        calendarTitle: "NEONATAL LEAVE",

        description: "Roster code used to support time off for neonatal care of a baby or child.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    PBL: {

        officialName: "PBL",

        calendarTitle: "PARENTAL BEREAVEMENT LEAVE",

        description: "Roster code used to block the roster for a period of parental bereavement leave.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    PTL: {

        officialName: "PTL",

        calendarTitle: "PARENTAL LEAVE",

        description: "Time off for parents that can be requested through the Policy and Support team.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    SPL: {

        officialName: "SPL",

        calendarTitle: "SPECIAL LEAVE",

        description: "Roster code applied by the Cabin Crew Management Team in certain circumstances, including court attendance or training. Payment depends on the circumstances.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    VOL: {

        officialName: "VOL",

        calendarTitle: "VOLUNTARY DUTY",

        description: "Special leave requested through the Cabin Crew Management Team to complete voluntary duties such as Armed Forces or British Red Cross commitments.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },


    //=====================================================
    // STANDBY & RESERVE
    //=====================================================

    AFS: {

        officialName: "AFS",

        calendarTitle: "AIRPORT STANDBY",

        description: "Airport Standby allocated after returning from sickness. Will trigger payment of £130.62.",

        category: "standby",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "standby"

    },

    AV: {

        officialName: "AV",

        calendarTitle: "AVAILABLE DAY",

        description: "Shortened version of an Available Day. You can be rostered 10 Available Days per calendar year.",

        category: "available",

        eventType: "allday",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "available"

    },

    AVC: {

        officialName: "AVC",

        calendarTitle: "AVAILABLE DAY",

        description: "Available Day due to Cancellation. Given when flights are cancelled with no replacement available. Counts towards your Reserve/Standby allocation.",

        category: "available",

        eventType: "allday",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "available"

    },

    AVF: {

        officialName: "AVF",

        calendarTitle: "AVAILABLE DAY",

        description: "Available Day within Flexiblock. A maximum of five may be rostered within a Flexiblock.",

        category: "available",

        eventType: "allday",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "available"

    },

    HCD: {

        officialName: "HCD",

        calendarTitle: "HOME CONTACTABILITY",

        description: "Home Contactability Duty Window. You must remain contactable and be prepared to report for duty or prepare for a following-day duty if required.",

        category: "standby",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "standby"

    },

    HCF: {

        officialName: "HCF",

        calendarTitle: "HOME CONTACTABILITY",

        description: "Home Contactability Duty Window following requested support or roster adjustments, or within Flexiblock. Does not count towards the annual HCD limit.",

        category: "standby",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "standby"

    },

    HSB: {

        officialName: "HSB",

        calendarTitle: "HOME STANDBY",

        description: "Home Standby duty.",

        category: "standby",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "standby"

    },

    HSD: {

        officialName: "HSD",

        calendarTitle: "HOME STANDBY",

        description: "Home Standby allocated following disruption or as an additional Home Standby within Flexiblock. Will trigger payment of £130.62.",

        category: "standby",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "standby"

    },

    HSS: {

        officialName: "HSS",

        calendarTitle: "HOME STANDBY",

        description: "Home Standby allocated following sickness. Primarily used for Gatwick colleagues.",

        category: "standby",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "standby"

    },

    RSF: {

        officialName: "RSF",

        calendarTitle: "RESERVE",

        description: "Reserve Day that is swappable on CrewSwap. Commonly used following return from long-term sickness where duties remain to be allocated.",

        category: "reserve",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "amber",

        icon: "reserve"

    },

    RSV: {

        officialName: "RSV",

        calendarTitle: "RESERVE",

        description: "Reserve Day. You must be available to cover unplanned duties if required. Usually created following roster changes and is not swappable on CrewSwap.",

        category: "reserve",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "amber",

        icon: "reserve"

    },

    SBA: {

        officialName: "SBA",

        calendarTitle: "AIRPORT STANDBY",

        description: "Airport Standby requested voluntarily by the crew member. Does not trigger payment.",

        category: "standby",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "standby"

    },

    SBC: {

        officialName: "SBC",

        calendarTitle: "AIRPORT STANDBY",

        description: "Airport Standby allocated following a cancellation. Will trigger payment of £175.",

        category: "standby",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "standby"

    },

    SBD: {

        officialName: "SBD",

        calendarTitle: "AIRPORT STANDBY",

        description: "Airport Standby allocated during disruption or as an additional Airport Standby within Flexiblock. Will trigger payment of £175.",

        category: "standby",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "standby"

    },

    SBF: {

        officialName: "SBF",

        calendarTitle: "AIRPORT STANDBY",

        description: "Second Airport Standby within Flexiblock. Does not trigger payment.",

        category: "standby",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "standby"

    },

    SBM: {

        officialName: "SBM",

        calendarTitle: "AIRPORT STANDBY",

        description: "First Airport Standby within Flexiblock. Starts the 100-day Flexiblock separation rule and does not trigger payment.",

        category: "standby",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "standby"

    },

    SBX: {

        officialName: "SBX",

        calendarTitle: "AIRPORT STANDBY",

        description: "Long Airport Standby covering SIN/SYD or SCL trips. Not normally used following the introduction of Flexiblock.",

        category: "standby",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "standby"

    },

    SBY: {

        officialName: "SBY",

        calendarTitle: "AIRPORT STANDBY",

        description: "General abbreviation used for Airport Standby.",

        category: "standby",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "orange",

        icon: "standby"

    },

    WR: {

        officialName: "WR",

        calendarTitle: "WORKING RESERVE",

        description: "Working Reserve duty.",

        category: "reserve",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "amber",

        icon: "reserve"

    },


    //=====================================================
    // TRAINING
    //=====================================================

    CMS: {

        officialName: "CMS",

        calendarTitle: "CLUB SERVICE SPECIALIST TRAINING",

        description: "Roster code for one of the days of the Club Service Specialist training. Completed as part of a two-day course.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    CST: {

        officialName: "CST",

        calendarTitle: "CUSTOMER SERVICE TRAINING",

        description: "Roster code for Customer Service Training. Often found as part of a New Entrant or Return To Work course.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    CWC: {

        officialName: "CWC",

        calendarTitle: "CLUB WORLD TRAINING",

        description: "Roster code for the Club World course for Gatwick colleagues. Part of a two-day course.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    CWT: {

        officialName: "CWT",

        calendarTitle: "CLUB WORLD TRAINING",

        description: "Roster code for the Club World training course for Heathrow colleagues. Part of a two-day course.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    EEX: {

        officialName: "EEX",

        calendarTitle: "SCCM REFLECTION DAY",

        description: "Roster code for the SCCM Reflection Day. A single training day for engagement.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    EFC: {

        officialName: "EFC",

        calendarTitle: "ENHANCED FIRST CLASS",

        description: "Roster code for the Enhanced First Class training. Completed as part of a four-day course.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    IFT: {

        officialName: "IFT",

        calendarTitle: "LEADING THE WAY LIVE",

        description: "Leading the Way Live – a one-day training course for senior cabin crew.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    ITP: {

        officialName: "ITP",

        calendarTitle: "MENTAL HEALTH FIRST AID",

        description: "Mental Health First Aid course. Rostered on a voluntary basis after sign-ups via Ascend.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    ITU: {

        officialName: "ITU",

        calendarTitle: "SHORT-HAUL CUSTOMER SERVICE",

        description: "Short-haul customer service day. A required element of the Return To Work course.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    LCD: {

        officialName: "LCD",

        calendarTitle: "LONGHAUL CUSTOMER DAY",

        description: "Roster code for Longhaul Customer Day training. Often seen as part of a New Entrant or Return To Work course.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    PCQ: {

        officialName: "PCQ",

        calendarTitle: "CLUB SERVICE SPECIALIST",

        description: "Roster code for one of the days of the Club Service Specialist training. Completed as part of a two-day course.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    PCT: {

        officialName: "PCT",

        calendarTitle: "FIRST SERVICE SPECIALIST",

        description: "Roster code for the final day of the First Service Specialist training. Completed as part of a four-day course.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    R12: {

        officialName: "R12",

        calendarTitle: "12 MONTH REVIEW",

        description: "A new entrant's 12-month checkpoint with a manager to ensure completion of probation requirements.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    RYB: {

        officialName: "RYB",

        calendarTitle: "RECENCY VIDEOS",

        description: "Recency videos assigned when the 90-day expiry has passed on an aircraft type. Must be completed before operating.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    SCM: {

        officialName: "SCM",

        calendarTitle: "SENIOR CREW TRAINING",

        description: "Roster code seen on the roster for senior crew member training.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    SCS: {

        officialName: "SCS",

        calendarTitle: "SENIOR CREW TRAINING",

        description: "Another roster code used for senior crew member training.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    SFT: {

        officialName: "SFT",

        calendarTitle: "LEADING CABIN SAFETY",

        description: "Leading Cabin Safety – a one-day training course for senior cabin crew.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    SRT: {

        officialName: "SRT",

        calendarTitle: "SEP TRAINING",

        description: "Roster code for the first day of the three-day SEP course.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    TMS: {

        officialName: "TMS",

        calendarTitle: "MISCELLANEOUS TRAINING",

        description: "Roster code for Miscellaneous Training, often used during Club World training.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    TNE: {

        officialName: "TNE",

        calendarTitle: "NEW ENTRANT TRAINING",

        description: "Roster code used on the New Entrant training course and as a placeholder during the Return To Work course.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },


    //=====================================================
    // MEETINGS, MEDICAL & GROUND DUTIES
    //=====================================================

    ATM: {

        officialName: "ATM",

        calendarTitle: "ATTENDANCE MEETING",

        description: "Attendance Meeting arranged by the Cabin Crew Management Team or Policy and Support at a specified time on the roster. Can be linked to a duty if specified requirements are met.",

        category: "meeting",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "cyan",

        icon: "meeting"

    },

    CCC: {

        officialName: "CCC",

        calendarTitle: "CREWCARE",

        description: "Roster code used for any CrewCare duties.",

        category: "ground",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "grey",

        icon: "ground"

    },

    CXF: {

        officialName: "CXF",

        calendarTitle: "CANCELLED FLIGHT",

        description: "The roster code used following a cancelled flight.",

        category: "operations",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "red",

        icon: "operations"

    },

    DNO: {

        officialName: "DNO",

        calendarTitle: "DID NOT OPERATE",

        description: "The roster code used after briefing for a flight where the flight is cancelled before boarding begins.",

        category: "operations",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "red",

        icon: "operations"

    },

    GDD: {

        officialName: "GDD",

        calendarTitle: "GROUND DUTY",

        description: "Roster code for a Ground Duty.",

        category: "ground",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "grey",

        icon: "ground"

    },

    GDL: {

        officialName: "GDL",

        calendarTitle: "GROUND DUTY",

        description: "Roster code for a Ground Duty rostered to a Lead IFM.",

        category: "ground",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "grey",

        icon: "ground"

    },

    GRD: {

        officialName: "GRD",

        calendarTitle: "GROUND DUTY",

        description: "Roster code for a Ground Duty for an unspecified event.",

        category: "ground",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "grey",

        icon: "ground"

    },

    GRN: {

        officialName: "GRN",

        calendarTitle: "GROUND DUTY",

        description: "Roster code for another type of Ground Duty.",

        category: "ground",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "grey",

        icon: "ground"

    },

    JRY: {

        officialName: "JRY",

        calendarTitle: "JURY DUTY",

        description: "Roster activity code used when you submit information to the Cabin Crew Management Team to advise that you are required for Jury Duty. These days are paid.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    MAG: {

        officialName: "MAG",

        calendarTitle: "MEET & GREET",

        description: "Roster code used when you brief and board an aircraft, and the flight is subsequently cancelled.",

        category: "operations",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "red",

        icon: "operations"

    },

    MED: {

        officialName: "MED",

        calendarTitle: "MEDICAL",

        description: "Activity code for a medical day on the roster.",

        category: "medical",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "red",

        icon: "medical"

    },

    MOP: {

        officialName: "MOP",

        calendarTitle: "MINOR OPERATION",

        description: "Activity code for a medical day relating to a minor operation.",

        category: "medical",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "red",

        icon: "medical"

    },

    MOV: {

        officialName: "MOV",

        calendarTitle: "MOVING DAY",

        description: "Activity code for a moving day. You may request up to two paid moving days every five years with supporting documentation.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    PUD: {

        officialName: "PUD",

        calendarTitle: "PUBLIC DUTIES",

        description: "Roster code for Public Duties such as magistrate or school governor responsibilities.",

        category: "leave",

        eventType: "allday",

        calendar: true,

        briefing: false,

        colour: "purple",

        icon: "leave"

    },

    REC: {

        officialName: "REC",

        calendarTitle: "RECOGNITION EVENT",

        description: "Recognition event. Thank You Fest normally appears on the roster with this code.",

        category: "event",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "teal",

        icon: "event"

    },

    RNF: {

        officialName: "RNF",

        calendarTitle: "ROSTER NO FLIGHTS",

        description: "Roster code used upon approval from BAHS to spread work for medical reasons, or after involvement in an IMR situation.",

        category: "medical",

        eventType: "allday",

        calendar: true,

        briefing: true,

        colour: "red",

        icon: "medical"

    },

    SVC: {

        officialName: "SVC",

        calendarTitle: "SERVICE NOT SPECIFIED",

        description: "Roster code used to block the roster for an activity or trip that has not yet been created in the system.",

        category: "operations",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "grey",

        icon: "operations"

    },

    TRA: {

        officialName: "TRA",

        calendarTitle: "RISK ASSESSMENT",

        description: "Duty assigned on request from Cabin Crew Management Team and BAHS to complete an appropriate risk assessment.",

        category: "ground",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "grey",

        icon: "ground"

    },

    TSP: {

        officialName: "TSP",

        calendarTitle: "TRANSPORT",

        description: "Roster code for transport, often associated with training, base transfers or duties from another base.",

        category: "ground",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "grey",

        icon: "ground"

    },

    TUB: {

        officialName: "TUB",

        calendarTitle: "TRADE UNION",

        description: "Roster code for Trade Union Representatives completing non-BA meetings or duties.",

        category: "union",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "grey",

        icon: "union"

    },

    TUO: {

        officialName: "TUO",

        calendarTitle: "TRADE UNION OFFICE",

        description: "Roster code for Trade Union Representatives completing office duties.",

        category: "union",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "grey",

        icon: "union"

    },

    TUU: {

        officialName: "TUU",

        calendarTitle: "TRADE UNION",

        description: "Roster code for Trade Union Representatives completing other non-BA meetings or duties.",

        category: "union",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "grey",

        icon: "union"

    },

    TWB: {

        officialName: "TWB",

        calendarTitle: "CABIN CREW REFLECTION DAY",

        description: "Cabin Crew Reflection Day. Can be rostered anywhere between months and a year from your start date.",

        category: "training",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "blue",

        icon: "training"

    },

    UKM: {

        officialName: "UKM",

        calendarTitle: "MEETING",

        description: "Meeting requested by the Cabin Crew Management Team or Policy team. Should not normally be linked to duties.",

        category: "meeting",

        eventType: "timed",

        calendar: true,

        briefing: true,

        colour: "cyan",

        icon: "meeting"

    },


    //=====================================================
    // QUALIFICATIONS & SPECIALIST DUTIES
    //=====================================================

    FSR: {

        officialName: "FSR",

        calendarTitle: "FIRST SERVICE SPECIALIST",

        description: "Qualification code indicating the crew member is qualified as a First Service Specialist.",

        category: "qualification",

        eventType: "none",

        calendar: false,

        briefing: false,

        colour: "navy",

        icon: "qualification"

    },

    CSS: {

        officialName: "CSS",

        calendarTitle: "CLUB SERVICE SPECIALIST",

        description: "Qualification code indicating the crew member is qualified as a Club Service Specialist.",

        category: "qualification",

        eventType: "none",

        calendar: false,

        briefing: false,

        colour: "navy",

        icon: "qualification"

    },

    SCCM: {

        officialName: "SCCM",

        calendarTitle: "SENIOR CABIN CREW MEMBER",

        description: "Qualification indicating the crew member is qualified to operate as Senior Cabin Crew Member.",

        category: "qualification",

        eventType: "none",

        calendar: false,

        briefing: false,

        colour: "navy",

        icon: "qualification"

    },

    IFM: {

        officialName: "IFM",

        calendarTitle: "INFLIGHT MANAGER",

        description: "Qualification indicating the crew member is qualified to operate as an Inflight Manager.",

        category: "qualification",

        eventType: "none",

        calendar: false,

        briefing: false,

        colour: "navy",

        icon: "qualification"

    }

};
