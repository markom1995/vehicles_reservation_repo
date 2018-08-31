var vehicles = []
var firstVehicle;
var startDate;
var endDate;

var chartView = {
    panel: {
        id: "chartPanel",
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
                        template: "<span class='fa fa-percent'></span> Grafikoni za troškove vozila"
                    },
                    {},
                    {
                        id: "selectFilter",
                        view: "select",
                        label: "Način prikazivanja izvještaja:",
                        labelWidth: 200,
                        width: 400,
                        value: 1,
                        editable: false,
                        options: [
                            {
                                id: 1,
                                value: "Sedmični"
                            },
                            {
                                id: 2,
                                value: "Mjesečni"
                            },
                            {
                                id: 3,
                                value: "Godišnji"
                            }
                        ],
                        on: {
                            onChange: function (id) {

                            }
                        }
                    },
                    {
                        id: "datePickerFilter",
                        view: "daterangepicker",
                        name: "datePickerFilter",
                        label: "Od - do:",
                        width: 300,
                        labelWidth: 65,
                        suggest: {
                            view: "daterangesuggest",
                            body: {
                                calendarCount: 1,
                                icons: true,
                                css: "custom_date_picker_report",
                            }
                        },
                        on: {
                            onChange: function (dates) {
                                if (dates.start != null && dates.end != null) {
                                    var myFormat = webix.Date.dateToStr("%d.%m.%Y");
                                    var startDate = myFormat(new Date(dates.start));
                                    var endDate = myFormat(new Date(dates.end));

                                    $$("vehicleMaintenancesChart").clearAll();
                                    var selectFilter = $$("selectFilter").getValue();
                                    if (selectFilter == 1) {
                                        $$("vehicleMaintenancesChart").load(function () {
                                            return webix.ajax().header({"Content-type": "application/x-www-form-urlencoded"})
                                                .post("hub/vehicleMaintenance/chart/week", "startDate=" + startDate + "&endDate=" + endDate).then(function (data) {
                                                    ;
                                                    return data.json();
                                                }).fail(function (error) {
                                                    util.messages.showErrorMessage(error.responseText);
                                                });
                                        });
                                        $$('vehicleMaintenancesChart').config.xAxis.title = "Troškovi po sedmicama";
                                    }
                                    else if (selectFilter == 2) {
                                        $$("vehicleMaintenancesChart").load(function () {
                                            return webix.ajax().header({"Content-type": "application/x-www-form-urlencoded"})
                                                .post("hub/vehicleMaintenance/chart/month", "startDate=" + startDate + "&endDate=" + endDate).then(function (data) {
                                                    return data.json();
                                                }).fail(function (error) {
                                                    util.messages.showErrorMessage(error.responseText);
                                                });
                                        });
                                        $$('vehicleMaintenancesChart').config.xAxis.title = "Troškovi po mjesecima";
                                    }
                                    else {
                                        $$("vehicleMaintenancesChart").load(function () {
                                            return webix.ajax().header({"Content-type": "application/x-www-form-urlencoded"})
                                                .post("hub/vehicleMaintenance/chart/year", "startDate=" + startDate + "&endDate=" + endDate).then(function (data) {
                                                    return data.json();
                                                }).fail(function (error) {
                                                    util.messages.showErrorMessage(error.responseText);
                                                });
                                        });
                                        $$('vehicleMaintenancesChart').config.xAxis.title = "Troškovi po godinama";
                                    }

                                    $$('vehicleMaintenancesChart').refresh();
                                    $$("datePickerFilter").getPopup().hide();
                                }
                            }
                        }
                    }
                ]
            },
            {
                view: "scrollview",
                id: "scrollview",
                scroll: "x",
                body: {
                    view: "chart",
                    id: "vehicleMaintenancesChart",
                    type: "bar",
                    scale: "logarithmic",
                    gradient: "rising",
                    width: 1000,
                    xAxis: {
                        title: "Troškovi po vremenskoj jedinici",
                        template: "#timeUnit#",
                        lines: false
                    },
                    yAxis: {
                        title: "Novac",
                        template: function (value) {
                            return value + "KM"
                        }
                    },
                    padding: {
                        left: 70,
                        right: 10,
                        top: 50
                    },
                    series: [
                        {
                            value: "#serviceCost#",
                            label: "#serviceCost#KM",
                            color: "#58dccd",
                        },
                        {
                            value: "#fuelCost#",
                            label: "#fuelCost#KM",
                            color: "#a7ee70",
                        },
                        {
                            value: "#otherCost#",
                            label: "#otherCost#KM",
                            color: "#36abee",
                        }
                    ],
                    legend: {
                        values: [
                            {text: "Servis vozila", color: "#58dccd"},
                            {text: "Potrošnja goriva", color: "#a7ee70"},
                            {text: "Ostali troškovi", color: "#36abee"}
                        ],
                        valign: "middle",
                        align: "right",
                        width: 120,
                        layout: "y"
                    },
                    data: []
                }
            },
            {
                view: "toolbar",
                padding: 8,
                css: "panelToolbar",
                height: 50,
                cols: [
                    {
                        view: "label",
                        width: 500,
                        template: "<span class='fa fa-download'></span> Preuzimanje mjesečnih izvještaja za troškove vozila"
                    },
                    {},
                    {
                        id: "downloadMonthReportBtn",
                        view: "button",
                        type: "iconButton",
                        label: "Preuzmite izvještaj",
                        icon: "download",
                        click: 'chartView.showDownloadDialog',
                        autowidth: true
                    }
                ]
            }
        ]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "chartPanel";
        var panelCopy = webix.copy(this.panel);
        $$("main").addView(webix.copy(panelCopy));
    },

    downloadDialog: {
        view: "popup",
        id: "downloadDialog",
        modal: true,
        position: "center",
        body: {
            id: "downloadInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='webix_icon fa-download'></span> Preuzimanje mjesečnih izvještaja za troškove vozila",
                            width: 400
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('downloadDialog');"
                        }
                    ]
                },
                {
                    view: "form",
                    id: "downloadForm",
                    width: 700,
                    elementsConfig: {
                        labelWidth: 325,
                        bottomPadding: 18
                    },
                    elements: [
                        {
                            id: "monthReportType",
                            name: "monthReportType",
                            view: "radio",
                            label: "Vrsta mjesečnog izvještaja za troškove vozila:",
                            required: true,
                            value: 1,
                            invalidMessage: "Molimo Vas da odaberete jednu opciju.",
                            options: [
                                {
                                    id: 1,
                                    value: "Za sva vozila",
                                    newline: true
                                },
                                {
                                    id: 2,
                                    value: "Za jedno vozilo",
                                    newline: true
                                }
                            ],
                            on: {
                                onChange: function (newValue, oldvalue) {
                                    if (newValue == 1) {
                                        $$("vehicleId").disable();
                                    }
                                    else {
                                        $$("vehicleId").enable();
                                    }
                                }
                            }
                        },
                        {
                            id: "datePickerFilterDownloadFile",
                            view: "daterangepicker",
                            name: "datePickerFilterDownloadFile",
                            label: "Od - do:",
                            required: true,
                            invalidMessage: "Molimo Vas da odaberete datume.",
                            suggest: {
                                view: "daterangesuggest",
                                body: {
                                    calendarCount: 1,
                                    icons: true,
                                    css: "custom_date_picker_report",
                                }
                            },
                            on: {
                                onChange: function (dates) {
                                    if (dates.start != null && dates.end != null) {
                                        var myFormat = webix.Date.dateToStr("%d.%m.%Y");
                                        startDate = myFormat(new Date(dates.start));
                                        endDate = myFormat(new Date(dates.end));

                                        $$("datePickerFilterDownloadFile").getPopup().hide();
                                    }
                                }
                            }
                        },
                        {
                            id: "fileFormat",
                            name: "fileFormat",
                            view: "select",
                            value: 1,
                            invalidMessage: "Molimo Vas da odaberete format.",
                            required: true,
                            label: "Format fajla:",
                            options: [
                                {
                                    id: 1,
                                    value: "PDF",
                                },
                                {
                                    id: 2,
                                    value: "XLS",
                                },
                                {
                                    id: 3,
                                    value: "CSV",
                                }
                            ]
                        },
                        {
                            id: "vehicleId",
                            name: "vehicleId",
                            view: "select",
                            value: firstVehicle,
                            invalidMessage: "Molimo Vas da odaberete vozilo.",
                            required: true,
                            disabled: true,
                            label: "Vozilo:",
                            options: []
                        },
                        {
                            margin: 5,
                            cols: [
                                {},
                                {
                                    id: "DownloadFile",
                                    view: "button",
                                    value: "Preuzmite mjesečni izvještaj",
                                    type: "form",
                                    click: "chartView.download",
                                    hotkey: "enter",
                                    width: 300
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },

    showDownloadDialog: function () {
        if (util.popupIsntAlreadyOpened("downloadDialog")) {
            webix.ui(webix.copy(chartView.downloadDialog)).show();
            chartView.loadVehicle();
        }
    },

    download: function () {
        if ($$("downloadForm").validate()) {
            var monthReportType = $$("monthReportType").getValue();
            var fileFormatId = $$("fileFormat").getValue();
            var fileFormat;
            if (fileFormatId == 1) {
                fileFormat = "PDF";
            }
            else if (fileFormatId == 2) {
                fileFormat = "XLS";
            }
            else {
                fileFormat = "CSV";
            }
            if (monthReportType == 1) {
                webix.ajax().header({"Content-type": "application/x-www-form-urlencoded"})
                    .post("hub/vehicleMaintenance/report/all/month", "startDate=" + startDate + "&endDate=" + endDate + "&format=" + fileFormat).then(function (data) {
                    var file = data.json();
                    var blob = util.b64toBlob(file.content);
                    saveFileAs(blob, file.name);
                }).fail(function (error) {
                    util.messages.showErrorMessage(error.responseText);
                });
            }
            else {
                var vehicleId = $$("vehicleId").getValue();
                webix.ajax().header({"Content-type": "application/x-www-form-urlencoded"})
                    .post("hub/vehicleMaintenance/report/vehicle/month", "startDate=" + startDate + "&endDate=" + endDate + "&format=" + fileFormat + "&vehicleId=" + vehicleId).then(function (data) {
                    var file = data.json();
                    var blob = util.b64toBlob(file.content);
                    saveFileAs(blob, file.name);
                }).fail(function (error) {
                    util.messages.showErrorMessage(error.responseText);
                });
            }
        }
    },

    loadVehicle: function () {
        webix.ajax().get("hub/vehicle").then(function (data) {
            vehicles.length = 0;
            var vehiclesTemp = data.json();
            firstVehicle = vehiclesTemp[0].id;
            vehiclesTemp.forEach(function (obj) {
                vehicles.push({
                    id: obj.id,
                    value: obj.licensePlate + " - " + obj.manufacturerName + " " + obj.modelName,
                    item: obj
                });
            });

            $$("vehicleId").define({
                options: vehicles,
                value: firstVehicle
            });
            $$("vehicleId").refresh();
        }).fail(function (error) {
            util.messages.showErrorMessage("Neuspješno dobavljanje podataka o vozilima.");
        });
    }
};