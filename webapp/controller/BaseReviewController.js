sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox"
], function (Controller, Filter, FilterOperator, MessageBox) {
    "use strict";

    return Controller.extend("ns.automatedsweepv4.automatedsweepv4.controller.BaseReviewController", {

        /**
         * Builds an OR-combined set of EQ filters from a comma-separated list of values.
         * @param {string} sField - entity property name
         * @param {string} sCsv - comma-separated values, e.g. "94100000,94100001"
         * @returns {sap.ui.model.Filter} combined filter (OR)
         */
        buildCsvOrFilter: function (sField, sCsv) {
            var aValues = (sCsv || "").split(",")
                .map(function (v) { return v.trim(); })
                .filter(function (v) { return v !== ""; });

            var aFilters = aValues.map(function (sValue) {
                return new Filter(sField, FilterOperator.EQ, sValue);
            });

            return new Filter({ filters: aFilters, and: false });
        },

        /**
         * Binds a table's "items" aggregation and updates the page title with the result count.
         */
        bindReviewTable: function (oTable, oPage, sTitlePrefix, mBindingInfo) {
            oTable.bindItems(mBindingInfo);

            var oBinding = oTable.getBinding("items");
            oBinding.attachDataReceived(function () {
                var iCount = oBinding.getLength();
                oPage.setTitle(sTitlePrefix + " (" + iCount + ")");
            });
        },

        /**
         * Executes a bound OData V4 action whose binding parameter ("_it") is the
         * AutomatedSweepItems collection currently shown in oTable. That collection
         * parameter is supplied implicitly by binding the action to the list's header
         * context - it must NOT be set via setParameter().
         * @param {sap.m.Table} oTable - the review table whose "items" binding is the
         *   bound collection the backend action expects
         * @param {string} sActionName - unqualified-namespace action name, e.g.
         *   "com.sap.gateway.srvd.zui_automatedsweep_v2.v0001.LaborLoad(...)"
         * @param {Object} mParameters - key/value map of the action's own parameters
         *   (Account, PostingDateStart, etc. - excluding "_it")
         * @returns {Promise<Object>} the result object, or undefined on failure
         */
        executeSweepAction: async function (oTable, sActionName, mParameters) {
            var oListBinding = oTable.getBinding("items");
            var oHeaderContext = oListBinding.getHeaderContext();
            var oActionBinding = this.getView().getModel().bindContext(sActionName, oHeaderContext);

            Object.keys(mParameters).forEach(function (sKey) {
                oActionBinding.setParameter(sKey, mParameters[sKey]);
            });

            try {
                await oActionBinding.execute();
                var oResult = oActionBinding.getBoundContext().getObject();

                if (oResult && oResult.DocumentNumber && oResult.DocumentNumber.trim() !== "") {
                    MessageBox.success(
                        "Document " + oResult.DocumentNumber + " posted successfully!",
                        { title: "Posting Successful" }
                    );
                } else {
                    MessageBox.error(
                        (oResult && oResult.Message) || "Posting did not succeed.",
                        { title: "Posting Error" }
                    );
                }
                return oResult;
            } catch (oError) {
                MessageBox.error(
                    (oError && oError.message) || "The posting action failed.",
                    { title: "Posting Error" }
                );
                return undefined;
            }
        },

        /**
         * Shows a Yes/Cancel confirmation and invokes fnConfirmed only if the user confirms.
         */
        confirmAndRun: function (sMessage, fnConfirmed) {
            MessageBox.confirm(sMessage, {
                title: "Confirm Posting",
                actions: [MessageBox.Action.YES, MessageBox.Action.CANCEL],
                onClose: function (sAction) {
                    if (sAction === MessageBox.Action.YES) {
                        fnConfirmed();
                    }
                }
            });
        }
    });
});
