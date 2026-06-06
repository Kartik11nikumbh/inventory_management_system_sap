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
    }
);