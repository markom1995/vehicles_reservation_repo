var freeVehicles = [];
var firstFreeVehicle;
var selectedReservation;

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
                        template: "<span class='fa fa-bookmark'></span> Rezervacije"
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
                    },
                    onBeforeContextMenu: function (id) {
                        var selectedItem = $$("reservationDataView").getItem(id);
                        if (userData.id == selectedItem.userId) {
                            var contextMenuData = [];

                            if (selectedItem.status === "Rezervisano") {
                                contextMenuData.push(
                                    {
                                        id: "1",
                                        value: "Izmijenite",
                                        icon: "pencil-square-o"
                                    },
                                    {
                                        id: "2",
                                        value: "Otkažite",
                                        icon: "close"
                                    },
                                    {
                                        $template: "Separator"
                                    },
                                    {
                                        id: "3",
                                        value: "Započnite putovanje",
                                        icon: "arrow-up"
                                    })
                            }

                            if (selectedItem.status === "Rezervacija u toku") {
                                contextMenuData.push({
                                    id: "4",
                                    value: "Završite putovanje",
                                    icon: "arrow-up"
                                })
                            }

                            $$("reservationContextMenu").clearAll();
                            $$("reservationContextMenu").define("data", contextMenuData);
                            $$("reservationContextMenu").refresh();
                        }
                    },
                },
                url: "hub/reservation",
                type: {
                    height: 308,
                    width: 1320
                },
                template: function (obj) {
                    var startKm;
                    var endKm;
                    if (obj.startKm == null) {
                        startKm = "/";
                    }
                    else {
                        startKm = obj.startKm + "km";
                    }
                    if (obj.endKm == null) {
                        endKm = "/";
                    }
                    else {
                        endKm = obj.endKm + "km";
                    }
                    return (obj.status === "Rezervisano" ? "<div style='height: 13px'></div><div style='border: solid 5px green; border-radius: 15px 50px; overflow: hidden'>" +
                        "<div style='font-size: larger;display: inline; font-weight: bolder; margin-left: 10px'>" + obj.name + "</div><div style='font-size: larger;font-weight: bolder; float: right; margin-right: 20px''>" + obj.startTime + " - " + obj.endTime + "</div><br/>" +
                        "<div style='overflow: hidden'><div style='display: inline-block'><div style='height: 50px;'></div><div style='margin-left: 15px; height: 1px'>Početna i krajnja kilometraža: " + startKm + " - " + endKm + "</div><br/>" +
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
                        "</div>" : obj.status === "Rezervacija u toku" ? "<div style='height: 13px'></div><div style='border: solid 5px yellow; border-radius: 15px 50px; overflow: hidden'>" +
                        "<div style='font-size: larger;display: inline; font-weight: bolder; margin-left: 10px'>" + obj.name + "</div><div style='font-size: larger;font-weight: bolder; float: right; margin-right: 20px''>" + obj.startTime + " - " + obj.endTime + "</div><br/>" +
                        "<div style='overflow: hidden'><div style='display: inline-block'><div style='height: 50px;'></div><div style='margin-left: 15px; height: 1px'>Početna i krajnja kilometraža: " + startKm + " - " + endKm + "</div><br/>" +
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
                        "<div style='overflow: hidden'><div style='display: inline-block'><div style='height: 50px;'></div><div style='margin-left: 15px; height: 1px'>Početna i krajnja kilometraža: " + startKm + " - " + endKm + "</div><br/>" +
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
            data: [],
            master: $$("reservationDataView"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            selectedReservation = $$("reservationDataView").getSelectedItem();
                            reservationView.showChangeDialog($$("reservationDataView").getSelectedItem());
                            break;
                        case "2":
                            var otkBox = (webix.copy(commonViews.otkazivanjePotvrda("rezervacije", "rezervaciju")));
                            var newItem = $$("reservationDataView").getSelectedItem();

                            otkBox.callback = function (result) {
                                if (result == 1) {
                                    webix.ajax().del("hub/reservation/" + newItem.id).then(function (data) {
                                        if (data.text() === "Success") {
                                            util.messages.showMessage("Uspješno otkazivanje rezervacije.");
                                            $$("reservationDataView").remove(newItem.id);
                                        }
                                        else {
                                            util.messages.showErrorMessage("Neuspješno otkazivanje rezervacije.");
                                        }
                                    }).fail(function (error) {
                                        util.messages.showErrorMessage(error.responseText);
                                    });
                                }
                            };
                            webix.confirm(otkBox);
                            break;
                        case "3":
                            selectedReservation = $$("reservationDataView").getSelectedItem();
                            reservationView.showStartTripDialog();
                            break;
                        case "4":
                            selectedReservation = $$("reservationDataView").getSelectedItem();
                            reservationView.showFinishTripDialog();
                            break;
                    }
                }
            }
        });
    },

    addChangeReservationDialog: {
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
                            label: "<span class='webix_icon fa fa-bookmark'></span> Dodavanje rezervacije",
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
                                    view: "template",
                                    borderless: true,
                                    id: "photo",
                                    name: "photo",
                                    width: 200,
                                    height: 200,
                                    hidden: true,
                                    template: "<img src='data:image/jpg;base64, #src#' width='200' height='200' alt='Izaberite vozilo' class='photo-alignment'/>"
                                },
                                {
                                    view: "label",
                                    borderless: true,
                                    id: "manufacturerName",
                                    name: "manufacturerName",
                                    height: 50,
                                    label: "Proizvođač",
                                    align: "center",
                                    hidden: true,
                                },
                                {
                                    view: "label",
                                    borderless: true,
                                    id: "modelName",
                                    name: "modelName",
                                    height: 50,
                                    label: "Model",
                                    align: "center",
                                    hidden: true,
                                },
                                {
                                    view: "label",
                                    borderless: true,
                                    id: "licensePlate",
                                    name: "licensePlate",
                                    height: 50,
                                    label: "Registarske tablice",
                                    align: "center",
                                    hidden: true,
                                },
                                {
                                    view: "label",
                                    borderless: true,
                                    id: "year",
                                    name: "year",
                                    height: 50,
                                    label: "Godina proizvodnje",
                                    align: "center",
                                    hidden: true,
                                },
                                {
                                    view: "label",
                                    borderless: true,
                                    id: "engine",
                                    name: "engine",
                                    height: 50,
                                    label: "Motor",
                                    align: "center",
                                    hidden: true,
                                },
                                {
                                    view: "label",
                                    borderless: true,
                                    id: "fuel",
                                    name: "fuel",
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
                                    type: "date",
                                    required: true,
                                    invalidMessage: "Molimo Vas da unesete vrijeme polaska.",
                                    format: "%d-%m-%Y %H:%i:%s",
                                    suggest: {
                                        type: "calendar",
                                        body: {
                                            type: "date",
                                            timepicker: true,
                                            calendarTime: "%d-%m-%Y %H:%i:%s",
                                            minDate: new Date()
                                        }
                                    },
                                    on: {
                                        onChange: function (newValue, oldValue) {
                                            $$("endTime").define("value", newValue);
                                            $$("endTime").define("disabled", false);
                                            $$("endTime").getPopup().getBody().define("minDate", newValue);
                                            $$("endTime").refresh();
                                        }
                                    }
                                },
                                {
                                    id: "endTime",
                                    name: "endTime",
                                    view: "datepicker",
                                    stringResult: true,
                                    label: "Vrijeme povratka:",
                                    disabled: true,
                                    timepicker: true,
                                    type: "date",
                                    required: true,
                                    invalidMessage: "Molimo Vas da unesete vrijeme povratka.",
                                    format: "%d-%m-%Y %H:%i:%s",
                                    suggest: {
                                        type: "calendar",
                                        body: {
                                            type: "date",
                                            timepicker: true,
                                            calendarTime: "%d-%m-%Y %H:%i:%s"
                                        }
                                    },
                                    on: {
                                        onChange: function (newValue, oldValue) {
                                            $$("vehicleId").define("disabled", false);
                                            var startTime = webix.i18n.parseFormatStr($$("startTime").getValue()) + ":00";
                                            var endTime = webix.i18n.parseFormatStr(newValue) + ":00";
                                            reservationView.loadFreeVehicle(startTime, endTime);
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
                                    value: firstFreeVehicle,
                                    invalidMessage: "Molimo Vas da odaberete vozilo.",
                                    required: true,
                                    disabled: true,
                                    label: "Vozilo:",
                                    options: [],
                                    on: {
                                        onChange: function (newValue, oldValue) {
                                            var options = $$("vehicleId").config.options;
                                            for (var i = 0; i < options.length; i++) {
                                                if (options[i].id == newValue) {
                                                    $$("photo").show();
                                                    $$("manufacturerName").show();
                                                    $$("modelName").show();
                                                    $$("licensePlate").show();
                                                    $$("year").show();
                                                    $$("engine").show();
                                                    $$("fuel").show();

                                                    $$("photo").setValues({
                                                        src: options[i].item.photo
                                                    });
                                                    $$("manufacturerName").config.label = "Proizvođač: " + options[i].item.manufacturerName;
                                                    $$("modelName").config.label = "Model: " + options[i].item.modelName;
                                                    $$("licensePlate").config.label = "Registarske tablice: " + options[i].item.licensePlate;
                                                    $$("year").config.label = "Godina proizvodnje: " + options[i].item.year;
                                                    $$("engine").config.label = "Motor: " + options[i].item.engine;
                                                    $$("fuel").config.label = "Gorivo: " + options[i].item.fuel;

                                                    $$("photo").refresh();
                                                    $$("manufacturerName").refresh();
                                                    $$("modelName").refresh();
                                                    $$("licensePlate").refresh();
                                                    $$("year").refresh();
                                                    $$("engine").refresh();
                                                    $$("fuel").refresh();
                                                }
                                            }
                                        }
                                    }
                                },
                                {
                                    margin: 5,
                                    cols: [
                                        {},
                                        {
                                            id: "saveReservation",
                                            view: "button",
                                            value: "Dodajte rezervaciju",
                                            type: "form",
                                            click: "reservationView.save",
                                            hotkey: "enter",
                                            width: 170
                                        }
                                    ]
                                }
                            ],
                            rules: {
                                "name": function (value) {
                                    if (value.length > 128) {
                                        $$('addChangeReservationForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                        return false;
                                    }

                                    return true;
                                },
                                "direction": function (value) {
                                    if (value.length > 500) {
                                        $$('addChangeReservationForm').elements.direction.config.invalidMessage = 'Maksimalan broj karaktera je 500.';
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

    save: function () {
        if ($$("addChangeReservationForm").validate()) {
            var newItem = {
                id: null,
                name: $$("addChangeReservationForm").getValues().name,
                startTime: $$("addChangeReservationForm").getValues().startTime + ":00",
                endTime: $$("addChangeReservationForm").getValues().endTime + ":00",
                direction: $$("addChangeReservationForm").getValues().direction,
                reservationStatusId: 1,
                deleted: 0,
                userId: userData.id,
                vehicleId: $$("addChangeReservationForm").getValues().vehicleId,
                companyId: companyData.id
            };

            webix.ajax().header({"Content-type": "application/json"})
                .post("hub/reservation", newItem).then(function (data) {
                $$("reservationDataView").add(data.json());
                $$("reservationDataView").refresh();
                reservationView.selectPanel();
                util.messages.showMessage("Uspješno dodavanje nove rezervacije.");
            }).fail(function (error) {
                util.messages.showErrorMessage(error.responseText);
            });

            util.dismissDialog('addChangeReservationDialog');
        }
    },

    saveChanges: function () {
        if ($$("addChangeReservationForm").validate()) {
            var reservationForUpdate = selectedReservation;
            reservationForUpdate.name = $$("addChangeReservationForm").getValues().name;
            reservationForUpdate.startTime = $$("addChangeReservationForm").getValues().startTime + ":00";
            reservationForUpdate.endTime = $$("addChangeReservationForm").getValues().endTime + ":00";
            reservationForUpdate.direction = $$("addChangeReservationForm").getValues().direction;
            reservationForUpdate.vehicleId = $$("addChangeReservationForm").getValues().vehicleId;

            webix.ajax().header({"Content-type": "application/json"})
                .put("hub/reservation/" + selectedReservation.id, reservationForUpdate).then(function (data) {
                if (data.text() === "Success") {
                    reservationView.selectPanel();

                    util.messages.showMessage("Rezervacija uspješno izmijenjena.");
                } else {
                    util.messages.showErrorMessage("Rezervacija neuspješno izmijenjena.");
                }
            }).fail(function (error) {
                util.messages.showErrorMessage(error.responseText);
            });

            util.dismissDialog('addChangeReservationDialog');
        }
    },

    showAddDialog: function () {
        if (util.popupIsntAlreadyOpened("addChangeReservationDialog")) {
            webix.ui(webix.copy(reservationView.addChangeReservationDialog)).show();
            webix.UIManager.setFocus("name");
        }
    },

    showChangeDialog: function (item) {
        if (util.popupIsntAlreadyOpened("addChangeReservationDialog")) {
            webix.ui(webix.copy(reservationView.addChangeReservationDialog)).show();

            $$("addChangeReservationForm").elements.name.setValue(item.name);
            $$("addChangeReservationForm").elements.startTime.setValue(item.startTime);
            $$("addChangeReservationForm").elements.endTime.setValue(item.endTime);
            $$("addChangeReservationForm").elements.direction.setValue(item.direction);
            $$("addChangeReservationForm").elements.vehicleId.setValue(item.vehicleId);
            $$("saveReservation").define("value", "Sačuvajte izmjene");
            $$("saveReservation").define("click", "reservationView.saveChanges");
            $$("saveReservation").refresh();

            $$("addChangeReservationDialog").show();
            webix.UIManager.setFocus("name");
        }
    },

    startTripDialog: {
        view: "popup",
        id: "startTripDialog",
        modal: true,
        position: "center",
        body: {
            id: "startTripInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='webix_icon fa fa-bookmark'></span> Dodavanje početne kilometraže",
                            width: 300
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('startTripDialog');"
                        }
                    ]
                },
                {
                    cols: [
                        {
                            view: "form",
                            id: "startTripForm",
                            borderless: true,
                            width: 400,
                            elementsConfig: {
                                labelWidth: 200,
                                bottomPadding: 18
                            },
                            elements: [
                                {
                                    view: "text",
                                    id: "startKm",
                                    name: "startKm",
                                    label: "Početna kilometraža:",
                                    invalidMessage: "Molimo Vas da unesete početnu kilometražu.",
                                    required: true,
                                },
                                {
                                    margin: 5,
                                    cols: [
                                        {},
                                        {
                                            id: "saveStartTrip",
                                            view: "button",
                                            value: "Započnite putovanje",
                                            type: "form",
                                            click: "reservationView.startTrip",
                                            hotkey: "enter",
                                            width: 170
                                        }
                                    ]
                                }
                            ],
                            rules: {
                                "startKm": function (value) {
                                    if (value.length > 128) {
                                        $$('startTripForm').elements.startKm.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                        return false;
                                    }

                                    if (!webix.rules.isNumber(value)) {
                                        $$('startTripForm').elements.startKm.config.invalidMessage = 'Početna kilometraža nije u ispravnom formatu.';
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

    showStartTripDialog: function () {
        if (util.popupIsntAlreadyOpened("startTripDialog")) {
            webix.ui(webix.copy(reservationView.startTripDialog)).show();
            webix.UIManager.setFocus("startKm");
        }
    },

    startTrip: function () {
        if ($$("startTripForm").validate()) {
            var reservationForUpdate = selectedReservation;
            reservationForUpdate.startKm = $$("startTripForm").getValues().startKm;
            reservationForUpdate.reservationStatusId = 2;

            webix.ajax().header({"Content-type": "application/json"})
                .put("hub/reservation/" + reservationForUpdate.id, reservationForUpdate).then(function (data) {
                if (data.text() === "Success") {
                    $$("reservationDataView").updateItem(reservationForUpdate.id, reservationForUpdate);
                    $$("reservationDataView").refresh();
                    reservationView.selectPanel();

                    util.messages.showMessage("Putovanje uspješno započeto.");
                } else {
                    util.messages.showErrorMessage("Putovanje neuspješno započeto.");
                }

            }).fail(function (error) {
                util.messages.showErrorMessage(error.responseText);
            });

            util.dismissDialog('startTripDialog');
        }
    },

    finishTripDialog: {
        view: "popup",
        id: "finishTripDialog",
        modal: true,
        position: "center",
        body: {
            id: "finishTripInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='webix_icon fa fa-bookmark'></span> Dodavanje krajnje kilometraže",
                            width: 300
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('finishTripDialog');"
                        }
                    ]
                },
                {
                    cols: [
                        {
                            view: "form",
                            id: "finishTripForm",
                            borderless: true,
                            width: 400,
                            elementsConfig: {
                                labelWidth: 200,
                                bottomPadding: 18
                            },
                            elements: [
                                {
                                    view: "text",
                                    id: "endKm",
                                    name: "endKm",
                                    label: "Krajnja kilometraža:",
                                    invalidMessage: "Molimo Vas da unesete krajnju kilometražu.",
                                    required: true,
                                },
                                {
                                    margin: 5,
                                    cols: [
                                        {},
                                        {
                                            id: "saveFinishTrip",
                                            view: "button",
                                            value: "Završite putovanje",
                                            type: "form",
                                            click: "reservationView.finishTrip",
                                            hotkey: "enter",
                                            width: 170
                                        }
                                    ]
                                }
                            ],
                            rules: {
                                "endKm": function (value) {
                                    if (value.length > 128) {
                                        $$('finishTripForm').elements.endKm.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                        return false;
                                    }

                                    if (!webix.rules.isNumber(value)) {
                                        $$('finishTripForm').elements.endKm.config.invalidMessage = 'Krajnja kilometraža nije u ispravnom formatu.';
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

    showFinishTripDialog: function () {
        if (util.popupIsntAlreadyOpened("finishTripDialog")) {
            webix.ui(webix.copy(reservationView.finishTripDialog)).show();
            webix.UIManager.setFocus("endKm");
        }
    },

    finishTrip: function () {
        if ($$("finishTripForm").validate()) {
            var reservationForUpdate = selectedReservation;
            reservationForUpdate.endKm = $$("finishTripForm").getValues().endKm;
            reservationForUpdate.reservationStatusId = 3;

            webix.ajax().header({"Content-type": "application/json"})
                .put("hub/reservation/" + reservationForUpdate.id, reservationForUpdate).then(function (data) {
                if (data.text() === "Success") {
                    $$("reservationDataView").updateItem(reservationForUpdate.id, reservationForUpdate);
                    $$("reservationDataView").refresh();
                    reservationView.selectPanel();

                    util.messages.showMessage("Putovanje uspješno završeno.");
                } else {
                    util.messages.showErrorMessage("Putovanje neuspješno zavrsšeno.");
                }

            }).fail(function (error) {
                util.messages.showErrorMessage(error.responseText);
            });

            util.dismissDialog('finishTripDialog');
        }
    },

    loadFreeVehicle: function (startTime, endTime) {
        webix.ajax().get("hub/vehicle/custom/reservation/" + startTime + "/" + endTime).then(function (data) {
            freeVehicles.length = 0;
            var freeVehiclesTemp = data.json();
            firstFreeVehicle = freeVehiclesTemp[0].id;
            freeVehiclesTemp.forEach(function (obj) {
                freeVehicles.push({
                    id: obj.id,
                    value: obj.licensePlate + " - " + obj.manufacturerName + " " + obj.modelName,
                    item: obj
                });
            });

            $$("vehicleId").define({
                options: freeVehicles,
                value: firstFreeVehicle
            });
            $$("vehicleId").refresh();
        }).fail(function (error) {
            util.messages.showErrorMessage("Neuspješno dobavljanje podataka o vozilima.");
        });
    }
}