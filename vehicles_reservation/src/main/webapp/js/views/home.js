var homeView = {
    panel: {
        id: "homePanel",
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
                        template: "<span class='fa fa-home'></span> Početna strana"
                    },
                    {}
                ]
            },
            {
                key: "",
                view: "google-map",
                id: "map",
                zoom: 12,
                center: [44.7786928, 17.1361266]
            }
        ]
    },

    homeVehicleDialog: {
        view: "popup",
        id: "homeVehicleDialog",
        modal: true,
        position: "center",
        width: 1008,
        height: 586,
        body: {
            id: "homeVehicleInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            id: "homeDialogLabel",
                            view: "label",
                            label: "<span class='webix_icon fa fa-car'></span> Lokacija",
                            width: 900
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('homeVehicleDialog');"
                        }
                    ]
                },
                {
                    cols: [
                        {
                            view: "dataview",
                            id: "homeDataView",
                            container: "dataA",
                            select: true,
                            url: "",
                            type: {
                                height: 520,
                                width: 330
                            },
                            template: "<div><div style='height: 13px'></div><div align='center'><img src='data:image/png;base64, #photo#' alt='Nema slike' width='300' height='300' align='center'/></div><br/>" +
                                "<div style='height: 1px' align='center'>Proizvođač: #manufacturerName#</div><br/>" +
                                "<div style='height: 1px' align='center'>Model: #modelName#</div><br/>" +
                                "<div style='height: 1px' align='center'>Registarske tablice: #licensePlate#</div><br/>" +
                                "<div style='height: 1px' align='center'>Godina proizvodnje: #year#</div><br/>" +
                                "<div style='height: 1px' align='center'>Motor: #engine#</div><br/>" +
                                "<div style='height: 1px' align='center'>Gorivo: #fuel#</div><br/>" +
                                "</div>"
                        }
                    ]
                }
            ]
        }
    },

    showHomeVehicleDialog: function(selectedItem){
        if (util.popupIsntAlreadyOpened("homeVehicleDialog")) {
            webix.ui(webix.copy(homeView.homeVehicleDialog)).show();

            $$("homeDialogLabel").define("label", "<span class='webix_icon fa fa-car'></span> " + selectedItem.name);
            $$("homeDataView").clearAll();
            $$("homeDataView").load("hub/vehicle/custom/" + selectedItem.id).then(function () {
                $$("homeDialogLabel").refresh();
                $$("homeDataView").refresh();

                $$("homeVehicleDialog").show();
            });
        }
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "homePanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));

        $$("map").getMap("waitMap").then(function(mapObj){
            var geocoder = new google.maps.Geocoder();

            webix.ajax().get("hub/location").then(function (data) {
                var locations = data.json();
                locations.forEach(function (obj) {
                    var latlng = {
                        lat: parseFloat(obj.latitude),
                        lng: parseFloat(obj.longitude)
                    };

                    geocoder.geocode({'location': latlng}, function(results, status) {
                        if (status === 'OK') {
                            if (results[0]) {
                                var marker = new google.maps.Marker({
                                    position: latlng,
                                    map: mapObj,
                                    item: obj
                                });
                                marker.addListener('click', function() {
                                    homeView.showHomeVehicleDialog(obj);
                                });
                            } else {
                                window.alert("Lokacija " + obj.name + " ne može biti locirana.");
                            }
                        } else {
                            window.alert("Lokacija " + obj.name + " ne može biti locirana.");
                        }
                    });
                })
            }).fail(function (error) {
                util.messages.showErrorMessage(error.responseText);
            });
        });
    }
};