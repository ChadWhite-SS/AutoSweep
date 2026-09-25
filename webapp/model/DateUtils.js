sap.ui.define([], function () {
    "use strict";

    function pad(n) {
        return String(n).padStart(2, "0");
    }

    function formatDate(oDate) {
        return oDate.getFullYear() + "-" + pad(oDate.getMonth() + 1) + "-" + pad(oDate.getDate());
    }

    return {
        formatDate: formatDate,

        getTodayISO: function () {
            return formatDate(new Date());
        },

        getFirstDayLastMonth: function () {
            var oToday = new Date();
            return formatDate(new Date(oToday.getFullYear(), oToday.getMonth() - 1, 1));
        },

        getLastDayLastMonth: function () {
            var oToday = new Date();
            return formatDate(new Date(oToday.getFullYear(), oToday.getMonth(), 0));
        }
    };
});
