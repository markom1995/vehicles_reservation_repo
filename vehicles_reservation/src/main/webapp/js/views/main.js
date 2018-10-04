webix.protoUI({
    name: "activeList"
}, webix.ui.list, webix.ActiveContent);

var requests = [];
var firstLocationsRequest = null;
var locationsRequest = [];
var userId = null;
var listItemId = null;

var mainLayout = {
    id: "app",
    width: "auto",
    height: "auto",
    rows: [
        {
            cols: [
                {
                    view: "template",
                    width: 240,
                    css: "logoInside",
                    template: '<img id="appLogo" src="img/telegroup-logo.png"/>'
                },
                {
                    view: "toolbar",
                    css: "mainToolbar",
                    height: 50,
                    cols: [
                        {
                            id: "appNameLabel",
                            view: "label",
                            css: "appNameLabel",
                            label: "Vehicles Reservation System"
                        },
                        {},
                        {},
                        {
                            view: "button",
                            id: "requestBtn",
                            width: 43,
                            badge: 0,
                            type: "icon",
                            icon: "bell",
                            align: "right",
                            click: "showRequestDialog();",
                            hidden: true
                        },
                        {
                            id: "userInfo",
                            view: "label",
                            align: "right",
                            labelPosition: "top",
                            css: "custom_menu_alignment_style",
                            width: 115,
                            label: ""
                        },
                        {
                            view: "menu",
                            id: "userMenu",
                            align: "right",
                            width: 50,
                            css: "custom_menu_list_item",
                            data: [
                                {
                                    id: "1",
                                    value: "",
                                    icon: "cog",
                                    config: {width: 250},
                                    submenu: [
                                        {
                                            value: "Izmjena profila",
                                            icon: "user",
                                            autowidth: true
                                        },
                                        {
                                            value: "Izmjena lozinke",
                                            icon: "key",
                                            width: 400
                                        },
                                        {
                                            value: "Podešavanja notifikacija",
                                            icon: "bell",
                                            width: 400
                                        },
                                        {
                                            value: "Odjavite se",
                                            icon: "sign-out",
                                            width: 400
                                        }
                                    ]
                                }
                            ],
                            openAction: "click",
                            on: {
                                onMenuItemClick: function (id) {
                                    switch (this.getMenuItem(id).value) {
                                        case "Izmjena profila":
                                            clickProfile();
                                            break;
                                        case "Izmjena lozinke":
                                            clickPassword();
                                            break;
                                        case "Podešavanja notifikacija":
                                            clickNotificationSettings();
                                            break;
                                        case "Odjavite se":
                                            logout();
                                            break;
                                    }
                                }
                            },
                            type: {
                                subsign: true
                            }
                        }
                    ]
                }
            ]

        },
        {
            id: "main", cols: [{
                rows: [
                    {
                        id: "mainMenu",
                        css: "mainMenu",
                        view: "sidebar",
                        gravity: 0.01,
                        minWidth: 41,
                        collapsed: true
                    },
                    {
                        id: "sidebarBelow",
                        css: "sidebar-below",
                        view: "template",
                        template: "",
                        height: 50,
                        gravity: 0.01,
                        minWidth: 41,
                        width: 41,
                        type: "clean"
                    }
                ]
            },
                {id: "emptyRightPanel"}
            ]
        }
    ]
};

var requestDialog = {
    view: "popup",
    id: "requestDialog",
    modal: true,
    position: "center",
    body: {
        id: "requestInside",
        rows: [
            {
                view: "toolbar",
                cols: [
                    {
                        view: "label",
                        label: "<span class='webix_icon fa-bell'></span> Odobravanje zahtjeva",
                        width: 800
                    },
                    {},
                    {
                        hotkey: 'esc',
                        view: "icon",
                        icon: "close",
                        align: "right",
                        click: "util.dismissDialog('requestDialog');"
                    }
                ]
            },
            {
                view: "activeList",
                id: "requestList",
                width: 350,
                autoheight: true,
                select: true,
                data: requests,
                activeContent: {
                    acceptBtn: {
                        id: "acceptBtn",
                        view: "button",
                        label: "Potvrdi",
                        width: 80,
                        click: acceptRequest
                    },
                    rejectBtn: {
                        id: "rejectBtn",
                        view: "button",
                        label: "Odbij",
                        width: 80,
                        click: rejectRequest
                    }
                },
                template: "<div style='float:left; font-weight: bold; font-size: 18px'>#firstName# #lastName#</div><br>" +
                    "<div style='float:left;'>Email adresa: #email#</div><br>" +
                    "<div style='float:left;'>Korisničko ime: #username#</div>" +
                    "<div class='request_buttons'>{common.rejectBtn()}</div><div class='request_buttons'>{common.acceptBtn()}</div>",
                type: {
                    height: 120
                }
            }
        ]
    }
};

var locationChoserDialog = {
    view: "popup",
    id: "locationChoserDialog",
    modal: true,
    position: "center",
    body: {
        id: "locationChoserInside",
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
                        click: "util.dismissDialog('locationChoserDialog');"
                    }
                ]
            },
            {
                cols: [
                    {
                        view: "form",
                        id: "locationChoserForm",
                        borderless: true,
                        width: 500,
                        elementsConfig: {
                            labelWidth: 100,
                            bottomPadding: 18
                        },
                        elements: [
                            {
                                id: "location",
                                name: "location",
                                view: "select",
                                value: firstLocationsRequest,
                                label: "Lokacija:",
                                options: locationsRequest
                            },
                            {
                                margin: 5,
                                cols: [
                                    {},
                                    {
                                        id: "chooseLocation",
                                        view: "button",
                                        value: "Odaberite lokaciju",
                                        type: "form",
                                        click: "chooseLocation",
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
};

function chooseLocation(){
    var locationId = $$("locationChoserForm").getValues().location;

    webix.ajax().headers({
        "Content-type": "application/x-www-form-urlencoded"
    }).post("hub/user/acceptRequest", "userId=" + userId + "&locationId=" + locationId).then(function (data) {
        if (data.text() === "Success") {
            util.messages.showMessage("Uspješna aktivacija korisničkog naloga.")
        }
        else{
            util.messages.showErrorMessage("Neuspješna aktivacija korisničkog naloga.")
        }

        util.dismissDialog('locationChoserDialog');
        $$("requestList").remove(listItemId);
        startTimerForRequest();
        if($$("requestList").count() == 0){
            util.dismissDialog('requestDialog');
        }
    }).fail(function (error) {
        util.messages.showErrorMessage(error.responseText);
    });
}

function rejectRequest(id, e){
    listItemId = $$("requestList").locate(e);
    userId = $$("requestList").getItem(listItemId).id;

    webix.ajax().headers({
        "Content-type": "application/x-www-form-urlencoded"
    }).post("hub/user/rejectRequest", "userId=" + userId).then(function (data) {
        if (data.text() === "Success") {
            util.messages.showMessage("Uspješno odbijen zahtjev za aktivaciju korisničkog naloga.")
        }
        else{
            util.messages.showErrorMessage("Neuspješno odbijen zahtjev za aktivaciju korisničkog naloga.")
        }

        $$("requestList").remove(listItemId);
        startTimerForRequest();
        if($$("requestList").count() == 0){
            util.dismissDialog('requestDialog');
        }
    }).fail(function (error) {
        util.messages.showErrorMessage(error.responseText);
    });
};

function acceptRequest(id, e){
    listItemId = $$("requestList").locate(e);
    userId = $$("requestList").getItem(listItemId).id;

    if (util.popupIsntAlreadyOpened("locationChoserDialog")) {
        webix.ui(webix.copy(locationChoserDialog)).show();
    }
};

function loadLocations() {
    webix.ajax().get("hub/location").then(function (data) {
        locationsRequest.length = 0;
        var locationsTemp = data.json();
        firstLocationsRequest = locationsTemp[0].id;
        locationsTemp.forEach(function (obj) {
            locationsRequest.push({
                id: obj.id,
                value: obj.name + " - " + obj.address
            });
        });
    }).fail(function (error) {
        util.messages.showErrorMessage(error.responseText);
    });
};

function showRequestDialog() {
    loadLocations();
    if (util.popupIsntAlreadyOpened("requestDialog")) {
        webix.ui(webix.copy(requestDialog));
        $$("requestList").load("hub/user/allRequests").then(function (data) {
            if(data.json().length != 0){
                $$("requestDialog").show();
            }
        });
    }
};

function clickProfile() {
    webix.ui(webix.copy(profileView.changeProfileDialog));
    $$("profileForm").load("hub/user/" + userData.id).then(function () {
        $$("photo").setValues({
            src: "data:image/png;base64," + userData.photo
        });
        $$("changeProfileDialog").show();
    });
};

function clickPassword() {
    webix.ui(webix.copy(profileView.changePasswordDialog));

    setTimeout(function () {
        $$("changePasswordDialog").show();
    }, 0);
};

function clickNotificationSettings() {
    webix.ui(webix.copy(profileView.notificationSettingsDialog));

    setTimeout(function () {
        $$("notificationSettingsDialog").show();
        $$("mailNotification").define("value", userData.mailStatusId);
        $$("mailNotification").refresh();
    }, 0);
};

function logout() {
    webix.ajax().get("hub/user/logout", function (text, data, xhr) {
        if (xhr.status == "200") {
            userData = null;
            companyData = null;
            util.messages.showLogoutMessage();
            connection.reload();
        }
        else {
            util.messages.showLogoutErrorMessage();
        }
    });
};