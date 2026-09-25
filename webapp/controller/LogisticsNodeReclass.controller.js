sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "ns/automatedsweepv4/automatedsweepv4/model/DateUtils"
], function (Controller, JSONModel, DateUtils) {
    "use strict";

    return Controller.extend("ns.automatedsweepv4.automatedsweepv4.controller.LogisticsNodeReclass", {

        onInit: function () {
            this.byId("PostingStartDateL").setValue(DateUtils.getFirstDayLastMonth());
            this.byId("PostingEndDateL").setValue(DateUtils.getLastDayLastMonth());
            this.byId("PostingActDateL").setValue(DateUtils.getTodayISO());
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },

        onLogisticsNodeReclassReview: function () {
            var sPostingStartDate = this.byId("PostingStartDateL").getValue();
            var sPostingEndDate = this.byId("PostingEndDateL").getValue();
            var sPostingActDate = this.byId("PostingActDateL").getValue();
            var bTestRun = this.byId("testRunL").getSelected();

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
                "logisticsNodeReclassParams"
            );

            // Parameter order must match the route pattern in manifest.json.
            this.getOwnerComponent().getRouter().navTo("LogisticsNodeReclassReview", {
                PostingStartDate: sPostingStartDate || "",
                PostingEndDate: sPostingEndDate || "",
                PostingActDate: sPostingActDate || ""
            });
        }
    });
});
