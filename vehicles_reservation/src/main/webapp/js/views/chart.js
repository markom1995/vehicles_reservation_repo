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
                        id: "datePickerFilter",
                        view: "daterangepicker",
                        name: "dateRangePicker",
                        label: "Od-Do:",
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
                                    $$("loggerTable").filterByAll();
                                    var startingDate = new Date(dates.start);
                                    var endingDate = new Date(dates.end.getFullYear(), dates.end.getMonth(), dates.end.getDate() + 1);

                                    $$("loggerTable").filter(function (obj) {
                                        var dateOfObj = new Date(obj.created);
                                        if (dateOfObj >= startingDate && dateOfObj <= endingDate) {
                                            return true;
                                        }

                                        return false;
                                    });

                                    $$("datePickerFilter").getPopup().hide();
                                }
                            }
                        }
                    },
                    {
                        id: "richSelectFilter",
                        view: "richselect",
                        label: "Prikaži:",
                        value: 1,
                        editable: false,
                        options: [
                            {
                                id: 1,
                                value: "Sve"
                            },
                            {
                                id: 2,
                                value: "Prošla 24h"
                            },
                            {
                                id: 3,
                                value: "Prošla sedmica"
                            }
                        ],
                        on: {
                            onChange: function (id) {
                                var customFilterForDate = function (days) {
                                    var today = new Date();
                                    var startDate;
                                    var tempDay = today.getDate() - days;
                                    if (tempDay > 0 && today.getMonth() > 1) {
                                        startDate = new Date(today.getFullYear(), today.getMonth(), tempDay);
                                    } else if (tempDay < 0 && today.getMonth() > 1) {
                                        startDate = new Date(today.getFullYear(), today.getMonth() - 1, tempDay);
                                    } else if (tempDay < 0 && today.getMonth() == 1) {
                                        startDate = new Date(today.getFullYear() - 1, 12, tempDay);
                                    }

                                    $$("loggerTable").filter(function (obj) {
                                        var dateOfObj = new Date(obj.created);
                                        if (dateOfObj >= startDate) {
                                            return true;
                                        }

                                        return false;
                                    })
                                }
                                switch (id) {
                                    case 1:
                                        $$("loggerTable").filterByAll();
                                        break;
                                    case 2:
                                        customFilterForDate(1);
                                        break;
                                    case 3:
                                        customFilterForDate(7);
                                        break;
                                }
                            }
                        }
                    }
                ]
            },
            {}
        ]
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "chartPanel";
        var panelCopy = webix.copy(this.panel);
        $$("main").addView(webix.copy(panelCopy));
    }
};