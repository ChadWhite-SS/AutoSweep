sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Token",
    "ns/automatedsweepv4/automatedsweepv4/model/DateUtils"
], function (Controller, JSONModel, Token, DateUtils) {
    "use strict";

    function setCostElementTokens(oMultiInput, sCsv) {
        sCsv.split(",").forEach(function (sValue) {
            var sTokenText = sValue.trim();
            if (sTokenText) {
                oMultiInput.addToken(new Token({ text: sTokenText }));
            }
        });
    }

    function getCostElementCsv(oMultiInput) {
        return oMultiInput.getTokens().map(function (oToken) {
            return oToken.getText().trim();
        }).filter(Boolean).join(",");
    }

    return Controller.extend("ns.automatedsweepv4.automatedsweepv4.controller.NonLaborLoad", {

        onInit: function () {
            this.byId("PostingStartDateN").setValue(DateUtils.getFirstDayLastMonth());
            this.byId("PostingEndDateN").setValue(DateUtils.getLastDayLastMonth());
            this.byId("PostingActDateN").setValue(DateUtils.getTodayISO());

            this.byId("WBSElmntFN").setValue("1-0001");
            this.byId("WBSElmntTN").setValue("4-ZZZZ");
            setCostElementTokens(
                this.byId("CostElementN"),
                "51100000,53000040,65001010,65001011,65001012,65001030,66002105,66002180,66002300,66002330,94100020,94100030"
            );
            this.byId("WBSOffset").setValue("3-JUNK.01");
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },

        onNonLaborLoadReview: function () {
            var sAccount = getCostElementCsv(this.byId("CostElementN"));
            var sPostingStartDate = this.byId("PostingStartDateN").getValue();
            var sPostingEndDate = this.byId("PostingEndDateN").getValue();
            var sPostingActDate = this.byId("PostingActDateN").getValue();
            var sWBSOffset = encodeURIComponent(this.byId("WBSOffset").getValue());
            var sWBSElmntF = encodeURIComponent(this.byId("WBSElmntFN").getValue());
            var sWBSElmntT = encodeURIComponent(this.byId("WBSElmntTN").getValue());
            var sProjectType = this.byId("ProjectTypeN").getValue();

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
                    WBSElmntF: sWBSElmntF,
                    WBSElmntT: sWBSElmntT,
                    ProjectType: sProjectType,
                    WBSOffset: sWBSOffset,
                    PostingActDate: sPostingActDate
                }),
                "nonlaborLoadParams"
            );

            // Parameter order must match the route pattern in manifest.json.
            this.getOwnerComponent().getRouter().navTo("NonLaborLoadReview", {
                Account: sAccount || "",
                PostingStartDate: sPostingStartDate || "",
                PostingEndDate: sPostingEndDate || "",
                PostingActDate: sPostingActDate || "",
                WBSOffset: sWBSOffset || "",
                WBSElmntF: sWBSElmntF || "",
                WBSElmntT: sWBSElmntT || "",
                ProjectType: sProjectType || ""
            });
        }
    });
});
