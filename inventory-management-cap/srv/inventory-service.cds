using inventorymanagement from '../db/schema';

service InventoryService {

    @restrict: [
        { grant: '*', to: 'Admin' }
    ]
    entity User as projection on inventorymanagement.User;

    @odata.draft.enabled
    @restrict: [
        { grant: '*', to: 'Admin' },
        { grant: 'READ', to: 'StoreManager' },
        { grant: 'READ', to: 'Employee' }
    ]
    entity MaterialMaster as projection on inventorymanagement.MaterialMaster;

    @odata.draft.enabled
    @restrict: [
        { grant: '*', to: 'Admin' },
        { grant: '*', to: 'StoreManager' },
        { grant: ['READ','CREATE'], to: 'Employee' }
    ]
    entity MaterialIssue as projection on inventorymanagement.MaterialIssue;

    @odata.draft.enabled
    @restrict: [
        { grant: '*', to: 'Admin' },
        { grant: '*', to: 'StoreManager' },
        { grant: 'READ', to: 'Employee' },
        { grant: 'READ', to: 'Vendor' }
    ]
    entity PurchaseRequest as projection on inventorymanagement.PurchaseRequest;

    @odata.draft.enabled
    @restrict: [
        { grant: '*', to: 'Admin' },
        { grant: 'READ', to: 'StoreManager' },
        { grant: 'READ', to: 'Employee' },
        { grant: '*', to: 'Vendor' }
    ]
    entity VendorQuotation as projection on inventorymanagement.VendorQuotation;

    @odata.draft.enabled
    @restrict: [
        { grant: '*', to: 'Admin' },
        { grant: '*', to: 'StoreManager' },
        { grant: 'READ', to: 'Employee' }
    ]
    entity GoodsReceipt as projection on inventorymanagement.GoodsReceipt;
}