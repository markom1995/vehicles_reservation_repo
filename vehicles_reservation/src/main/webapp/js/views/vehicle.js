var tableData = [];
var tableCenter = [];
var manufacturers = [];
var models = [];
var firstLocation;
var locations = [];
var selectedVehicleId;

var vehicleView = {
    panel: {
        id: "vehiclePanel",
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
                        template: "<span class='fa fa-car'></span> Vozila"
                    },
                    {},
                    {
                        id: "locationFilter",
                        name: "locationFilter",
                        view: "select",
                        value: firstLocation,
                        options: locations,
                        on: {
                            onChange: function (newv, oldv) {
                                console.log(oldv + " " + newv);
                                $$("vehicleDataView").filter("#locationId#", newv);
                            }
                        }
                    },
                    {
                        id: "addVehicleBtn",
                        view: "button",
                        type: "iconButton",
                        label: "Dodajte novo vozilo",
                        click: "vehicleView.showAddDialog",
                        icon: "plus-circle",
                        autowidth: true
                    }
                ]
            },
            {
                view: "dataview",
                id: "vehicleDataView",
                container: "dataA",
                select: true,
                onContext: {},
                on: {
                    onAfterContextMenu: function (item) {
                        this.select(item);
                    }
                },
                url: "hub/vehicle",
                type: {
                    height: 520,
                    width: 330
                },
                template: function(obj) {
                    return(obj.id==3?"<div style='height: 13px'></div><div style='border: 3px solid green' align='center'><img src='data:image/png;base64, "+ obj.photo +"' alt='Nema slike' width='300' height='300' align='center'/></div><br/>" +
                        "<div style='height: 1px' align='center'>Proizvođač: " + obj.manufacturerName + "</div><br/>" +
                        "<div style='height: 1px' align='center'>Model: " + obj.modelName +"</div><br/>" +
                        "<div style='height: 1px' align='center'>Registarske tablice: " + obj.licensePlate + "</div><br/>" +
                        "<div style='height: 1px' align='center'>Godina proizvodnje: " + obj.year + "</div><br/>" +
                        "<div style='height: 1px' align='center'>Motor: " + obj.engine + "</div><br/>" +
                        "<div style='height: 1px' align='center'>Gorivo: " + obj.fuel + "</div><br/>" +
                        "<div style='display: none;'>" + obj.locationId + "</div>":"<div style='height: 13px'></div><div style='border: 3px solid red' align='center'><img src='data:image/png;base64, "+ obj.photo +"' alt='Nema slike' width='300' height='300' align='center'/></div><br/>" +
                        "<div style='height: 1px' align='center'>Proizvođač: " + obj.manufacturerName + "</div><br/>" +
                        "<div style='height: 1px' align='center'>Model: " + obj.modelName +"</div><br/>" +
                        "<div style='height: 1px' align='center'>Registarske tablice: " + obj.licensePlate + "</div><br/>" +
                        "<div style='height: 1px' align='center'>Godina proizvodnje: " + obj.year + "</div><br/>" +
                        "<div style='height: 1px' align='center'>Motor: " + obj.engine + "</div><br/>" +
                        "<div style='height: 1px' align='center'>Gorivo: " + obj.fuel + "</div><br/>" +
                        "<div style='display: none;'>" + obj.locationId + "</div>")
                },
                on: {
                    onItemDblClick: function (id) {
                        vehicleView.showVehicleDetailsDialog($$("vehicleDataView").getSelectedItem().id);
                    }
                }
            }
        ]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "vehiclePanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        vehicleView.preloadDependencies();
        webix.ui({
            view: "contextmenu",
            id: "vehicleContextMenu",
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
                },
                {
                    $template: "Separator"
                },
                {
                    id: "3",
                    value: "Prikažite lokaciju na mapi",
                    icon: "map-marker"
                },
            ],
            master: $$("vehicleDataView"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            selectedVehicleId = $$("vehicleDataView").getSelectedItem().id;
                            vehicleView.showChangeDialog($$("vehicleDataView").getSelectedItem());
                            break;
                        case "2":
                            var delBox = (webix.copy(commonViews.brisanjePotvrda("vozila", "vozilo")));
                            var newItem = $$("vehicleDataView").getSelectedItem();

                            delBox.callback = function (result) {
                                if (result == 1) {
                                    webix.ajax().del("hub/vehicle/" + newItem.id).then(function (data) {
                                        if (data.text() === "Success") {
                                            util.messages.showMessage("Uspješno brisanje vozila.");
                                            $$("vehicleDataView").remove(newItem.id);
                                        }
                                        else {
                                            util.messages.showErrorMessage("Neuspješno brisanje vozila.");
                                        }
                                    }).fail(function (error) {
                                        util.messages.showErrorMessage(error.responseText);
                                    });
                                }
                            };
                            webix.confirm(delBox);
                            break;
                        case "3":
                            vehicleView.showMapDetailsDialog($$("vehicleDataView").getSelectedItem());
                            break;
                    }
                }
            }
        });

        if (userData.roleId === 3) {
            $$("addVehicleBtn").define("hidden", true);
            $$("addVehicleBtn").refresh();

            var userContextMenu = [
                {
                    id: "3",
                    value: "Prikažite lokaciju na mapi",
                    icon: "map-marker"
                },
            ];

            $$("vehicleContextMenu").clearAll();
            $$("vehicleContextMenu").define("data", userContextMenu);
            $$("vehicleContextMenu").refresh();
        }
    },

    showMapDetailsDialog: function (vehicle) {
        tableCenter[0] = vehicle.latitude;
        tableCenter[1] = vehicle.longitude;

        var mapObject = {
            id: 1,
            lat: tableCenter[0],
            lng: tableCenter[1]
        };

        tableData[0] = mapObject;
        webix.ui(webix.copy(locationView.showMapDialog));
        $$("mapLabel").data.label = "<span class='webix_icon fa fa-map-marker'></span> Lokacija";
        $$("saveMap").data.hidden = true;
        $$("showMapDialog").show();
    },

    addChangeVehicleDialog: {
        view: "popup",
        id: "addChangeVehicleDialog",
        modal: true,
        position: "center",
        body: {
            id: "addVehicleInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='webix_icon fa fa-car'></span> Dodavanje vozila",
                            width: 400
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('addChangeVehicleDialog');"
                        }
                    ]
                },
                {
                    cols: [
                        {
                            rows: [
                                {
                                    view: "label",
                                    borderless: true,
                                    height: 50,
                                    label: "Slika vozila",
                                    align: "center"
                                },
                                {
                                    view: "template",
                                    borderless: true,
                                    id: "photo",
                                    name: "photo",
                                    width: 300,
                                    height: 300,
                                    template: "<img src='#src#' width='300' height='300' class='photo-alignment'/>",
                                    onClick: {
                                        "photo-alignment": function (e, id, trg) {
                                            $$("uploadAPI").fileDialog();
                                            return false;
                                        }
                                    },
                                },
                            ]
                        },
                        {
                            width: 20
                        },
                        {
                            view: "form",
                            id: "addChangeVehicleForm",
                            borderless: true,
                            width: 600,
                            elementsConfig: {
                                labelWidth: 200,
                                bottomPadding: 18
                            },
                            elements: [
                                {
                                    view: "text",
                                    id: "vehicleManufacturer",
                                    name: "vehicleManufacturer",
                                    label: "Proizvođač:",
                                    invalidMessage: "Molimo Vas da unesete proizvođača vozila.",
                                    required: true,
                                    suggest: manufacturers
                                },
                                {
                                    view: "text",
                                    id: "vehicleModel",
                                    name: "vehicleModel",
                                    label: "Model:",
                                    invalidMessage: "Molimo Vas da unesete model vozila.",
                                    required: true,
                                    suggest: models,
                                    on: {
                                        onFocus: function (current_view, prev_view) {
                                            vehicleView.loadModels($$("vehicleManufacturer").getValue());
                                        }
                                    }
                                },
                                {
                                    view: "text",
                                    id: "licensePlate",
                                    name: "licensePlate",
                                    label: "Registarske tablice:",
                                    invalidMessage: "Molimo Vas da unesete registarske tablice.",
                                    required: true
                                },
                                {
                                    view: "text",
                                    id: "year",
                                    name: "year",
                                    label: "Godina proizvodnje:",
                                    invalidMessage: "Molimo Vas da unesete godinu proizvodnje.",
                                    required: true,
                                },
                                {
                                    view: "text",
                                    id: "engine",
                                    name: "engine",
                                    label: "Motor:",
                                    invalidMessage: "Molimo Vas da unesete podatke o motoru.",
                                    required: true
                                },
                                {
                                    view: "text",
                                    id: "fuel",
                                    name: "fuel",
                                    label: "Gorivo:",
                                    invalidMessage: "Molimo Vas da unesete podatke o gorivu.",
                                    required: true
                                },
                                {
                                    id: "location",
                                    name: "location",
                                    view: "select",
                                    value: firstLocation,
                                    label: "Lokacija:",
                                    options: locations
                                },
                                {
                                    margin: 5,
                                    cols: [
                                        {},
                                        {
                                            id: "saveVehicle",
                                            view: "button",
                                            value: "Dodajte vozilo",
                                            type: "form",
                                            click: "vehicleView.save",
                                            hotkey: "enter",
                                            width: 170
                                        }
                                    ]
                                }
                            ],
                            rules: {
                                "vehicleManufacturer": function (value) {
                                    if (value.length > 128) {
                                        $$('addChangeVehicleForm').elements.vehicleManufacturer.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                        return false;
                                    }

                                    return true;
                                },
                                "vehicleModel": function (value) {
                                    if (value.length > 128) {
                                        $$('addChangeVehicleForm').elements.vehicleModel.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                        return false;
                                    }

                                    return true;
                                },
                                "licensePlate": function (value) {
                                    if (value.length > 128) {
                                        $$('addChangeVehicleForm').elements.licensePlate.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                        return false;
                                    }

                                    return true;
                                },
                                "year": function (value) {
                                    var regex = /[0-9]{4}/;
                                    if (!regex.test(value)) {
                                        $$('addChangeVehicleForm').elements.year.config.invalidMessage = 'Godina nije pravilno unijeta.';
                                        return false;
                                    }

                                    return true;
                                },
                                "engine": function (value) {
                                    if (value.length > 128) {
                                        $$('addChangeVehicleForm').elements.engine.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                        return false;
                                    }

                                    return true;
                                },
                                "fuel": function (value) {
                                    if (value.length > 128) {
                                        $$('addChangeVehicleForm').elements.fuel.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                        return false;
                                    }

                                    return true;
                                }
                            }
                        }
                    ]
                }
            ]
        }
    },

    showAddDialog: function () {
        if (util.popupIsntAlreadyOpened("addChangeVehicleDialog")) {
            webix.ui(webix.copy(vehicleView.addChangeVehicleDialog)).show();
            webix.UIManager.setFocus("vehicleManufacturer");
        }
    },

    showChangeDialog: function (item) {
        if (util.popupIsntAlreadyOpened("addChangeVehicleDialog")) {
            webix.ui(webix.copy(vehicleView.addChangeVehicleDialog)).show();
            webix.UIManager.setFocus("vehicleManufacturer");

            $$("photo").setValues({
                src: "data:image/png;base64," + item.photo
            });
            $$("addChangeVehicleForm").elements.vehicleManufacturer.setValue(item.manufacturerName);
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
        if ($$("addChangeVehicleForm").validate()) {
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

    vehicleDetailsDialog: {
        view: "popup",
        id: "vehicleDetailDialog",
        modal: true,
        position: "center",
        width: 1008,
        height: 586,
        body: {
            id: "vehicleDetailInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            id: "vehicleDetailLabel",
                            view: "label",
                            label: "<span class='webix_icon fa fa-info'></span> Pregled detalja",
                            width: 900
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('vehicleDetailDialog');"
                        }
                    ]
                },
                {
                    cols: [
                        {
                            container: "areaA",
                            borderless: true,
                            view: "tabview",
                            cells: [
                                {
                                    header: "Rezervacije",
                                    /*body: {
                                        view: "list",
                                        id: "listView",
                                        template: "#rank#. #title# <div style='padding-left:18px'> Year:#year#, votes:#votes# </div>",
                                        type: {
                                            height: 60
                                        },
                                        on: {
                                            onAfterSelect: function () {
                                                $$("formView").show();
                                            }
                                        },
                                        select: true,
                                        data: big_film_set
                                    }*/
                                },
                                {
                                    header: "Troškovi",
                                    body: {
                                        view: "list",
                                        id: "listViewTroskovi",
                                        template: "<div><div style='display: inline; font-weight: bold; font-size: 18px'>#vehicleMaintenanceTypeName#</div> " +
                                            "<div style='float: right'>Datum: #date#</div></div>" +
                                            "<div style='padding-left:18px'>#description#</div>" +
                                            "<div style='padding-left:18px'> Cijena: #price#</div>",
                                        type: {
                                            height: 90
                                        },
                                        select: false
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },

    showVehicleDetailsDialog: function (vehicleId) {
        if (util.popupIsntAlreadyOpened("vehicleDetailsDialog")) {
            webix.ui(webix.copy(vehicleView.vehicleDetailsDialog)).show();
            $$("listViewTroskovi").load("hub/vehicleMaintenance/custom/" + vehicleId).then(function () {
                $$("vehicleDetailsDialog").show();
            });
        }
    },

    preloadDependencies: function () {
        webix.ajax().get("hub/vehicleManufacturer").then(function (data) {
            manufacturers.length = 0;
            var manufacturersTemp = data.json();
            manufacturersTemp.forEach(function (obj) {
                manufacturers.push(obj.name);
            });
        }).fail(function (error) {
            util.messages.showErrorMessage(error.responseText);
        });

        webix.ajax().get("hub/location").then(function (data) {
            locations.length = 0;
            var locationsTemp = data.json();
            firstLocation = locationsTemp[0].id;
            locationsTemp.forEach(function (obj) {
                locations.push({id: obj.id, value: obj.name + " - " + obj.address});
            });
        }).fail(function (error) {
            util.messages.showErrorMessage(error.responseText);
        });
    },

    loadModels: function (manufacturer) {
        if (manufacturer !== "undefined") {
            webix.ajax().get("hub/vehicleModel/manufacturerModels/" + manufacturer).then(function (data) {
                models.length = 0;
                var modelsTemp = data.json();
                modelsTemp.forEach(function (obj) {
                    models.push(obj.name);
                });

                $$("vehicleModel").define("suggest", models);
                $$("vehicleModel").refresh();
            }).fail(function (error) {
                util.messages.showErrorMessage(error.responseText);
            });
        }
    }
};

webix.ui(
    {
        id: "uploadAPI",
        view: "uploader",
        accept: "image/jpeg, image/png",
        autosend: false,
        width: 200,
        apiOnly: true,
        align: "center",
        multiple: false,
        on: {
            onBeforeFileAdd: function (upload) {
                var type = upload.type.toLowerCase();
                if (type != "jpg" && type != "png") {
                    util.messages.showErrorMessage("Dozvoljene ekstenzije su .jpg i .png!")
                    return false;
                }
                var file = upload.file;
                var reader = new FileReader();
                reader.onload = function (event) {
                    var img = new Image();
                    img.onload = function (ev) {
                        if (img.width === 300 && img.height === 300) {
                            $$("photo").setValues({
                                src: event.target.result
                            });
                        } else {
                            util.messages.showErrorMessage("Dimenzije slike moraju biti 300x300 px!")
                        }
                    };
                    img.src = event.target.result;
                };
                reader.readAsDataURL(file);

                return false;
            }
        }
    }
);