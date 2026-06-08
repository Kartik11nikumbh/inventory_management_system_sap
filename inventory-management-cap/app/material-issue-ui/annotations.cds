using InventoryService as service from '../../srv/inventory-service';

annotate service.MaterialIssue with @(
    UI.HeaderInfo : {
        TypeName : 'Material Issue',
        TypeNamePlural : 'Material Issues'
    },

    UI.SelectionFields : [
        issueStatus,
        requestedQuantity
    ],

    UI.LineItem : [
        {
            $Type : 'UI.DataField',
            Value : material,
            Label : 'Material'
        },
        {
            $Type : 'UI.DataField',
            Value : requestedQuantity,
            Label : 'Requested Quantity'
        },
        {
            $Type : 'UI.DataField',
            Value : issueStatus,
            Label : 'Issue Status'
        },
        {
            $Type : 'UI.DataField',
            Value : remarks,
            Label : 'Remarks'
        }
    ],

    UI.FieldGroup #General : {
        Data : [
            {
                $Type : 'UI.DataField',
                Value : material,
                Label : 'Material'
            },
            {
                $Type : 'UI.DataField',
                Value : requestedQuantity,
                Label : 'Requested Quantity'
            },
            {
                $Type : 'UI.DataField',
                Value : issueStatus,
                Label : 'Issue Status'
            },
            {
                $Type : 'UI.DataField',
                Value : remarks,
                Label : 'Remarks'
            }
        ]
    },

    UI.Facets : [
        {
            $Type : 'UI.ReferenceFacet',
            Label : 'General Information',
            Target : '@UI.FieldGroup#General'
        }
    ]
);



annotate service.MaterialIssue with @(
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
annotate service.MaterialIssue with {

    material @Common.ValueList : {
        CollectionPath : 'MaterialMaster',
        Parameters : [
            {
                $Type : 'Common.ValueListParameterInOut',
                LocalDataProperty : material,
                ValueListProperty : 'ID'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'materialCode'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'materialName'
            },
            {
                $Type : 'Common.ValueListParameterDisplayOnly',
                ValueListProperty : 'quantity'
            }
        ]
    };

};

