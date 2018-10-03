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
                            badge: 5,
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
                        width: 400
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
                view: "form",
                id: "requestForm",
                width: 700,
                elementsConfig: {
                    labelWidth: 325,
                    bottomPadding: 18
                },
                elements: []
            }
        ]
    }
};

function showRequestDialog() {
    if (util.popupIsntAlreadyOpened("requestDialog")) {
        webix.ui(webix.copy(requestDialog)).show();
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