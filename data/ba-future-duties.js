const BA_FUTURE_DUTY_TYPES = {

    ANNUAL_LEAVE: {

        sortOrder: 1,

        label: "Annual Leave",

        calendarTitle: "ANNUAL LEAVE",

        allDay: true,

        supportsDateRange: true,

        supportsWrapDays: true,

        minimumWrapLength: 5

    },

    MEDICAL_DAY: {

        sortOrder: 2,

        label: "Medical Day",

        calendarTitle: "MEDICAL DAY",

        allDay: true,

        supportsDateRange: false,

        supportsWrapDays: false

    },

   DEPENDENCY_DAY: {

        sortOrder: 3,

        label: "Dependency Day",

        calendarTitle: "DEPENDENCY DAY",

        allDay: true,

        supportsDateRange: true,

        supportsWrapDays: false

    },

    MOVING_DAY: {

        sortOrder: 4,

        label: "Moving Day",

        calendarTitle: "MOVING DAY",

        allDay: true,

        supportsDateRange: true,

        supportsWrapDays: false

    }

};