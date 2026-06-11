using InventoryService as service from '../../srv/inventory-service';

annotate service.MaterialMaster with @(
    UI.HeaderInfo : {
        TypeName : 'Material',
        TypeNamePlural : 'Materials',
        Title : { Value : materialName },
        Description : { Value : materialCode }
    },

    UI.SelectionFields : [
        materialCode,
        materialName,
        status,
        location
    ],

    UI.LineItem : [
        { Value : materialCode },
        { Value : materialName },
        { Value : quantity },
        { Value : unitOfMeasure },
        { Value : reorderLevel },
        { Value : location },
        { Value : status }
    ],

    Capabilities.InsertRestrictions : {
        Insertable : true
    },

    Capabilities.UpdateRestrictions : {
        Updatable : true
    },

    Capabilities.DeleteRestrictions : {
        Deletable : true
    },

    UI.FieldGroup #GeneralInfo : {
        $Type : 'UI.FieldGroupType',
        Label : 'General Information',
        Data  : [
            { Value : materialCode },
            { Value : materialName },
            { Value : status },
            { Value : location }
        ]
    },

    UI.FieldGroup #StockInfo : {
        $Type : 'UI.FieldGroupType',
        Label : 'Stock Information',
        Data  : [
            { Value : quantity },
            { Value : unitOfMeasure },
            { Value : reorderLevel }
        ]
    },

    UI.Facets : [
        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'GeneralInfoFacet',
            Label  : 'General Information',
            Target : '@UI.FieldGroup#GeneralInfo'
        },
        {
            $Type  : 'UI.ReferenceFacet',
            ID     : 'StockInfoFacet',
            Label  : 'Stock Information',
            Target : '@UI.FieldGroup#StockInfo'
        }
    ]
);