var addCompanyUserCompanyId;

var userView = {
    addSuperAdminDialog: {
        view: "popup",
        id: "addSuperAdminDialog",
        modal: true,
        position: "center",
        body: {
            id: "addSuperAdminInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='webix_icon fa-briefcase'></span> Dodavanje novog administratora sistema",
                            width: 400
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('addSuperAdminDialog');"
                        }
                    ]
                },
                {
                    id: "addSuperAdminForm",
                    view: "form",
                    width: 600,
                    elementsConfig: {
                        labelWidth: 200,
                        bottomPadding: 18
                    },
                    elements: [
                        {
                            id: "email",
                            name: "email",
                            view: "text",
                            label: "E-mail adresa:",
                            required: true
                        },
                        {
                            margin: 5,
                            cols: [
                                {},
                                {
                                    id: "saveSuperAdmin",
                                    view: "button",
                                    value: "Dodajte novog administratora sistema",
                                    type: "form",
                                    click: "userView.saveSuperAdminF",
                                    hotkey: "enter",
                                    width: 350
                                }
                            ]
                        }
                    ],
                    rules: {
                        "email": function (value) {
                            if (!value) {
                                $$('addSuperAdminForm').elements.email.config.invalidMessage = 'Molimo Vas da unesete e-mail adresu novog korisnika.';
                                return false;
                            }
                            if (value.length > 128) {
                                $$('addSuperAdminForm').elements.email.config.invalidMessage = 'Maksimalan broj karaktera je 128';
                                return false;
                            }
                            if (!webix.rules.isEmail(value)) {
                                $$('addSuperAdminForm').elements.email.config.invalidMessage = 'E-mail adresa nije u validnom formatu.';
                                return false;
                            }
                            return true;
                        }
                    }
                }
            ]
        }
    },

    saveSuperAdminF: function () {
        var form = $$("addSuperAdminForm");
        if (form.validate()) {
            var newUser = {
                email: form.getValues().email,
                roleId: 1
            };

            webix.ajax().header({"Content-type": "application/json"})
                .post("hub/user", newUser).then(function (data) {
                util.messages.showErrorMessage("Uspješno dodavanje administratora sistema.");
            }).fail(function (error) {
                util.messages.showErrorMessage(error.responseText);
            });

            util.dismissDialog('addSuperAdminDialog');
        }
    },

    showAddSuperAdminDialog: function () {
        if (util.popupIsntAlreadyOpened("addSuperAdminDialog")) {
            webix.ui(webix.copy(userView.addSuperAdminDialog)).show();
            webix.UIManager.setFocus("email");
        }
    },

    addCompanyUserDialog: {
        view: "popup",
        id: "addCompanyUserDialog",
        modal: true,
        position: "center",
        body: {
            id: "addCompanyUserInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='webix_icon fa-briefcase'></span> Dodavanje novog korisnika",
                            width: 400
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('addCompanyUserDialog');"
                        }
                    ]
                },
                {
                    id: "addCompanyUserForm",
                    view: "form",
                    width: 600,
                    elementsConfig: {
                        labelWidth: 200,
                        bottomPadding: 18
                    },
                    elements: [
                        {
                            id: "email",
                            name: "email",
                            view: "text",
                            label: "E-mail adresa:",
                            required: true
                        },
                        {
                            id: "roleId",
                            name: "roleId",
                            view: "select",
                            value: 2,
                            label: "Vrsta:",
                            options: [
                                {
                                    value: "Administrator",
                                    id: 1
                                },
                                {
                                    value: "Korisnik",
                                    id: 2
                                }
                            ]
                        },
                        {
                            margin: 5,
                            cols: [
                                {},
                                {
                                    id: "saveCompanyUser",
                                    view: "button",
                                    value: "Dodajte novog korisnika",
                                    type: "form",
                                    click: "userView.saveCompanyUserF",
                                    hotkey: "enter",
                                    width: 200
                                }
                            ]
                        }
                    ],
                    rules: {
                        "email": function (value) {
                            if (!value) {
                                $$('addCompanyUserForm').elements.email.config.invalidMessage = 'Molimo Vas da unesete e-mail adresu novog korisnika.';
                                return false;
                            }
                            if (value.length > 128) {
                                $$('addCompanyUserForm').elements.email.config.invalidMessage = 'Maksimalan broj karaktera je 128';
                                return false;
                            }
                            if (!webix.rules.isEmail(value)) {
                                $$('addCompanyUserForm').elements.email.config.invalidMessage = 'E-mail adresa nije u validnom formatu.';
                                return false;
                            }
                            return true;
                        }
                    }
                }
            ]
        }
    },

    saveCompanyUserF: function () {
        var form = $$("addCompanyUserForm");
        if (form.validate()) {
            var newUser = {
                email: form.getValues().email,
                roleId: form.getValues().roleId,
                companyId: addCompanyUserCompanyId
            };

            webix.ajax().header({"Content-type": "application/json"})
                .post("hub/user", newUser).then(function (data) {
                util.messages.showErrorMessage("Uspješno dodavanje novog korisnika.");
            }).fail(function (error) {
                util.messages.showErrorMessage(error.responseText);
            });

            util.dismissDialog('addCompanyUserDialog');
        }
    },

    showAddCompanyUserDialog: function (company) {
        if (util.popupIsntAlreadyOpened("addCompanyUserDialog")) {
            addCompanyUserCompanyId = company.id;
            webix.ui(webix.copy(userView.addCompanyUserDialog)).show();
            webix.UIManager.setFocus("email");
        }
    },

    companyUsersDialog: {
        view: "popup",
        id: "companyUsersDialog",
        modal: true,
        position: "center",
        body: {
            id: "addCompanyInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='webix_icon fa-user'></span> Korisnici kompanije",
                            width: 400
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('companyUsersDialog');"
                        }
                    ]
                },
                {
                    id: "usersList",
                    view: "list",
                    width: 400,
                    height: 300,
                    dynamic: true,
                    template: "<div class='list-name'>#firstName# #lastName# - #roleName#</div> <span class='delete-user'><span class='webix fa fa-close'/></span>",
                    onClick: {
                        'delete-user': function (e, id) {
                            userView.deactivateCompanyUser(id, this);
                            return false;
                        }
                    },
                    select: false
                }
            ]
        }
    },

    deactivateCompanyUser: function (id, list) {
        var object = $$("usersList").getItem(id);

        webix.ajax().get("hub/user/deactivate/" + object.id).then(function (data) {
            if(data.text() === "Success"){
                util.messages.showMessage("Uspješna deaktivacija korisnika.")
            }
            else{
                util.messages.showErrorMessage("Neuspješna deaktivacija korisnika.")
            }
        }).fail(function (error) {
           util.messages.showErrorMessage(error.responseText);
        });

        list.remove(id);
        util.dismissDialog('companyUsersDialog');
    },

    showCompanyUsersDialog: function (id) {
        if (util.popupIsntAlreadyOpened("companyUsersDialog")) {
            var object = $$("companyTable").getItem(id.row);
            webix.ui(webix.copy(userView.companyUsersDialog)).show();
            $$("usersList").load("hub/user/companyUsers/" + object.id);
        }
    },
}