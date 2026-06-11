namespace inventorymanagement;

using { cuid, managed } from '@sap/cds/common';



entity User : cuid, managed {
    userName    : String(50);
    email       : String(100);
    password    : String(100);
    role        : String(30);      // Admin, StoreManager, Employee
}



entity MaterialMaster : cuid, managed {
    materialCode      : String(20);
    materialName      : String(100);
    description       : String(255);
    quantity          : Integer;
    unitOfMeasure     : String(20);
    reorderLevel      : Integer;
    location          : String(100);
    status            : String(20);
}


entity MaterialIssue : cuid, managed {
    material          : Association to MaterialMaster;
    requestedBy       : Association to User;

    requestedQuantity : Integer;

    issueStatus       : String(20);   // Pending, Approved, Rejected

    remarks           : String(255);
}



entity PurchaseRequest : cuid, managed {
    material          : Association to MaterialMaster;

    requestedQuantity : Integer;

    requestStatus     : String(20);   // Pending, Approved, Rejected

    remarks           : String(255);
}


entity VendorQuotation : cuid, managed {
    purchaseRequest   : Association to PurchaseRequest;

    vendorName        : String(100);

    quotationAmount   : Decimal(15,2);

    deliveryDays      : Integer;

    quotationStatus   : String(20);
}


entity GoodsReceipt : cuid, managed {
    purchaseRequest   : Association to PurchaseRequest;

    receivedQuantity  : Integer;

    invoiceNumber     : String(50);

    receiptDate       : Date;

    receiptStatus     : String(20);
}