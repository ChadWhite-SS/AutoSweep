sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "ns/automatedsweepv4/automatedsweepv4/model/DateUtils"
], function (Controller, JSONModel, DateUtils) {
    "use strict";

    return Controller.extend("ns.automatedsweepv4.automatedsweepv4.controller.DCToCIP", {

        onInit: function () {
            this.byId("PostingStartDate1").setValue(DateUtils.getFirstDayLastMonth());
            this.byId("PostingEndDate1").setValue(DateUtils.getLastDayLastMonth());
            this.byId("PostingActDate1").setValue(DateUtils.getTodayISO());

            this.byId("SourceProject2").setValue("2-0002.01.001");
            this.byId("TargetProject2").setValue("2-0002.01.003");
            this.byId("CostElement2").setValue("94500006,94500007,94500008,94500009,94500010,94500013");
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },

        onDCToCIPReview: function () {
            var sAccount = this.byId("CostElement2").getValue();
            var sPostingStartDate = this.byId("PostingStartDate1").getValue();
            var sPostingEndDate = this.byId("PostingEndDate1").getValue();
            var sPostingActDate = this.byId("PostingActDate1").getValue();
            var sWBSElmntF = encodeURIComponent(this.byId("SourceProject2").getValue());
            var sWBSElmntT = encodeURIComponent(this.byId("TargetProject2").getValue());

            if (sPostingStartDate && (!sPostingEndDate || sPostingEndDate.trim() === "")) {
                sPostingEndDate = sPostingStartDate;
            }

            this.getOwnerComponent().setModel(
                new JSONModel({
                    Account: sAccount,
                    PostingStartDate: sPostingStartDate,
                    PostingEndDate: sPostingEndDate,
                    PostingActDate: sPostingActDate,
                    WBSElmntF: sWBSElmntF,
                    WBSElmntT: sWBSElmntT
                }),
                "DCToCIPParams"
            );

            // Parameter order must match the route pattern in manifest.json.
            this.getOwnerComponent().getRouter().navTo("DCToCIPReview", {
                Account: sAccount || "",
                PostingStartDate: sPostingStartDate || "",
                PostingEndDate: sPostingEndDate || "",
                PostingActDate: sPostingActDate || "",
                WBSElmntF: sWBSElmntF || "",
                WBSElmntT: sWBSElmntT || ""
            });
        }
    });
});
