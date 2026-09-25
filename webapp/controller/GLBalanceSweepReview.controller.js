sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/ColumnListItem",
    "sap/m/Text"
], function (Controller, MessageBox, ColumnListItem, Text) {
    "use strict";

    return Controller.extend("ns.automatedsweepv4.automatedsweepv4.controller.GLBalanceSweepReview", {
        onInit: function () {
            this.getOwnerComponent().getRouter()
                .getRoute("GLBalanceSweepReview")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            this._sScenario = oArgs.Scenario || "";
            this._sStart = oArgs.PostingDateStart || "";
            this._sEnd = oArgs.PostingDateEnd || "";
            this._sPosting = oArgs.PostingActualDate || "";
            var oParams = this.getOwnerComponent().getModel("glBalanceSweepParams");
            this._oParams = oParams && oParams.getData();
            this._bindTable();
        },

        _bindTable: function () {
            var oTable = this.byId("GLBalanceSweepTable");
            var oModel = this.getView().getModel();
            if (!oModel || !oModel.bindList) {
                this.byId("GLBalanceSweepConfigMessage").setText(
                    "The active OData balance entity is not available in the current service metadata. No posting was attempted."
                );
                this.byId("GLBalanceSweepPostButton").setEnabled(false);
                return;
            }

            oTable.bindItems({
                path: "/GLBalanceItems",
                template: new ColumnListItem({
                    cells: [
                        new Text({ text: "{SourceAccount}" }),
                        new Text({ text: "{SourceProject}" }),
                        new Text({ text: "{Amount}" }),
                        new Text({ text: "{Currency}" })
                    ]
                })
            });
        },

        onBack: function () {
            this.getOwnerComponent().getRouter().navTo("RouteMainView");
        },

        onPost: function () {
            var oModel = this.getView().getModel();
            var oTable = this.byId("GLBalanceSweepTable");
            var oBinding = oTable.getBinding("items");
            var oContext = oBinding && oBinding.getHeaderContext && oBinding.getHeaderContext();
            var oParams = this._oParams || {};
            var sNamespace = "com.sap.gateway.srvd.zui_automatedsweep_v2.v0001.";
            var sActionName = sNamespace + (this._actionForScenario(this._sScenario) || "");

            if (!oModel || !oContext || !this._actionForScenario(this._sScenario)) {
                MessageBox.warning("The balance-sweep action is not available in the active backend metadata. No posting was attempted.");
                return;
            }

            MessageBox.confirm("Are you sure you want to post this balance sweep?", {
                title: "Confirm Posting",
                actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
                onClose: async function (sAction) {
                    if (sAction !== MessageBox.Action.YES) {
                        return;
                    }
                    try {
                        var oAction = oModel.bindContext(sActionName, oContext);
                        oAction.setParameter("PostingDateStart", this._sStart);
                        oAction.setParameter("PostingDateEnd", this._sEnd);
                        oAction.setParameter("PostingActualDate", this._sPosting);
                        oAction.setParameter("CompanyCode", oParams.CompanyCode || "");
                        oAction.setParameter("Ledger", oParams.Ledger || "");
                        oAction.setParameter("Currency", oParams.Currency || "");
                        oAction.setParameter("TestRun", !!oParams.TestRun);
                        await oAction.execute();
                        var oResult = oAction.getBoundContext().getObject();
                        if (oResult && (oResult.Success || oResult.Status === "SIMULATION")) {
                            MessageBox.success(oResult.Message || "Balance sweep completed.");
                        } else {
                            MessageBox.warning((oResult && oResult.Message) || "Balance sweep did not post.");
                        }
                    } catch (oError) {
                        MessageBox.error(oError.message || "The balance-sweep action failed.");
                    }
                }.bind(this)
            });
        },

        _actionForScenario: function (sScenario) {
            return {
                CAS: "CasToAuc",
                ECR: "EmployeeContribution",
                CTE: "CasToExpense",
                ITI: "InterestToInvestment"
            }[sScenario];
        }
    });
});
