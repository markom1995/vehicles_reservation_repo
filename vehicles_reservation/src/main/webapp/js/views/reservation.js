var vehicles = [];
var firstVehicle;

var reservationView = {
    panel: {
        id: "reservationPanel",
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
                        template: "<span class='fa fa-hand-pointer-o'></span> Rezervacije"
                    },
                    {},
                    {
                        id: "addReservationBtn",
                        view: "button",
                        type: "iconButton",
                        label: "Dodajte novu rezervaciju",
                        click: "reservationView.showAddDialog",
                        icon: "plus-circle",
                        autowidth: true
                    }
                ]
            },
            {
                view: "dataview",
                id: "reservationDataView",
                container: "dataA",
                select: true,
                onContext: {},
                on: {
                    onAfterContextMenu: function (item) {
                        this.select(item);
                    }
                },
                url: "hub/reservation",
                type: {
                    height: 308,
                    width: 1320
                },
                template: function (obj) {
                    return(obj.status==="Rezervisano" ? "<div style='height: 13px'></div><div style='border: solid 5px green; border-radius: 15px 50px; overflow: hidden'>" +
                        "<div style='font-size: larger;display: inline; font-weight: bolder; margin-left: 10px'>" + obj.name + "</div><div style='font-size: larger;font-weight: bolder; float: right; margin-right: 20px''>" + obj.startTime + " - " + obj.endTime + "</div><br/>" +
                        "<div style='overflow: hidden'><div style='display: inline-block'><div style='height: 50px;'></div><div style='margin-left: 15px; height: 1px'>Početna i krajnja kilometraža: " + obj.startKm + "km" + " - " + obj.endKm + "km" + "</div><br/>" +
                        "<div style='margin-left: 15px'>Pravac puta: " + obj.direction + "</div></div><div style='display: inline-block; float: right'>" +
                        "<div style='display: inline;float: right;'><span style='display: inline;float: left;'>" +
                        "<span style='height: 1px' align='center'>Proizvođač: " + obj.manufacturerName + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Model: " + obj.modelName + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Registarske tablice: " + obj.licensePlate + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Godina proizvodnje: " + obj.year + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Motor: " + obj.engine + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Gorivo: " + obj.fuel + "</span><br/></span>" +
                        "<span style='display:inline; float: right; margin-right: 20px'><div align='center'><img src='data:image/png;base64, " + obj.photo + "' alt='Nema slike' width='200' height='200' align='center'/></div></span></div></div></div>" +
                        "<div style='font-size: larger;display: inline; font-weight: bolder; margin-left: 25px'>Rezervisao: " + obj.firstName + " " + obj.lastName + " - " + obj.username + "</div>" +
                        "</div>" : obj.status==="Rezervacija u toku" ? "<div style='height: 13px'></div><div style='border: solid 5px yellow; border-radius: 15px 50px; overflow: hidden'>" +
                        "<div style='font-size: larger;display: inline; font-weight: bolder; margin-left: 10px'>" + obj.name + "</div><div style='font-size: larger;font-weight: bolder; float: right; margin-right: 20px''>" + obj.startTime + " - " + obj.endTime + "</div><br/>" +
                        "<div style='overflow: hidden'><div style='display: inline-block'><div style='height: 50px;'></div><div style='margin-left: 15px; height: 1px'>Početna i krajnja kilometraža: " + obj.startKm + "km" + " - " + obj.endKm + "km" + "</div><br/>" +
                        "<div style='margin-left: 15px'>Pravac puta: " + obj.direction + "</div></div><div style='display: inline-block; float: right'>" +
                        "<div style='display: inline;float: right;'><span style='display: inline;float: left;'>" +
                        "<span style='height: 1px' align='center'>Proizvođač: " + obj.manufacturerName + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Model: " + obj.modelName + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Registarske tablice: " + obj.licensePlate + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Godina proizvodnje: " + obj.year + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Motor: " + obj.engine + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Gorivo: " + obj.fuel + "</span><br/></span>" +
                        "<span style='display:inline; float: right; margin-right: 20px'><div align='center'><img src='data:image/png;base64, " + obj.photo + "' alt='Nema slike' width='200' height='200' align='center'/></div></span></div></div></div>" +
                        "<div style='font-size: larger;display: inline; font-weight: bolder; margin-left: 25px'>Rezervisao: " + obj.firstName + " " + obj.lastName + " - " + obj.username + "</div>" +
                        "</div>" : "<div style='height: 13px'></div><div style='border: solid 5px red; border-radius: 15px 50px; overflow: hidden'>" +
                        "<div style='font-size: larger;display: inline; font-weight: bolder; margin-left: 10px'>" + obj.name + "</div><div style='font-size: larger;font-weight: bolder; float: right; margin-right: 20px''>" + obj.startTime + " - " + obj.endTime + "</div><br/>" +
                        "<div style='overflow: hidden'><div style='display: inline-block'><div style='height: 50px;'></div><div style='margin-left: 15px; height: 1px'>Početna i krajnja kilometraža: " + obj.startKm + "km" + " - " + obj.endKm + "km" + "</div><br/>" +
                        "<div style='margin-left: 15px'>Pravac puta: " + obj.direction + "</div></div><div style='display: inline-block; float: right'>" +
                        "<div style='display: inline;float: right;'><span style='display: inline;float: left;'>" +
                        "<span style='height: 1px' align='center'>Proizvođač: " + obj.manufacturerName + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Model: " + obj.modelName + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Registarske tablice: " + obj.licensePlate + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Godina proizvodnje: " + obj.year + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Motor: " + obj.engine + "</span><br/>" +
                        "<span style='height: 1px' align='center'>Gorivo: " + obj.fuel + "</span><br/></span>" +
                        "<span style='display:inline; float: right; margin-right: 20px'><div align='center'><img src='data:image/png;base64, " + obj.photo + "' alt='Nema slike' width='200' height='200' align='center'/></div></span></div></div></div>" +
                        "<div style='font-size: larger;display: inline; font-weight: bolder; margin-left: 25px'>Rezervisao: " + obj.firstName + " " + obj.lastName + " - " + obj.username + "</div>" +
                        "</div>");
                }
                /*on: {
                    onItemDblClick: function (id) {
                        reservationView.showVehicleDetailsDialog($$("vehicleDataView").getSelectedItem().id);
                    }
                }*/
            }
        ]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "reservationPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        webix.ui({
            view: "contextmenu",
            id: "reservationContextMenu",
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
            master: $$("reservationDataView"),
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
    },

    addChangeReservationDialog:{
        view: "popup",
        id: "addChangeReservationDialog",
        modal: true,
        position: "center",
        body: {
            id: "addChangeReservationInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='webix_icon fa fa-hand-pointer-o'></span> Dodavanje rezervacije",
                            width: 400
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('addChangeReservationDialog');"
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
                                    hidden: true,
                                    template: "<img src='#src#' width='300' height='300' alt='Izaberite vozilo' class='photo-alignment'/>"
                                },
                                {
                                    view: "label",
                                    borderless: true,
                                    height: 50,
                                    label: "Proizvođač",
                                    align: "center",
                                    hidden: true,
                                },
                                {
                                    view: "label",
                                    borderless: true,
                                    height: 50,
                                    label: "Model",
                                    align: "center",
                                    hidden: true,
                                },
                                {
                                    view: "label",
                                    borderless: true,
                                    height: 50,
                                    label: "Registarske tablice",
                                    align: "center",
                                    hidden: true,
                                },
                                {
                                    view: "label",
                                    borderless: true,
                                    height: 50,
                                    label: "Godina proizvodnje",
                                    align: "center",
                                    hidden: true,
                                },
                                {
                                    view: "label",
                                    borderless: true,
                                    height: 50,
                                    label: "Motor",
                                    align: "center",
                                    hidden: true,
                                },
                                {
                                    view: "label",
                                    borderless: true,
                                    height: 50,
                                    label: "Gorivo",
                                    align: "center",
                                    hidden: true,
                                },
                            ]
                        },
                        {
                            width: 20
                        },
                        {
                            view: "form",
                            id: "addChangeReservationForm",
                            borderless: true,
                            width: 600,
                            elementsConfig: {
                                labelWidth: 200,
                                bottomPadding: 18
                            },
                            elements: [
                                {
                                    view: "text",
                                    id: "name",
                                    name: "name",
                                    label: "Naziv:",
                                    invalidMessage: "Molimo Vas da unesete naziv rezervacije.",
                                    required: true,
                                },
                                {
                                    id: "startTime",
                                    name: "startTime",
                                    view: "datepicker",
                                    stringResult: true,
                                    label: "Vrijeme polaska:",
                                    timepicker: true,
                                    type: "time",
                                    required: true,
                                    invalidMessage: "Molimo Vas da unesete vrijeme polaska.",
                                    format: "%d.%m.%Y %H:%i:%s",
                                    suggest: {
                                        type: "calendar",
                                        body: {
                                            type: "time",
                                            calendarTime: "%d.%m.%Y %H:%i:%s"
                                        }
                                    }
                                },
                                {
                                    id: "endTime",
                                    name: "endTime",
                                    view: "datepicker",
                                    stringResult: true,
                                    label: "Vrijeme povratka:",
                                    timepicker: true,
                                    type: "time",
                                    required: true,
                                    invalidMessage: "Molimo Vas da unesete vrijeme povratka.",
                                    format: "%d.%m.%Y %H:%i:%s",
                                    suggest: {
                                        type: "calendar",
                                        body: {
                                            type: "time",
                                            calendarTime: "%d.%m.%Y %H:%i:%s"
                                        }
                                    }
                                },
                                {
                                    view: "text",
                                    id: "direction",
                                    name: "direction",
                                    label: "Pravac puta:",
                                    invalidMessage: "Molimo Vas da unesete pravac puta.",
                                    required: true,
                                },
                                {
                                    id: "vehicleId",
                                    name: "vehicleId",
                                    view: "select",
                                    value: firstVehicle,
                                    label: "Vozilo:",
                                    options: vehicles
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
                                            click: "reservationView.save",
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
        if (util.popupIsntAlreadyOpened("addChangeReservationDialog")) {
            webix.ui(webix.copy(reservationView.addChangeReservationDialog)).show();
        }
    },
}