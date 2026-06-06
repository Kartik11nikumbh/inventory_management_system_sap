sap.ui.define(['sap/fe/test/ListReport'], function(ListReport) {
    'use strict';

    var CustomPageDefinitions = {
        actions: {},
        assertions: {}
    };

    return new ListReport(
        {
            appId: 'com.inventorymanagement.materialissueui',
            componentId: 'MaterialIssueList',
            contextPath: '/MaterialIssue'
        },
        CustomPageDefinitions
    );
});