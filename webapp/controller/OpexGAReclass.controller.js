sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "ns/automatedsweepv4/automatedsweepv4/model/DateUtils"
], function (Controller, JSONModel, DateUtils) {
    "use strict";

    return Controller.extend("ns.automatedsweepv4.automatedsweepv4.controller.OpexGAReclass", {

        onInit: function () {
            this.byId("PostingStartDateO").setValue(DateUtils.getFirstDayLastMonth());
            this.byId("PostingEndDateO").setValue(DateUtils.getLastDayLastMonth());
            this.byId("PostingActDateO").setValue(DateUtils.getTodayISO());
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },

        onOpexGAReclassReview: function () {
            var sPostingStartDate = this.byId("PostingStartDateO").getValue();
            var sPostingEndDate = this.byId("PostingEndDateO").getValue();
            var sPostingActDate = this.byId("PostingActDateO").getValue();
            var bTestRun = this.byId("testRunO").getSelected();

            if (sPostingStartDate && (!sPostingEndDate || sPostingEndDate.trim() === "")) {
                sPostingEndDate = sPostingStartDate;
            }

            this.getOwnerComponent().setModel(
                new JSONModel({
                    PostingStartDate: sPostingStartDate,
                    PostingEndDate: sPostingEndDate,
                    PostingActDate: sPostingActDate,
                    TestRun: bTestRun
                }),
                "opexGAReclassParams"
            );

            // Parameter order must match the route pattern in manifest.json.
            this.getOwnerComponent().getRouter().navTo("OpexGAReclassReview", {
                PostingStartDate: sPostingStartDate || "",
                PostingEndDate: sPostingEndDate || "",
                PostingActDate: sPostingActDate || ""
            });
        }
    });
});
