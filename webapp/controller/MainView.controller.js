sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("ns.automatedsweepv4.automatedsweepv4.controller.MainView", {
        onInit() {
        },
    onLaborLoad: function () {
        this.getOwnerComponent().getRouter().navTo("LaborLoad");
        },
    onNonLaborLoad: function () {
        this.getOwnerComponent().getRouter().navTo("NonLaborLoad");
        },
    onDCToCIP: function () {
        this.getOwnerComponent().getRouter().navTo("DCToCIP");
        },
    onLogisticsNodeReclass: function () {
        this.getOwnerComponent().getRouter().navTo("LogisticsNodeReclass");
        },
    onOpexGAReclass: function () {
        this.getOwnerComponent().getRouter().navTo("OpexGAReclass");
        },
    onCasToAuc: function () {
        this.getOwnerComponent().getRouter().navTo("GLBalanceSweep", { Scenario: "CAS" });
        },
    onEmployeeContribution: function () {
        this.getOwnerComponent().getRouter().navTo("GLBalanceSweep", { Scenario: "ECR" });
        },
    onCasToExpense: function () {
        this.getOwnerComponent().getRouter().navTo("GLBalanceSweep", { Scenario: "CTE" });
        },
    onInterestToInvestment: function () {
        this.getOwnerComponent().getRouter().navTo("GLBalanceSweep", { Scenario: "ITI" });
        }
    });
});