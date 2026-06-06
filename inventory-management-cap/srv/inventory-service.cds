using inventorymanagement from '../db/schema';

service InventoryService {

    entity User             as projection on inventorymanagement.User;

    @odata.draft.enabled
    entity MaterialMaster   as projection on inventorymanagement.MaterialMaster;

    @odata.draft.enabled
    entity MaterialIssue    as projection on inventorymanagement.MaterialIssue;

    @odata.draft.enabled
    entity PurchaseRequest  as projection on inventorymanagement.PurchaseRequest;

    @odata.draft.enabled
    entity VendorQuotation  as projection on inventorymanagement.VendorQuotation;

    @odata.draft.enabled
    entity GoodsReceipt     as projection on inventorymanagement.GoodsReceipt;
}