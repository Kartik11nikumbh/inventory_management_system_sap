sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/inventorymanagement/materialmasterui/test/integration/pages/UserList",
	"com/inventorymanagement/materialmasterui/test/integration/pages/UserObjectPage"
], function (JourneyRunner, UserList, UserObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/inventorymanagement/materialmasterui') + '/test/flp.html#app-preview',
        pages: {
			onTheUserList: UserList,
			onTheUserObjectPage: UserObjectPage
        },
        async: true
    });

    return runner;
});

