sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/inventorymanagement/goodsreceiptui/test/integration/pages/GoodsReceiptList",
	"com/inventorymanagement/goodsreceiptui/test/integration/pages/GoodsReceiptObjectPage"
], function (JourneyRunner, GoodsReceiptList, GoodsReceiptObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/inventorymanagement/goodsreceiptui') + '/test/flp.html#app-preview',
        pages: {
			onTheGoodsReceiptList: GoodsReceiptList,
			onTheGoodsReceiptObjectPage: GoodsReceiptObjectPage
        },
        async: true
    });

    return runner;
});

