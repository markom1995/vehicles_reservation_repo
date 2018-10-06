var firstLocationsUsers = null;
var locationsUsers = [];
var userIdLocationAndDeactivate = null;

var usersView = {
    panel: {
        id: "usersPanel",
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
                        template: "<span class='fa fa-user'></span> Korisnici"
                    },
                    {},
                    {
                        view: "label",
                        id: "userLocation",
                        width: 700,
                        label: "Molimo Vas da odaberete svoju lokaciju.",
                        align: "right"
                    },
                    {
                        id: "changeLocationBtn",
                        view: "button",
                        type: "iconButton",
                        label: "Izmijenite svoju lokaciju",
                        click: "usersView.showChangeLocationDialogUsers(userData.id)",
                        icon: "pencil-square-o",
                        autowidth: true
                    }
                ]
            },
            {
                view: "datatable",
                css: "webixDatatable",
                multiselect: false,
                id: "usersTable",
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
                        id: "firstName",
                        fillspace: true,
                        sort: "string",
                        editable: false,
                        tooltip: false,
                        header: [
                            "Ime",
                            {
                                content: "textFilter"
                            }
                        ]
                    },
                    {
                        id: "lastName",
                        fillspace: true,
                        sort: "text",
                        editable: false,
                        header: [
                            "Prezime",
                            {
                                content: "textFilter"
                            }
                        ]
                    },
                    {
                        tooltip: false,
                        id: "email",
                        fillspace: true,
                        editable: false,
                        sort: "text",
                        header: [
                            "Email adresa",
                            {
                                content: "textFilter"
                            }
                        ]
                    },
                    {
                        tooltip: false,
                        id: "username",
                        fillspace: true,
                        editable: false,
                        sort: "text",
                        header: [
                            "Korisničko ime",
                            {
                                content: "textFilter"
                            }
                        ]
                    },
                    {
                        id: "location",
                        hidden: false,
                        fillspace: true,
                        sort: "string",
                        header: [
                            "Lokacija",
                            {
                                content: "textFilter"
                            }
                        ]
                    }
                ],
                select: "row",
                navigation: true,
                editable: false,
                tooltip: true,
                url: "hub/user/custom",
                on: {
                    onAfterContextMenu: function (item) {
                        this.select(item.row);
                    }
                }
            }
        ]
    },

    locationChoserUsersDialog: {
        view: "popup",
        id: "locationChoserUsersDialog",
        modal: true,
        position: "center",
        body: {
            id: "locationChoserUsersInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='webix_icon fa-map'></span> Odabir lokacije",
                            width: 400
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('locationChoserUsersDialog');"
                        }
                    ]
                },
                {
                    cols: [
                        {
                            view: "form",
                            id: "locationChoserUsersForm",
                            borderless: true,
                            width: 500,
                            elementsConfig: {
                                labelWidth: 100,
                                bottomPadding: 18
                            },
                            elements: [
                                {
                                    id: "locationUsers",
                                    name: "locationUsers",
                                    view: "select",
                                    value: firstLocationsUsers,
                                    label: "Lokacija:",
                                    options: locationsUsers
                                },
                                {
                                    margin: 5,
                                    cols: [
                                        {},
                                        {
                                            id: "chooseLocationUsers",
                                            view: "button",
                                            value: "Odaberite lokaciju",
                                            type: "form",
                                            click: "usersView.chooseLocation",
                                            hotkey: "enter",
                                            width: 170
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },

    selectPanel: function () {
        $$("main").removeView(rightPanel);
        rightPanel = "usersPanel";

        var panelCopy = webix.copy(this.panel);

        $$("main").addView(webix.copy(panelCopy));
        usersView.loadLocations();
        usersView.loadUserLocation(userData.locationId);
        webix.ui({
            view: "contextmenu",
            id: "usersContextMenu",
            width: 230,
            data: [
                {
                    id: "1",
                    value: "Izmijenite lokaciju",
                    icon: "pencil-square-o"
                },
                {
                    $template: "Separator"
                },
                {
                    id: "2",
                    value: "Deaktivirajte korisnika",
                    icon: "close"
                }
            ],
            master: $$("usersTable"),
            on: {
                onItemClick: function (id) {
                    var context = this.getContext();
                    switch (id) {
                        case "1":
                            usersView.showChangeLocationDialogUsers($$("usersTable").getItem(context.id.row).id);
                            break;
                        case "2":
                            usersView.deactivate($$("usersTable").getItem(context.id.row).id);
                            break;
                    }
                }
            }
        });
    },

    chooseLocation: function () {
        var locationId = $$("locationChoserUsersForm").getValues().locationUsers;

        webix.ajax().headers({
            "Content-type": "application/x-www-form-urlencoded"
        }).post("hub/user/updateLocation", "userId=" + userIdLocationAndDeactivate + "&locationId=" + locationId).then(function (data) {
            if (data.text() === "Success") {
                util.messages.showMessage("Uspješno promijenjena lokacija korisnika.")
            }
            else {
                util.messages.showErrorMessage("Neuspješno promijenjena lokacija korisnika.")
            }

            util.dismissDialog('locationChoserUsersDialog');
            console.log(userIdLocationAndDeactivate + " - " + userData.id);
            if(userIdLocationAndDeactivate == userData.id){
                userData.locationId = locationId;
                usersView.loadUserLocation(locationId);
            }
            else{
                $$("usersTable").clearAll()
                $$("usersTable").load("hub/user/custom");
            }
        }).fail(function (error) {
            util.messages.showErrorMessage(error.responseText);
        });
    },

    deactivate: function(userId) {
        webix.ajax().get("hub/user/deactivate/" + userId).then(function (data) {
            if (data.text() === "Success") {
                util.messages.showMessage("Uspješna deaktivacija korisnika.")
            }
            else {
                util.messages.showErrorMessage("Neuspješna deaktivacija korisnika.")
            }

            $$("usersTable").clearAll()
            $$("usersTable").load("hub/user/custom");
        }).fail(function (error) {
            util.messages.showErrorMessage(error.responseText);
        });
    },

    showChangeLocationDialogUsers: function (userId) {
        userIdLocationAndDeactivate = userId;
        if (util.popupIsntAlreadyOpened("locationChoserUsersDialog")) {
            webix.ui(webix.copy(usersView.locationChoserUsersDialog)).show();
        }
    },

    loadLocations: function () {
        webix.ajax().get("hub/location").then(function (data) {
            locationsUsers.length = 0;
            var locationsTemp = data.json();
            firstLocationsUsers = locationsTemp[0].id;
            locationsTemp.forEach(function (obj) {
                locationsUsers.push({
                    id: obj.id,
                    value: obj.name + " - " + obj.address
                });
            });
        }).fail(function (error) {
            util.messages.showErrorMessage(error.responseText);
        });
    },

    loadUserLocation : function (locationId) {
        if (userData.locationId != null) {
            webix.ajax().get("hub/location/" + locationId).then(function (data) {
                var location = data.json();
                $$("userLocation").config.label = location.name + " - " + location.address;
                $$("userLocation").refresh();
            }).fail(function (error) {
                util.messages.showErrorMessage(error.responseText);
            });
        }
        else{
            $$("userLocation").config.label = "Molimo Vas da odaberete svoju lokaciju.";
            $$("userLocation").refresh();
        }
    }
};
