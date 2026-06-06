using InventoryService as service from '../../srv/inventory-service';
annotate service.VendorQuotation with @(
    UI.FieldGroup #GeneratedGroup : {
        $Type : 'UI.FieldGroupType',
        Data : [
            {
                $Type : 'UI.DataField',
                Label : 'vendorName',
                Value : vendorName,
            },
            {
                $Type : 'UI.DataField',
                Label : 'quotationAmount',
                Value : quotationAmount,
            },
            {
                $Type : 'UI.DataField',
                Label : 'deliveryDays',
                Value : deliveryDays,
            },
            {
                $Type : 'UI.DataField',
                Label : 'quotationStatus',
                Value : quotationStatus,
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
            Label : 'vendorName',
            Value : vendorName,
        },
        {
            $Type : 'UI.DataField',
            Label : 'quotationAmount',
            Value : quotationAmount,
        },
        {
            $Type : 'UI.DataField',
            Label : 'deliveryDays',
            Value : deliveryDays,
        },
        {
            $Type : 'UI.DataField',
            Label : 'quotationStatus',
            Value : quotationStatus,
        },
    ],
);

annotate service.VendorQuotation with {
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

