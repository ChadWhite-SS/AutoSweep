sap.ui.define([
    "ns/automatedsweepv4/automatedsweepv4/controller/BaseReviewController",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter",
    "sap/m/ColumnListItem",
    "sap/m/Text"
], function (BaseReviewController, Filter, FilterOperator, Sorter, ColumnListItem, Text) {
    "use strict";

    var ACTION_NAME = "com.sap.gateway.srvd.zui_automatedsweep_v2.v0001.OpexGAReclass";
    var OPEX_PROJECT = "2-0001";
    var OPEX_ACCOUNTS = "94500096,94500006,94500007,94500008,94500009,94500010,94500013";

    return BaseReviewController.extend("ns.automatedsweepv4.automatedsweepv4.controller.OpexGAReclassReview", {

        onInit: function () {
            this.getOwnerComponent()
                .getRouter()
                .getRoute("OpexGAReclassReview")
                .attachPatternMatched(this._onRouteMatched, this);
        },

        onAfterRendering: function () {
            var oParamModel = this.getOwnerComponent().getModel("opexGAReclassParams");
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
                new Filter("PostDate", FilterOperator.BT, this._sPostingStartDate, this._sPostingEndDate),
                new Filter("WBSElmnt", FilterOperator.StartsWith, OPEX_PROJECT),
                this.buildCsvOrFilter("Account", OPEX_ACCOUNTS)
            ];

            this.bindReviewTable(
                this.byId("OpexGAReclassTable"),
                this.byId("IDOpexGAReclassReview"),
                "Review OPEX G&A Reclass Records",
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

        onOpexGAReclassLoad: function () {
            this.confirmAndRun("Are you sure you want to post the OPEX G&A Reclass?", function () {
                this.executeSweepAction(this.byId("OpexGAReclassTable"), ACTION_NAME, {
                    // ZI_FI_PostParameters declares these as Nullable="false"; OpexGAReclass
                    // does not use them (project/account list is fixed per the spec), but OData
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
