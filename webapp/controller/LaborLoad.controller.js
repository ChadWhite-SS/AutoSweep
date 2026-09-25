sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "ns/automatedsweepv4/automatedsweepv4/model/DateUtils"
], function (Controller, JSONModel, DateUtils) {
    "use strict";

    return Controller.extend("ns.automatedsweepv4.automatedsweepv4.controller.LaborLoad", {

        onInit: function () {
            this.byId("PostingStartDate").setValue(DateUtils.getFirstDayLastMonth());
            this.byId("PostingEndDate").setValue(DateUtils.getLastDayLastMonth());
            this.byId("PostingActDate").setValue(DateUtils.getTodayISO());

            this.byId("WBSElmntF").setValue("1-0001");
            this.byId("WBSElmntT").setValue("4-ZZZZ");
            this.byId("CostElement").setValue("94100000,94100001,94100002,94200001");
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },

        onLaborLoadReview: function () {
            var sAccount = this.byId("CostElement").getValue();
            var sPostingStartDate = this.byId("PostingStartDate").getValue();
            var sPostingEndDate = this.byId("PostingEndDate").getValue();
            var sPostingActDate = this.byId("PostingActDate").getValue();
            var sWBSElmntF = encodeURIComponent(this.byId("WBSElmntF").getValue());
            var sWBSElmntT = encodeURIComponent(this.byId("WBSElmntT").getValue());
            var sProjectType = this.byId("ProjectType").getValue();

            if (sPostingStartDate && (!sPostingEndDate || sPostingEndDate.trim() === "")) {
                sPostingEndDate = sPostingStartDate;
            }
            if (sWBSElmntF && (!sWBSElmntT || sWBSElmntT.trim() === "%20")) {
                sWBSElmntT = sWBSElmntF;
            }

            this.getOwnerComponent().setModel(
                new JSONModel({
                    Account: sAccount,
                    PostingStartDate: sPostingStartDate,
                    PostingEndDate: sPostingEndDate,
                    PostingActDate: sPostingActDate,
                    WBSElmntF: sWBSElmntF,
                    WBSElmntT: sWBSElmntT,
                    ProjectType: sProjectType
                }),
                "laborLoadParams"
            );

            // Parameter order must match the route pattern in manifest.json.
            this.getOwnerComponent().getRouter().navTo("LaborLoadReview", {
                Account: sAccount || "",
                PostingStartDate: sPostingStartDate || "",
                PostingEndDate: sPostingEndDate || "",
                PostingActDate: sPostingActDate || "",
                WBSElmntF: sWBSElmntF || "",
                WBSElmntT: sWBSElmntT || "",
                ProjectType: sProjectType || ""
            });
        }
    });
});
