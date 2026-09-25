sap.ui.define([
    "ns/automatedsweepv4/automatedsweepv4/controller/BaseReviewController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/ColumnListItem",
    "sap/m/Text"
], function (BaseReviewController, Filter, FilterOperator, Sorter, ColumnListItem, Text) {
    "use strict";

    var ACTION_NAME = "com.sap.gateway.srvd.zui_automatedsweep_v2.v0001.LogisticsNodeReclass";

    return BaseReviewController.extend("ns.automatedsweepv4.automatedsweepv4.controller.LogisticsNodeReclassReview", {

        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("LogisticsNodeReclassReview")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        onAfterRendering: function () {
            var oParamModel = this.getOwnerComponent().getModel("logisticsNodeReclassParams");
            if (!oParamModel) {
                return;
            }

            var oData = oParamModel.getData();
            this._sPostingStartDate = oData.PostingStartDate;
            this._sPostingEndDate = oData.PostingEndDate;
            this._sPostingActDate = oData.PostingActDate;
            this._bTestRun = oData.TestRun;
            this._bindTable();
        },

        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            this._sPostingStartDate = oArgs.PostingStartDate || "";
            this._sPostingEndDate = oArgs.PostingEndDate || "";
            this._sPostingActDate = oArgs.PostingActDate || "";
            this._bindTable();
        },

        onBeforeShow: function () {
            this._bindTable();
        },

        _bindTable: function () {
            var aFilters = [
                new Filter("PostDate", FilterOperator.BT, this._sPostingStartDate, this._sPostingEndDate)
            ];

            this.bindReviewTable(
                this.byId("LogisticsNodeReclassTable"),
                this.byId("IDLogisticsNodeReclassReview"),
                "Review Logistics Node Reclass Records",
                {
                    path: "/AutomatedSweepItems",
                    filters: aFilters,
                    sorters: new Sorter("PostDate", true),
                    template: new ColumnListItem({
                        cells: [
                            new Text({ text: "{WBSElmnt}" }),
                            new Text({ text: "{CostCtr}" }),
                            new Text({ text: "{ActivityType}" }),
                            new Text({ text: "{PostDate}" }),
                            new Text({ text: "{Quantity}" }),
                            new Text({ text: "{AmntTC}" })
                        ]
                    })
                }
            );
        },

        onLogisticsNodeReclassLoad: function () {
            this.confirmAndRun("Are you sure you want to post the Logistics Node Reclass?", function () {
                this.executeSweepAction(this.byId("LogisticsNodeReclassTable"), ACTION_NAME, {
                    // ZI_FI_PostParameters declares these as Nullable="false"; LogisticsNodeReclass
                    // does not use them (source/target WBS comes from ZTFI_SWEEP_CONV), but OData
                    // requires a value to be sent.
                    Account: "",
                    WBSElmntF: "",
                    WBSElmntT: "",
                    ProjectType: "",
                    WBSOffset: "",
                    PostingDateStart: this._sPostingStartDate,
                    PostingDateEnd: this._sPostingEndDate,
                    PostingActualDate: this._sPostingActDate,
                    TestRun: !!this._bTestRun
                });
            }.bind(this));
        }
    });
});
