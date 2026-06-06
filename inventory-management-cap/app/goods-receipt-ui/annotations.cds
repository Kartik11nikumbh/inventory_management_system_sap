using InventoryService as service from '../../srv/inventory-service';
annotate service.GoodsReceipt with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'receivedQuantity',
                Value : receivedQuantity,
            },
            {
                $Type : 'UI.DataField',
                Label : 'invoiceNumber',
                Value : invoiceNumber,
            },
            {
                $Type : 'UI.DataField',
                Label : 'receiptDate',
                Value : receiptDate,
            },
            {
                $Type : 'UI.DataField',
                Label : 'receiptStatus',
                Value : receiptStatus,
            },
        ],
    },
    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            ID : 'GeneratedFacet1',
            Label : 'General Information',
            Target : '@UI.FieldGroup#GeneratedGroup',
        },
    ],
    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Label : 'receivedQuantity',
            Value : receivedQuantity,
        },
        {
            $Type : 'UI.DataField',
            Label : 'invoiceNumber',
            Value : invoiceNumber,
        },
        {
            $Type : 'UI.DataField',
            Label : 'receiptDate',
            Value : receiptDate,
        },
        {
            $Type : 'UI.DataField',
            Label : 'receiptStatus',
            Value : receiptStatus,
        },
    ],
);

annotate service.GoodsReceipt with {
    purchaseRequest @Common.ValueList : {
        $Type : 'Common.ValueListType',
        CollectionPath : 'PurchaseRequest',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : purchaseRequest_ID,
                ValueListProperty : 'ID',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'requestedQuantity',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'requestStatus',
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'remarks',
            },
        ],
    }
};

