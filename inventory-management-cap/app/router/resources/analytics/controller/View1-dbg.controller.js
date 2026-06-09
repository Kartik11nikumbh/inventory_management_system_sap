sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("com.inventorymanagement.analyticsui.controller.View1", {

        onInit: function () {
            // Initialize empty models
            this.getView().setModel(new JSONModel({ totalMaterials: 0, lowStock: 0, pendingIssues: 0, pendingPR: 0, approvedIssues: 0 }), "kpi");
            this.getView().setModel(new JSONModel({ items: [] }), "stock");
            this.getView().setModel(new JSONModel({ items: [] }), "issueStatus");
            this.getView().setModel(new JSONModel({ items: [] }), "prStatus");
            this.getView().setModel(new JSONModel({ items: [] }), "lowStock");

            this._loadData();
        },

        _loadData: function () {
            const base = "/odata/v4/inventory";

            // Load MaterialMaster
            fetch(`${base}/MaterialMaster?$filter=IsActiveEntity eq true&$select=materialName,materialCode,quantity,reorderLevel,location,status`)
                .then(r => r.json())
                .then(data => {
                    const items = data.value || [];
                    const lowStockItems = items.filter(m => m.quantity <= m.reorderLevel);

                    // Stock chart
                    this.getView().getModel("stock").setProperty("/items", items);

                    // Low stock table
                    this.getView().getModel("lowStock").setProperty("/items", lowStockItems);

                    // KPI
                    const kpi = this.getView().getModel("kpi");
                    kpi.setProperty("/totalMaterials", items.length);
                    kpi.setProperty("/lowStock", lowStockItems.length);
                });

            // Load MaterialIssue
            fetch(`${base}/MaterialIssue?$filter=IsActiveEntity eq true&$select=issueStatus`)
                .then(r => r.json())
                .then(data => {
                    const items = data.value || [];
                    const statusMap = {};
                    items.forEach(i => {
                        const s = i.issueStatus || "Unknown";
                        statusMap[s] = (statusMap[s] || 0) + 1;
                    });
                    const statusItems = Object.keys(statusMap).map(s => ({ status: s, count: statusMap[s] }));
                    this.getView().getModel("issueStatus").setProperty("/items", statusItems);

                    const kpi = this.getView().getModel("kpi");
                    kpi.setProperty("/pendingIssues", statusMap["Pending"] || 0);
                    kpi.setProperty("/approvedIssues", statusMap["Approved"] || 0);
                });

            // Load PurchaseRequest
            fetch(`${base}/PurchaseRequest?$filter=IsActiveEntity eq true&$select=requestStatus`)
                .then(r => r.json())
                .then(data => {
                    const items = data.value || [];
                    const statusMap = {};
                    items.forEach(i => {
                        const s = i.requestStatus || "Unknown";
                        statusMap[s] = (statusMap[s] || 0) + 1;
                    });
                    const statusItems = Object.keys(statusMap).map(s => ({ status: s, count: statusMap[s] }));
                    this.getView().getModel("prStatus").setProperty("/items", statusItems);

                    const kpi = this.getView().getModel("kpi");
                    kpi.setProperty("/pendingPR", statusMap["Pending"] || 0);
                });
        }
    });
});
