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
                        label: "Od-Do:",
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
                                                .post("hub/vehicleMaintenance/chart/week", "startDate=" + startDate + "&endDate=" + endDate).then(function (data) {;
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
                        left: 50,
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
            }
        ]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "chartPanel";
        var panelCopy = webix.copy(this.panel);
        $$("main").addView(webix.copy(panelCopy));
    }
};