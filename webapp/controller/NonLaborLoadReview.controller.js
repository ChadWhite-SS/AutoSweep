sap.ui.define([
    "ns/automatedsweepv4/automatedsweepv4/controller/BaseReviewController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/ColumnListItem",
    "sap/m/Text"
], function (BaseReviewController, Filter, FilterOperator, Sorter, ColumnListItem, Text) {
    "use strict";

    var ACTION_NAME = "com.sap.gateway.srvd.zui_automatedsweep_v2.v0001.NonLaborLoad";

    return BaseReviewController.extend("ns.automatedsweepv4.automatedsweepv4.controller.NonLaborLoadReview", {

        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("NonLaborLoadReview")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        onAfterRendering: function () {
            var oParamModel = this.getOwnerComponent().getModel("nonlaborLoadParams");
            if (!oParamModel) {
                return;
            }

            var oData = oParamModel.getData();
            this._sAccount = oData.Account;
            this._sPostingStartDate = oData.PostingStartDate;
            this._sPostingEndDate = oData.PostingEndDate;
            this._sPostingActDate = oData.PostingActDate;
            this._sWBSElmntF = oData.WBSElmntF;
            this._sWBSElmntT = oData.WBSElmntT;
            this._sWBSOffset = oData.WBSOffset;
            this._sProjectType = oData.ProjectType;
            this._bindTable();
        },

        _onRouteMatched: function (oEvent) {
            var oArgs = oEvent.getParameter("arguments");
            this._sAccount = oArgs.Account || "";
            this._sPostingStartDate = oArgs.PostingStartDate || "";
            this._sPostingEndDate = oArgs.PostingEndDate || "";
            this._sPostingActDate = oArgs.PostingActDate || "";
            this._sWBSElmntF = decodeURIComponent(oArgs.WBSElmntF || "");
            this._sWBSElmntT = decodeURIComponent(oArgs.WBSElmntT || "");
            this._sWBSOffset = decodeURIComponent(oArgs.WBSOffset || "");
            this._sProjectType = oArgs.ProjectType || "";
            this._bindTable();
        },

        onBeforeShow: function () {
            this._bindTable();
        },

        _bindTable: function () {
            var aFilters = [
                new Filter("PostDate", FilterOperator.BT, this._sPostingStartDate, this._sPostingEndDate),
                new Filter("WBSElmnt", FilterOperator.BT, String(this._sWBSElmntF), String(this._sWBSElmntT)),
                new Filter("ProjectType", FilterOperator.EQ, String(this._sProjectType)),
                this.buildCsvOrFilter("Account", this._sAccount)
            ];

            this.bindReviewTable(
                this.byId("NonLaborLoadTable"),
                this.byId("IDNonLaborLoadReview"),
                "Review Non-Labor Load Records",
                {
                    path: "/AutomatedSweepItems",
                    filters: aFilters,
                    sorters: new Sorter("PostDate", true),
                    template: new ColumnListItem({
                        cells: [
                            new Text({ text: "{WBSElmnt}" }),
                            new Text({ text: "{Account}" }),
                            new Text({ text: "{PostDate}" }),
                            new Text({ text: "{AmntTC}" })
                        ]
                    })
                }
            );
        },

        onPostNonLaborLoad: function () {
            this.confirmAndRun("Are you sure you want to post the Non-Labor Load?", function () {
                this.executeSweepAction(this.byId("NonLaborLoadTable"), ACTION_NAME, {
                    Account: this._sAccount,
                    PostingDateStart: this._sPostingStartDate,
                    PostingDateEnd: this._sPostingEndDate,
                    WBSElmntF: this._sWBSElmntF,
                    WBSElmntT: this._sWBSElmntT,
                    WBSOffset: this._sWBSOffset,
                    ProjectType: this._sProjectType,
                    PostingActualDate: this._sPostingActDate,
                    TestRun: false
                });
            }.bind(this));
        }
    });
});
