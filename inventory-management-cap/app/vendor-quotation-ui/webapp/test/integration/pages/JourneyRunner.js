sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/inventorymanagement/vendorquotationui/test/integration/pages/VendorQuotationList",
	"com/inventorymanagement/vendorquotationui/test/integration/pages/VendorQuotationObjectPage"
], function (JourneyRunner, VendorQuotationList, VendorQuotationObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/inventorymanagement/vendorquotationui') + '/test/flp.html#app-preview',
        pages: {
			onTheVendorQuotationList: VendorQuotationList,
			onTheVendorQuotationObjectPage: VendorQuotationObjectPage
        },
        async: true
    });

    return runner;
});

