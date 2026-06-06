sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/inventorymanagement/purchaserequestui/test/integration/pages/UserList",
	"com/inventorymanagement/purchaserequestui/test/integration/pages/UserObjectPage"
], function (JourneyRunner, UserList, UserObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/inventorymanagement/purchaserequestui') + '/test/flp.html#app-preview',
        pages: {
			onTheUserList: UserList,
			onTheUserObjectPage: UserObjectPage
        },
        async: true
    });

    return runner;
});

