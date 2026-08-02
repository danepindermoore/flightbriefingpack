const BA_CONTRACT_TYPES = {

    FULL_TIME: {
        label: "Full Time",
        description: "Standard full time contract",
        workDays: null,
        offDays: null,
        cycleDays: null,
        dutyCode: null,
        autoGeneratePT: false
    },

    PT_875: {
        label: "87.5% (49 on / 7 off)",
        description: "7 weeks on / 1 week off",
        workDays: 49,
        offDays: 7,
        cycleDays: 56,
        dutyCode: "PT TIME NON WORKING FL8",
        autoGeneratePT: true
    },

    PT_21_7: {
        label: "75% (21 on / 7 off)",
        description: "21 days on / 7 days off",
        workDays: 21,
        offDays: 7,
        cycleDays: 28,
        dutyCode: "PT TIME NON WORKING",
        autoGeneratePT: true
    },

    PT_21_21: {
        label: "50% (21 on / 21 off)",
        description: "21 days on / 21 days off",
        workDays: 21,
        offDays: 21,
        cycleDays: 42,
        dutyCode: "PT TIME NON WORKING",
        autoGeneratePT: true
    },

    PT_21_42: {
        label: "33% (21 on / 42 off)",
        description: "21 days on / 42 days off",
        workDays: 21,
        offDays: 42,
        cycleDays: 63,
        dutyCode: "PT TIME NON WORKING",
        autoGeneratePT: true
    }

};