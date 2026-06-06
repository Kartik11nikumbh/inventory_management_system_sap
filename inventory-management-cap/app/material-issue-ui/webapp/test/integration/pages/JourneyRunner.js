sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/inventorymanagement/materialissueui/test/integration/pages/MaterialIssueList",
	"com/inventorymanagement/materialissueui/test/integration/pages/MaterialIssueObjectPage"
], function (JourneyRunner, MaterialIssueList, MaterialIssueObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/inventorymanagement/materialissueui') + '/test/flp.html#app-preview',
        pages: {
			onTheMaterialIssueList: MaterialIssueList,
			onTheMaterialIssueObjectPage: MaterialIssueObjectPage
        },
        async: true
    });

    return runner;
});

