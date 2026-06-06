using InventoryService as service from '../../srv/inventory-service';

annotate service.PurchaseRequest with @(
    UI.LineItem: [
        { Value: material_ID, Label: 'Material' },
        { Value: requestedQuantity, Label: 'Requested Quantity' },
        { Value: requestStatus, Label: 'Request Status' },
        { Value: remarks, Label: 'Remarks' }
    ],
    UI.FieldGroup #GeneralInfo: {
        Data: [
            { Value: material_ID, Label: 'Material' },
            { Value: requestedQuantity, Label: 'Requested Quantity' },
            { Value: requestStatus, Label: 'Request Status' },
            { Value: remarks, Label: 'Remarks' }
        ]
    },
    UI.Facets: [
        {
            $Type: 'UI.ReferenceFacet',
            Label: 'General Information',
            Target: '@UI.FieldGroup#GeneralInfo'
        }
    ]
);
