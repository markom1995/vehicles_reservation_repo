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
                                content: "textFilter"
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

            $$("addChangeVehicleMaintenanceForm").elements.vehicleMaintenanceTypeName.setValue(item.vehicleMaintenanceTypeId);
            $$("addChangeVehicleForm").elements.vehicleModel.setValue(item.modelName);
            $$("addChangeVehicleForm").elements.licensePlate.setValue(item.licensePlate);
            $$("addChangeVehicleForm").elements.year.setValue(item.year);
            $$("addChangeVehicleForm").elements.engine.setValue(item.engine);
            $$("addChangeVehicleForm").elements.fuel.setValue(item.fuel);
            $$("addChangeVehicleForm").elements.location.setValue(item.locationId);
            $$("saveVehicle").define("value", "Sačuvajte izmjene");
            $$("saveVehicle").define("click", "vehicleView.saveChanges");
            $$("saveVehicle").refresh();

            $$("addChangeVehicleDialog").show();
            webix.UIManager.setFocus("vehicleManufacturer");
        }
    },

    save: function () {
        if ($$("addChangeVehicleMaintenanceForm").validate()) {
            var newItem = {
                id: null,
                licensePlate: $$("addChangeVehicleForm").getValues().licensePlate,
                year: $$("addChangeVehicleForm").getValues().year,
                engine: $$("addChangeVehicleForm").getValues().engine,
                fuel: $$("addChangeVehicleForm").getValues().fuel,
                photo: $$("photo").getValues()['src'].split("base64,")[1],
                deleted: 0,
                locationId: $$("addChangeVehicleForm").getValues().location,
                companyId: companyData.id,
                manufacturerName: $$("addChangeVehicleForm").getValues().vehicleManufacturer,
                modelName: $$("addChangeVehicleForm").getValues().vehicleModel
            };

            webix.ajax().header({"Content-type": "application/json"})
                .post("hub/vehicle/custom", newItem).then(function (data) {
                $$("vehicleDataView").add(data.json());
                $$("vehicleDataView").refresh();
                util.messages.showMessage("Uspješno dodavanje novog vozila.");
            }).fail(function (error) {
                util.messages.showErrorMessage(error.responseText);
            });

            util.dismissDialog('addChangeVehicleDialog');
        }
    },

    saveChanges: function () {
        if ($$("addChangeVehicleForm").validate()) {
            var newItem = {
                id: selectedVehicleId,
                licensePlate: $$("addChangeVehicleForm").getValues().licensePlate,
                year: $$("addChangeVehicleForm").getValues().year,
                engine: $$("addChangeVehicleForm").getValues().engine,
                fuel: $$("addChangeVehicleForm").getValues().fuel,
                photo: $$("photo").getValues()['src'].split("base64,")[1],
                deleted: 0,
                locationId: $$("addChangeVehicleForm").getValues().location,
                companyId: companyData.id,
                manufacturerName: $$("addChangeVehicleForm").getValues().vehicleManufacturer,
                modelName: $$("addChangeVehicleForm").getValues().vehicleModel
            };

            webix.ajax().header({"Content-type": "application/json"})
                .put("hub/vehicle/custom/" + selectedVehicleId, newItem).then(function (data) {
                if (data.text() === "Success") {
                    $$("vehicleDataView").updateItem(selectedVehicleId, newItem);
                    $$("vehicleDataView").refresh();

                    util.messages.showMessage("Vozilo uspješno izmjenjeno.");
                } else {
                    util.messages.showErrorMessage("Vozilo neuspješno izmjenjeno.");
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
        connection.attachAjaxEvents("vehicleMaintenanceTable", "hub/vehicleMaintenance", true);
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