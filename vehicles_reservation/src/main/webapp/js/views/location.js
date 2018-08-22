var countries = [];
var tableData = [];
var tableCenter = [];
var state;
var lat;
var lng;
var locationView = {
    panel: {
        id: "locationPanel",
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
                        template: "<span class='fa fa-map'></span> Lokacije vozila"
                    },
                    {},
                    {
                        id: "addLocationBtn",
                        view: "button",
                        type: "iconButton",
                        label: "Dodajte novu lokaciju",
                        click: "locationView.showAddDialog",
                        icon: "plus-circle",
                        autowidth: true
                    }
                ]
            },
            {
                view: "datatable",
                css: "webixDatatable",
                multiselect: false,
                id: "locationTable",
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
                        id: "name",
                        fillspace: true,
                        editor: "text",
                        sort: "string",
                        editable: true,
                        tooltip: false,
                        header: [
                            "Naziv",
                            {
                                content: "textFilter"
                            }
                        ]
                    },
                    {
                        id: "description",
                        fillspace: true,
                        editor: "text",
                        sort: "text",
                        editable: true,
                        header: [
                            "Opis",
                            {
                                content: "textFilter"
                            }
                        ]
                    },
                    {
                        tooltip: false,
                        id: "address",
                        fillspace: true,
                        editable: false,
                        sort: "text",
                        header: [
                            "Adresa",
                            {
                                content: "textFilter"
                            }
                        ]
                    },
                    {
                        id: "latitude",
                        hidden: true,
                        fillspace: true,
                        editor: "text",
                        sort: "string",
                        header: [
                            "latitude",
                            {
                                content: "textFilter"
                            }
                        ]
                    },
                    {
                        id: "longitude",
                        hidden: true,
                        fillspace: true,
                        editor: "text",
                        sort: "string",
                        header: [
                            "longitude",
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
                url: "hub/location/",
                on: {
                    onAfterContextMenu: function (item) {
                        this.select(item.row);
                    }
                }
            }
        ]
    },

    changeLocationDialog: {
        view: "popup",
        id: "changeLocationDialog",
        modal: true,
        position: "center",
        body: {
            id: "changeLocationInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='webix_icon fa-map'></span> Izmjena lokacija",
                            width: 400
                        },
                        {},
                        {
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('changeLocationDialog');"
                        }
                    ]
                },
                {
                    view: "form",
                    id: "changeLocationForm",
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
                            view: "text",
                            id: "name",
                            name: "name",
                            label: "Naziv:",
                            invalidMessage: "Molimo Vas da unesete naziv lokacije.",
                            required: true
                        },
                        {
                            view: "text",
                            id: "description",
                            name: "description",
                            label: "Opis:",
                            required: false
                        },
                        {
                            view: "fieldset",
                            label: "Podaci o adresi lokacije",
                            body: {
                                rows: [
                                    {
                                        view: "label",
                                        label: "Unesite lokaciju zgrade: ",
                                        inputWidth: 100,
                                    },
                                    {
                                        view: "select",
                                        options: countries,
                                        label: "Država:",
                                        id: "combo"
                                    },
                                    {
                                        view: "text",
                                        id: "city",
                                        name: "city",
                                        label: "Grad:",
                                        invalidMessage: "Molimo Vas da unesete naziv grada.",
                                        required: true
                                    },
                                    {
                                        view: "text",
                                        id: "address",
                                        name: "address",
                                        label: "Adresa:",
                                        invalidMessage: "Molimo Vas da unesete adresu.",
                                        required: true
                                    }
                                ]
                            }
                        },
                        {
                            margin: 5,
                            cols: [
                                {
                                    id: "showMap",
                                    view: "button",
                                    value: "Detaljna lokacija:",
                                    click: "locationView.showMap",
                                    width: 150
                                },
                                {},
                                {
                                    id: "saveLocation",
                                    view: "button",
                                    value: "Sačuvajte izmjene",
                                    type: "form",
                                    click: "locationView.saveChanges",
                                    hotkey: "enter",
                                    width: 150
                                }
                            ]
                        }
                    ],
                    rules: {
                        "name": function (value) {
                            if (value.length > 128) {
                                $$('changeLocationForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                return false;
                            }

                            return true;
                        },
                        "description": function (value) {
                            if (value.length > 500) {
                                $$('changeLocationForm').elements.description.config.invalidMessage = 'Maksimalan broj karaktera je 500.';
                                return false;
                            }

                            return true;
                        }
                    }
                }
            ]
        }
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "locationPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        this.preloadDependencies();
        connection.attachAjaxEvents("locationTable", "hub/location", false);
        webix.ui({
            view: "contextmenu",
            id: "locationContextMenu",
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
            master: $$("locationTable"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            locationView.showChangeLocationDialog($$("locationTable").getItem(context.id.row));
                            break;
                        case "2":
                            var delBox = (webix.copy(commonViews.brisanjePotvrda("lokacije", "lokaciju")));
                            var newItem = $$("locationTable").getItem(context.id.row);

                            delBox.callback = function (result) {
                                if (result == 1) {
                                    $$("locationTable").remove(context.id.row);
                                }
                            };
                            webix.confirm(delBox);
                            break;
                        case "3":
                            locationView.showMapDetailsDialog($$("locationTable").getItem(context.id.row));
                            break;
                    }
                }
            }
        });

        if(userData.roleId === 3){
            $$("addLocationBtn").define("hidden", true);
            $$("addLocationBtn").refresh();

            $$("locationTable").define("editable", false);
            $$("locationTable").refresh();

            var userContextMenu = [
                {
                    id: "3",
                    value: "Prikažite lokaciju na mapi",
                    icon: "map-marker"
                },
            ];

            $$("locationContextMenu").clearAll();
            $$("locationContextMenu").define("data", userContextMenu);
            $$("locationContextMenu").refresh();
        }
    },

    showMapDetailsDialog: function (location) {
        tableCenter[0] = location.latitude;
        tableCenter[1] = location.longitude;

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

    showChangeLocationDialog: function (location) {
        if (util.popupIsntAlreadyOpened("changeNoteDialog")) {
            var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + location.latitude + "," + location.longitude + "&language=hr";
            fetch(url).then(function (result) {
                if (result.ok) {
                    return result.json();
                }
                throw new Error('Neuspješno dobavljanje tačne lokacije.');
            }).then(function (json) {
                var place = json['results'][0];

                var filtered_array = place.address_components.filter(function (address_component) {
                    return address_component.types.includes("country");
                });

                var country_long = filtered_array.length ? filtered_array[0].long_name : "";
                var country_short = filtered_array.length ? filtered_array[0].short_name : "";
                var filtered_array2 = place.address_components.filter(function (address_component) {
                    return address_component.types.includes("locality");
                });

                var city = filtered_array2.length ? filtered_array2[0].long_name : "";
                if (city == null) {
                    city = "" , console.log("grad prazan")
                }
                form.elements.city.setValue(city);
                if (country_short == "") {
                    country_short = "", console.log("grad prazan2")
                }
                ;
                if (country_long == "") {
                    country_long = "", console.log("grad prazan3")
                }
                ;
                console.log(country_long + " : " + country_short);
                state = country_long.trim() + " : " + country_short.trim();
                $$("combo").setValue(state);
            }).catch(function (error) {
                util.messages.showErrorMessage("Neuspješno dobavljanje grada.")
            });

            webix.ui(webix.copy(locationView.changeLocationDialog));
            var form = $$("changeLocationForm");

            form.elements.id.setValue(location.id);
            form.elements.name.setValue(location.name);
            form.elements.description.setValue(location.description);
            form.elements.address.setValue(location.address);

            $$("changeLocationDialog").show();
            webix.UIManager.setFocus("name");
        }
    },

    addDialog: {
        view: "popup",
        id: "addLocationDialog",
        modal: true,
        position: "center",
        body: {
            id: "addLocationInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='webix_icon fa fa-map'></span> Dodavanje lokacije",
                            width: 400
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('addLocationDialog');"
                        }
                    ]
                },
                {
                    view: "form",
                    id: "addLocationForm",
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
                            invalidMessage: "Molimo Vas da unesete naziv lokacije.",
                            required: true
                        },
                        {
                            view: "text",
                            id: "description",
                            name: "description",
                            label: "Opis:",
                            required: false
                        },
                        {
                            view: "fieldset",
                            label: "Podaci o adresi lokacije",
                            body: {
                                rows: [
                                    {
                                        view: "select",
                                        options: countries,
                                        label: "Država:",
                                        id: "combo"
                                    },
                                    {
                                        view: "text",
                                        id: "city",
                                        name: "city",
                                        label: "Grad:",
                                        invalidMessage: "Molimo Vas da unesete naziv grada.",
                                        required: true
                                    },
                                    {
                                        view: "text",
                                        id: "address",
                                        name: "address",
                                        label: "Adresa:",
                                        invalidMessage: "Molimo vas da unesete adresu.",
                                        required: true
                                    }
                                ]
                            }
                        },
                        {
                            margin: 5,
                            cols: [
                                {
                                    id: "showMap",
                                    view: "button",
                                    value: "Detaljna lokacija",
                                    click: "locationView.showMap",
                                    width: 150
                                },
                                {},
                                {
                                    id: "saveLocation",
                                    view: "button",
                                    value: "Dodajte lokaciju za smještanje vozila",
                                    type: "form",
                                    click: "locationView.save",
                                    hotkey: "enter",
                                    width: 300
                                }
                            ]
                        }
                    ],
                    rules: {
                        "name": function (value) {
                            if (value.length > 128) {
                                $$('addLocationForm').elements.name.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                return false;
                            }

                            return true;
                        },
                        "description": function (value) {
                            if (value.length > 500) {
                                $$('addLocationForm').elements.description.config.invalidMessage = 'Maksimalan broj karaktera je 500.';
                                return false;
                            }

                            return true;
                        }
                    }
                }
            ]
        }
    },

    showMapDialog: {
        view: "popup",
        id: "showMapDialog",
        modal: true,
        position: "center",
        body: {
            id: "showMapDialogInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            id: "mapLabel",
                            view: "label",
                            label: "<span class='webix_icon fa fa-map-marker '></span> Odaberite lokaciju",
                            width: 600,
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('showMapDialog');"
                        }
                    ]
                },
                {
                    key: "",
                    view: "google-map",
                    id: "map",
                    zoom: 15,
                    width: 600,
                    height: 500,
                    center: tableCenter,
                    data: tableData
                },
                {
                    margin: 5,
                    cols: [
                        {},
                        {
                            id: "saveMap",
                            view: "button",
                            value: "Sačuvajte detaljnu lokaciju",
                            click: "locationView.saveLocation",
                            hotkey: "enter",
                            width: 200
                        }
                    ]
                }
            ]
        }
    },

    saveLocation: function () {
        var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "+&language=hr";
        fetch(url).then(function (result) {
            if (result.ok) {
                return result.json();
            }
            throw new Error('Neuspješno dobavljanje tačne lokacije.');
        }).then(function (json) {
            var place = json['results'][0];
            var filtered_array = place.address_components.filter(function (address_component) {
                return address_component.types.includes("country");
            });
            var country_long = filtered_array.length ? filtered_array[0].long_name : "";
            var country_short = filtered_array.length ? filtered_array[0].short_name : "";
            var filtered_array2 = place.address_components.filter(function (address_component) {
                return address_component.types.includes("locality");
            });
            var city = filtered_array2.length ? filtered_array2[0].long_name : "";
            var filtered_array3 = place.address_components.filter(function (address_component) {
                return address_component.types.includes("route");
            });
            var address = filtered_array3.length ? filtered_array3[0].long_name : "";
            var filtered_array4 = place.address_components.filter(function (address_component) {
                return address_component.types.includes("street_number");
            });

            var broj = filtered_array4.length ? filtered_array4[0].long_name : "";
            var broj2 = filtered_array4.length ? filtered_array4[0].short_name : "";
            if (broj != null) {
                $$("address").setValue(address + " " + broj);

            } else if (broj2 != null) {
                $$("address").setValue(address + " " + broj2);

            } else {
                $$("address").setValue(address);

            }
            $$("combo").setValue(country_long.trim() + " : " + country_short.trim());
            $$("city").setValue(city);

            util.dismissDialog('showMapDialog');

        }).catch(function (error) {
            util.messages.showErrorMessage("Neuspješno dobavljanje detaljne lokacije.")
        });
    },

    showAddDialog: function () {
        if (util.popupIsntAlreadyOpened("addCompanyDialog")) {
            webix.ui(webix.copy(locationView.addDialog)).show();
            webix.UIManager.setFocus("name");
            $$("combo").setValue("Bosna i Hercegovina : BA");
        }
    },

    showMap: function () {
        var address = $$("address").getValue();
        var res = address.replace(/ /g, "+");
        var country = $$("combo").getValue().split(" : ")[0];
        country = country.replace(/ /g, "+");
        var city = $$("city").getValue();
        city = city.replace(/ /g, "+");
        var query = res + "+" + city + "+" + country;
        var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&language=hr";
        fetch(url).then(function (result) {
            if (result.ok) {
                return result.json();
            }
            throw new Error('Neuspješno dobavljanje tačne lokacije.');
        }).then(function (json) {
            tableCenter[0] = json['results'][0]['geometry']['location']['lat'];
            tableCenter[1] = json['results'][0]['geometry']['location']['lng'];
            var mapObject = {
                id: 1,
                draggable: true,
                lat: json['results'][0]['geometry']['location']['lat'],
                lng: json['results'][0]['geometry']['location']['lng'],
                label: "A",
                draggable: true
            };
            lat = json['results'][0]['geometry']['location']['lat'];
            lng = json['results'][0]['geometry']['location']['lng'];
            tableData[0] = mapObject;
            webix.ui(webix.copy(locationView.showMapDialog)).show();
            $$("map").attachEvent("onAfterDrop", function (id, item) {
                lat = item.lat;
                lng = item.lng;
                var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "+&language=hr";
                fetch(url).then(function (result) {
                    if (result.ok) {
                        return result.json();
                    }
                    throw new Error('Neuspješno dobavljanje tačne lokacije.');
                }).then(function (json) {
                    var place = json['results'][0];

                    var filtered_array3 = place.address_components.filter(function (address_component) {
                        return address_component.types.includes("route");
                    });
                    var address = filtered_array3.length ? filtered_array3[0].long_name : "";
                    var filtered_array4 = place.address_components.filter(function (address_component) {
                        return address_component.types.includes("street_number");
                    });

                    var broj = filtered_array4.length ? filtered_array4[0].long_name : "";
                    var broj2 = filtered_array4.length ? filtered_array4[0].short_name : "";
                    var infowindow;
                    var marker = $$("map").getItem(id).$marker;
                    if (marker.infowindow != null) marker.infowindow.close();
                    if (broj != null) {
                        marker.infowindow = new google.maps.InfoWindow({
                            content: address + " " + broj
                        });
                    } else if (broj2 != null) {
                        marker.infowindow = new google.maps.InfoWindow({
                            content: address + " " + broj2
                        });
                    } else {
                        marker.infowindow = new google.maps.InfoWindow({
                            content: address
                        });
                    }
                    marker.infowindow.open($$("map").getMap(), marker);
                });
            });
        }).catch(function (error) {
            util.messages.showErrorMessage("Nije moguće prikazati mapu.")
        });

    },
    saveChanges: function () {
        var form = $$("changeLocationForm");
        if (form.validate()) {
            var address = $$("address").getValue();
            var res = address.replace(/ /g, "+");
            var country = $$("combo").getValue().split(" : ")[0];
            country = country.replace(/ /g, "+");
            var city = $$("city").getValue();
            city = city.replace(/ /g, "+");
            var query = res + "+" + city + "+" + country;
            var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&language=hr";
            fetch(url).then(function (result) {
                if (result.ok) {
                    return result.json();
                }
                throw new Error('Neuspješno dobavljanje tačne lokacije.');
            }).then(function (json) {
                var validate = json['results'][0]['geometry']['location_type'];
                if (validate == 'APPROXIMATE') {
                    util.messages.showErrorMessage("Neispravna adresa!")
                } else {
                    lat = json['results'][0]['geometry']['location']['lat'];
                    lng = json['results'][0]['geometry']['location']['lng'];
                    var newItem = {
                        id: $$("changeLocationForm").getValues().id,
                        name: $$("changeLocationForm").getValues().name,
                        description: $$("changeLocationForm").getValues().description,
                        address: $$("changeLocationForm").getValues().address,
                        latitude: lat,
                        longitude: lng,
                        companyId: companyData.id,
                        deleted: 0
                    };

                    webix.ajax().header({"Content-type": "application/json"})
                        .put("hub/location/" + newItem.id, newItem).then(function (data) {
                        if (data.text() === "Success") {
                            util.messages.showMessage("Lokacija uspješno izmijenjena.");
                            $$("locationTable").updateItem(newItem.id, newItem);
                        }
                        else {
                            util.messages.showMessage("Lokacija neuspješno izmijenjena.");
                        }
                    }).fail(function (error) {
                        util.messages.showErrorMessage(error.responseText);
                    });

                    util.dismissDialog('changeLocationDialog');
                }
            });
        }
    },

    save: function () {
        var form = $$("addLocationForm");
        if (form.validate()) {
            var address = $$("address").getValue();
            var res = address.replace(/ /g, "+");
            var country = $$("combo").getValue().split(" : ")[0];
            country = country.replace(/ /g, "+");
            var city = $$("city").getValue();
            city = city.replace(/ /g, "+");
            var query = res + "+" + city + "+" + country;
            var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + query + "&language=hr";
            fetch(url).then(function (result) {
                if (result.ok) {
                    return result.json();
                }
                throw new Error('Neuspješno dobavljanje tačne lokacije.');
            }).then(function (json) {
                var validate = json['results'][0]['geometry']['location_type'];
                if (validate == 'APPROXIMATE') {
                    util.messages.showErrorMessage("Neispravna adresa.")
                } else {
                    lat = json['results'][0]['geometry']['location']['lat'];
                    lng = json['results'][0]['geometry']['location']['lng'];
                    var newItem = {
                        name: $$("addLocationForm").getValues().name,
                        description: $$("addLocationForm").getValues().description,
                        address: $$("addLocationForm").getValues().address,
                        latitude: lat,
                        longitude: lng,
                        companyId: companyData.id,
                        deleted: 0
                    };
                    $$("locationTable").add(newItem);
                    util.messages.showMessage("Uspješno dodavanje nove lokacije.");
                    util.dismissDialog('addLocationDialog');
                }
            }).catch(function (error) {
                util.messages.showErrorMessage("Neuspješno dobavljanje tačne lokacije.")
            });
        }
    },

    preloadDependencies: function () {
        var url = "https://restcountries.eu/rest/v2/all";
        fetch(url).then(function (result) {
            if (result.ok) {
                return result.json();
            }
            throw new Error('Neuspješno učitavanje podataka o državama.');
        }).then(function (json) {
            for (var i = 0; i < json.length; i++) {
                var countryName = json[i]['translations']['hr'];
                var countryCode = json[i].alpha2Code;
                countries[i] = countryName + " : " + countryCode;
            }
        }).catch(function (error) {
            util.messages.showErrorMessage("Nije moguće prikupiti podatke o državama.")
        });
    }
};
