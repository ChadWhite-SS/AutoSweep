sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "ns/automatedsweepv4/automatedsweepv4/model/DateUtils"
], function (Controller, JSONModel, DateUtils) {
    "use strict";

    return Controller.extend("ns.automatedsweepv4.automatedsweepv4.controller.GLBalanceSweep", {
        onInit: function () {
            this.byId("PostingStartDateB").setValue(DateUtils.getFirstDayLastMonth());
            this.byId("PostingEndDateB").setValue(DateUtils.getLastDayLastMonth());
            this.byId("PostingActDateB").setValue(DateUtils.getTodayISO());

            this.getOwnerComponent().getRouter()
                .getRoute("GLBalanceSweep")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var sScenario = oEvent.getParameter("arguments").Scenario || "";
            var mScenario = {
                CAS: { title: "CAS-to-AuC Reclass", action: "CasToAuc" },
                ECR: { title: "Employee Contribution Reclass", action: "EmployeeContribution" },
                CTE: { title: "CAS-to-Expense Reclass", action: "CasToExpense" },
                ITI: { title: "Interest-to-Investment Reclass", action: "InterestToInvestment" }
            };
            var oScenario = mScenario[sScenario];
            if (!oScenario) {
                return;
            }

            this._sScenario = sScenario;
            this._sAction = oScenario.action;
            this.byId("GLBalanceSweepPage").setTitle(oScenario.title);
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },

        onReview: function () {
            var sStart = this.byId("PostingStartDateB").getValue();
            var sEnd = this.byId("PostingEndDateB").getValue();
            var sPosting = this.byId("PostingActDateB").getValue();

            if (sStart && (!sEnd || sEnd.trim() === "")) {
                sEnd = sStart;
            }
            if (!sStart || !sEnd || !sPosting || sStart > sEnd) {
                this.byId("GLBalanceSweepStatus").setText("Enter a valid posting date range and posting date.");
                return;
            }

            this.getOwnerComponent().setModel(new JSONModel({
                Scenario: this._sScenario,
                Action: this._sAction,
                PostingDateStart: sStart,
                PostingDateEnd: sEnd,
                PostingActualDate: sPosting,
                CompanyCode: this.byId("CompanyCodeB").getValue(),
                Ledger: this.byId("LedgerB").getValue(),
                Currency: this.byId("CurrencyB").getValue(),
                TestRun: this.byId("TestRunB").getSelected()
            }), "glBalanceSweepParams");

            this.getOwnerComponent().getRouter().navTo("GLBalanceSweepReview", {
                Scenario: this._sScenario,
                PostingDateStart: sStart,
                PostingDateEnd: sEnd,
                PostingActualDate: sPosting
            });
        }
    });
});
