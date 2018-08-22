var vehicleMaintenancesType = [];
var firstVehicleMaintenancesType;

var firstVehicle;
var vehicles = [];

var vehicleMaintenanceView = {
    panel: {
        id: "vehicleMaintenancePanel",
        adjust: true,
        rows: [
            {
                view: "toolbar",
                padding: 8,
                css: "panelToolbar",
                cols: [
                    {
                        view: "label",
                        width: 400,
                        template: "<span class='fa fa-wrench'></span> Troškovi vozila"
                    },
                    {},
                    {
                        id: "addVehicleMaintenanceBtn",
                        view: "button",
                        type: "iconButton",
                        label: "Dodajte novi trošak",
                        click: "vehicleMaintenanceView.showAddDialog",
                        icon: "plus-circle",
                        autowidth: true
                    }
                ]
            },
            {
                id: "vehicleMaintenanceTable",
                view: "datatable",
                css: "webixDatatable",
                multiselect: false,
                resizeColumn: true,
                resizeRow: true,
                onContext: {},
                columns: [
                    {
                        id: "id",
                        hidden: true,
                        fillspace: true,
                    },
                    {
                        id: "description",
                        fillspace: true,
                        editor: "text",
                        sort: "string",
                        editable: true,
                        tooltip: false,
                        header: [
                            "Opis",
                            {
                                content: "textFilter"
                            }
                        ]
                    },
                    {
                        id: "vehicleMaintenanceTypeName",
                        fillspace: true,
                        editor: "select",
                        options: vehicleMaintenancesType,
                        sort: "text",
                        editable: true,
                        header: [
                            "Vrsta",
                            {
                                content: "richSelectFilter"
                            }
                        ]
                    },
                    {
                        tooltip: false,
                        id: "price",
                        fillspace: true,
                        editable: true,
                        format: webix.i18n.priceFormat,
                        editor: "text",
                        sort: "text",
                        header: [
                            "Cijena",
                            {
                                content: "numberFilter"
                            }
                        ]
                    },
                    {
                        id: "date",
                        fillspace: true,
                        editor: "date",
                        template: function format(value) {
                            var date = new Date(value.date);
                            var format = webix.Date.dateToStr("%d.%m.%Y");
                            return format(date);
                        },
                        sort: "date",
                        header: [
                            "Datum",
                            {
                                content: "datepickerFilter",
                                compare: function customCompare(value, filter) {
                                    var format = webix.Date.dateToStr("%d.%m.%Y");
                                    var tempFilter = format(filter);
                                    var tempValue = format(new Date(value));
                                    return tempFilter == tempValue;
                                }
                            }
                        ]
                    },
                    {
                        id: "licensePlate",
                        fillspace: true,
                        editable: false,
                        sort: "string",
                        header: [
                            "Registarske tablice",
                            {
                                content: "textFilter"
                            }
                        ]
                    }
                ],
                select: "row",
                navigation: true,
                editable: true,
                tooltip: true,
                editaction: "click",
                url: "hub/vehicleMaintenance/",
                on: {
                    onAfterContextMenu: function (item) {
                        this.select(item.row);
                    }
                }
            }
        ]
    },

    addChangeVehicleMaintenanceDialog: {
        view: "popup",
        id: "addChangeVehicleMaintenanceDialog",
        modal: true,
        position: "center",
        body: {
            id: "addChangeVehicleMaintenanceInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='webix_icon fa-wrench'></span> Dodavanje troška",
                            width: 400
                        },
                        {},
                        {
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('addChangeVehicleMaintenanceDialog');"
                        }
                    ]
                },
                {
                    view: "form",
                    id: "addChangeVehicleMaintenanceForm",
                    width: 600,
                    elementsConfig: {
                        labelWidth: 200,
                        bottomPadding: 18
                    },
                    elements: [
                        {
                            name: "id",
                            view: "text",
                            hidden: true
                        },
                        {
                            view: "select",
                            id: "vehicleMaintenanceTypeName",
                            name: "vehicleMaintenanceTypeName",
                            label: "Vrsta:",
                            value: firstVehicleMaintenancesType,
                            options: vehicleMaintenancesType
                        },
                        {
                            view: "text",
                            id: "description",
                            name: "description",
                            label: "Opis:",
                            required: false
                        },
                        {
                            view: "text",
                            id: "price",
                            name: "price",
                            label: "Cijena u KM(xxx.xx):",
                            format: webix.i18n.priceFormat,
                            invalidMessage: "Molimo Vas da unesete cijenu.",
                            required: true
                        },
                        {
                            view: "datepicker",
                            id: "date",
                            name: "date",
                            label: "Datum:",
                            type: "date",
                            suggest: {
                                type: "calendar",
                                body: {
                                    type: "date",
                                    calendarDate: "%d/%m/%y",
                                    maxDate: new Date(),
                                }
                            },
                            invalidMessage: "Molimo Vas da unesete datum.",
                            required: true
                        },
                        {
                            view: "select",
                            id: "licensePlate",
                            name: "licensePlate",
                            label: "Registarske tablice:",
                            value: firstVehicle,
                            options: vehicles
                        },
                        {
                            margin: 5,
                            cols: [
                                {},
                                {
                                    id: "saveVehicleMaintenance",
                                    view: "button",
                                    value: "Dodajte trošak",
                                    type: "form",
                                    click: "vehicleMaintenanceView.save",
                                    hotkey: "enter",
                                    width: 300
                                }
                            ]
                        }
                    ],
                    rules: {
                        "price": function (value) {
                            var regex = /[0-9]{3}[.][0-9]{2}/;

                            if (!regex.test(value)) {
                                $$('addChangeVehicleMaintenanceForm').elements.price.config.invalidMessage = 'Cijena nije u ispravnom formatu.';
                                return false;
                            }

                            return true;
                        }
                    }
                }
            ]
        }
    },

    showAddDialog: function () {
        if (util.popupIsntAlreadyOpened("addChangeVehicleMaintenanceDialog")) {
            webix.ui(webix.copy(vehicleMaintenanceView.addChangeVehicleMaintenanceDialog)).show();
            webix.UIManager.setFocus("vehicleMaintenanceTypeName");
        }
    },

    showChangeDialog: function (item) {
        if (util.popupIsntAlreadyOpened("addChangeVehicleMaintenanceDialog")) {
            webix.ui(webix.copy(vehicleMaintenanceView.addChangeVehicleMaintenanceDialog)).show();
            webix.UIManager.setFocus("vehicleMaintenanceTypeName");

            $$("addChangeVehicleMaintenanceForm").elements.id.setValue(item.id);
            $$("addChangeVehicleMaintenanceForm").elements.vehicleMaintenanceTypeName.setValue(item.vehicleMaintenanceTypeId);
            $$("addChangeVehicleMaintenanceForm").elements.description.setValue(item.description);
            $$("addChangeVehicleMaintenanceForm").elements.price.setValue(item.price);
            $$("addChangeVehicleMaintenanceForm").elements.date.setValue(item.date);
            $$("addChangeVehicleMaintenanceForm").elements.licensePlate.setValue(item.vehicleId);
            $$("saveVehicleMaintenance").define("value", "Sačuvajte izmjene");
            $$("saveVehicleMaintenance").define("click", "vehicleMaintenanceView.saveChanges");
            $$("saveVehicleMaintenance").refresh();

            $$("addChangeVehicleMaintenanceDialog").show();
            webix.UIManager.setFocus("vehicleMaintenanceTypeName");
        }
    },

    save: function () {
        if ($$("addChangeVehicleMaintenanceForm").validate()) {
            var newItem = {
                id: null,
                vehicleMaintenanceTypeId: $$("addChangeVehicleMaintenanceForm").getValues().vehicleMaintenanceTypeName,
                description: $$("addChangeVehicleMaintenanceForm").getValues().description,
                price: $$("addChangeVehicleMaintenanceForm").getValues().price,
                date: $$("addChangeVehicleMaintenanceForm").getValues().date + ":00",
                deleted: 0,
                vehicleId: $$("addChangeVehicleMaintenanceForm").getValues().licensePlate,
                companyId: companyData.id
            };

            $$("vehicleMaintenanceTable").add(newItem);
            util.messages.showMessage("Uspješno dodavanje nove lokacije.");
            util.dismissDialog('addChangeVehicleMaintenanceDialog');
        }
    },

    saveChanges: function () {
        if ($$("addChangeVehicleMaintenanceForm").validate()) {
            var newItem = {
                id: $$("addChangeVehicleMaintenanceForm").getValues().id,
                vehicleMaintenanceTypeId: $$("addChangeVehicleMaintenanceForm").getValues().vehicleMaintenanceTypeName,
                description: $$("addChangeVehicleMaintenanceForm").getValues().description,
                price: $$("addChangeVehicleMaintenanceForm").getValues().price,
                date: $$("addChangeVehicleMaintenanceForm").getValues().date + ":00",
                deleted: 0,
                vehicleId: $$("addChangeVehicleMaintenanceForm").getValues().licensePlate,
                companyId: companyData.id
            };

            webix.ajax().header({"Content-type": "application/json"})
                .put("hub/vehicleMaintenance/" + newItem.id, newItem).then(function (data) {
                if (data.text() === "Success") {
                    $$("vehicleMaintenanceTable").updateItem(newItem.id, newItem);
                    $$("vehicleMaintenanceTable").refresh();

                    util.messages.showMessage("Trošak uspješno izmijenjen.");
                } else {
                    util.messages.showErrorMessage("Trošak neuspješno izmijenjen.");
                }

            }).fail(function (error) {
                util.messages.showErrorMessage(error.responseText);
            });

            util.dismissDialog('addChangeVehicleDialog');
        }
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "vehicleMaintenancePanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        connection.attachAjaxEvents("vehicleMaintenanceTable", "hub/vehicleMaintenance", false);
        vehicleMaintenanceView.loadVehicle();
        webix.ui({
            view: "contextmenu",
            id: "vehicleMaintenanceContextMenu",
            width: 230,
            data: [
                {
                    id: "1",
                    value: "Izmijenite",
                    icon: "pencil-square-o"
                },
                {
                    id: "2",
                    value: "Obrišite",
                    icon: "trash"
                }
            ],
            master: $$("vehicleMaintenanceTable"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            vehicleMaintenanceView.showChangeDialog($$("vehicleMaintenanceTable").getItem(context.id.row));
                            break;
                        case "2":
                            var delBox = (webix.copy(commonViews.brisanjePotvrda("troška", "trošak")));
                            var newItem = $$("vehicleMaintenanceTable").getItem(context.id.row);

                            delBox.callback = function (result) {
                                if (result == 1) {
                                    webix.ajax().del("hub/vehicleMaintenance/" + newItem.id).then(function (data) {
                                        if(data.text() === "Success"){
                                            util.messages.showMessage("Uspješno brisanje troška.");
                                            $$("vehicleMaintenanceTable").remove(newItem.id);
                                        }
                                        else{
                                            util.messages.showErrorMessage("Neuspješno brisanje troška.");
                                        }
                                    }).fail(function (error) {
                                        util.messages.showErrorMessage("Neuspješno brisanje troška.");
                                    });


                                }
                            };
                            webix.confirm(delBox);
                            break;
                    }
                }
            }
        });
    },

    loadVehicle: function () {
        webix.ajax().get("hub/vehicle").then(function (data) {
            vehicles.length= 0;
            var vehiclesTemp = data.json();
            firstVehicle = vehiclesTemp[0].id;
            vehiclesTemp.forEach(function (obj) {
                vehicles.push({
                    id: obj.id,
                    value: obj.licensePlate + " - " + obj.manufacturerName + " " + obj.modelName
                });
            });

            console.log(vehicles);
        }).fail(function (error) {
            util.messages.showErrorMessage("Neuspješno dobavljanje podataka o vozilima.");
        });
    }
};