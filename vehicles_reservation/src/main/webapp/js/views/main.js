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
                            id: "userInfo",
                            view: "label",
                            align: "right",
                            labelPosition: "top",
                            css: "custom_menu_alignment_style",
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
                                    config: {width: 200},
                                    submenu: [
                                        {
                                            value: "Izmjena profila",
                                            icon: "user",
                                            autowidth: true
                                        },
                                        {
                                            value: "Izmjena lozinke",
                                            icon: "key", width: 400
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

function clickProfile(){
    webix.ui(webix.copy(profileView.changeProfileDialog));
    $$("profileForm").load("hub/user/"+userData.id).then(function () {
        $$("photo").setValues({
            src:"data:image/png;base64,"+userData.photo
        });
        $$("changeProfileDialog").show();
    });
};

function clickPassword(){
    webix.ui(webix.copy(profileView.changePasswordDialog));

    setTimeout(function () {
        $$("changePasswordDialog").show();
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
        else{
            util.messages.showLogoutErrorMessage();
        }
    });
};