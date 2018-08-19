var profileView = {
    changeProfileDialog: {
        id: "changeProfileDialog",
        view: "popup",
        modal: true,
        position: "center",
        body: {
            rows: [{
                view: "toolbar",
                padding: 8,
                cols: [
                    {
                        view: "label",
                        label: "<span class='fa fa-user'></span> Profil"
                    },
                    {},
                    {
                        view: "icon",
                        icon: "close",
                        align: "right",
                        click: "util.dismissDialog('changeProfileDialog');"

                    }
                ]
            },
                {
                    cols: [
                        {
                            view: "template",
                            borderless: true,
                            width: 30,
                            height: 30,
                            template: "<p></p>"
                        },
                        {
                            rows: [
                                {
                                    view: "label",
                                    borderless: true,
                                    height: 50,
                                    label: "Korisnička slika"
                                },
                                {
                                    view: "template",
                                    borderless: true,
                                    id: "photo",
                                    name: "photo",
                                    width: 200,
                                    height: 200,
                                    template: "<img src='#src#' class='photo-alignment'/>",
                                    onClick: {
                                        "photo-alignment": function (e, id, trg) {
                                            $$("uploadAPI").fileDialog();
                                            return false;
                                        }
                                    },
                                },
                                {}
                            ]
                        },
                        {
                            view: "template",
                            borderless: true,
                            width: 30,
                            template: "<p></p>"
                        },
                        {
                            view: "form",
                            borderless: true,
                            id: "profileForm",
                            elementsConfig: {
                                bottomPadding: 20
                            },
                            elements: [
                                {
                                    id: "username",
                                    name: "username",
                                    view: "text",
                                    label: "Korisničko ime:",
                                    width: 400,
                                    align: "left",
                                    readonly: true,
                                    labelAlign: 'left',
                                    labelWidth: 118
                                },
                                {
                                    view: "text",
                                    name: "base64ImageUser",
                                    hidden: true
                                },
                                {
                                    id: "firstname",
                                    name: "firstName",
                                    view: "text",
                                    label: "Ime:",
                                    width: 400,
                                    align: "left",
                                    readonly: false,
                                    required: true,
                                    invalidMessage: "Molimo Vas da unesete ime.",
                                    editaction: "dblclick",
                                    labelAlign: 'left',
                                    labelWidth: 118,
                                },
                                {
                                    id: "lastname",
                                    name: "lastName",
                                    view: "text",
                                    label: "Prezime:",
                                    width: 400,
                                    align: "left",
                                    readonly: false,
                                    required: true,
                                    invalidMessage: "Molimo Vas da unesete prezime.",
                                    editaction: "dblclick",
                                    labelAlign: 'left',
                                    labelWidth: 118,
                                },
                                {
                                    id: "email",
                                    name: "email",
                                    view: "text",
                                    label: "E-mail adresa:",
                                    width: 400,
                                    align: "left",
                                    readonly: true,
                                    labelAlign: 'left',
                                    labelWidth: 118
                                },
                                {
                                    cols: [
                                        {
                                            id: "saveProfile",
                                            view: "button",
                                            margin: 5,
                                            align: "right",
                                            value: "Sačuvajte izmjene",
                                            type: "form",
                                            click: "profileView.saveChanges",
                                            hotkey: "enter",
                                            width: 200
                                        }
                                    ]
                                }
                            ],
                            rules: {
                                "firstName": function (value) {
                                    if (!value) {
                                        return false;
                                    }
                                    if (value.length > 128) {
                                        $$('profileForm').elements.firstname.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                        return false;
                                    }
                                    return true;
                                },
                                "lastName": function (value) {
                                    if (!value) {
                                        return false;
                                    }
                                    if (value.length > 128) {
                                        $$('profileForm').elements.lastName.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                        return false;
                                    }
                                    return true;
                                },
                            }
                        }
                    ]
                }
            ]
        }
    },
    saveChanges: function () {
        if ($$("profileForm").validate()) {
            var helpUser = userData;
            helpUser.firstName = $$("profileForm").getValues().firstName;
            helpUser.lastName = $$("profileForm").getValues().lastName;
            helpUser.photo = $$("photo").getValues()['src'].split("base64,")[1];

            webix.ajax().header({"Content-type": "application/json"})
                .put("hub/user/" + helpUser.id, JSON.stringify(helpUser)).then(function (data) {
                if (data.text() === "Success") {
                    util.dismissDialog('changeProfileDialog');
                    util.messages.showMessage("Podaci su uspješno izmijenjeni.");
                    userData = helpUser;

                    if (userData.roleId === 1) {
                        $$("userInfo").setHTML("<p style='display: table-cell;line-height: 13px;height:75px;vertical-align: middle;font-size: 14px;}'>" + userData.firstName + " " + userData.lastName + "<br> super admin</p>");
                    } else if (userData.roleId === 2) {
                        $$("userInfo").setHTML("<p style='display: table-cell;line-height: 13px;vertical-align:text-top;font-size: 14px;}'>" + userData.firstName + " " + userData.lastName + "<br> administrator</p>");
                    } else if (userData.roleId === 3) {
                        $$("userInfo").setHTML("<p style='display: table-cell;line-height: 13px;vertical-align:text-top;font-size: 14px;}'>" + userData.firstName + " " + userData.lastName + "<br> napredni korisnik</p>");
                    } else {
                        $$("userInfo").setHTML("<p style='display: table-cell;line-height: 13px;vertical-align:text-top;font-size: 14px;}'>" + userData.firstName + " " + userData.lastName + "<br> korisnik</p>");
                    }
                }
            }).fail(function (error) {
                util.messages.showMessage(error.responseText);
            });
        }
    },
    changePasswordDialog: {
        id: "changePasswordDialog",
        view: "popup",
        modal: true,
        position: "center",
        body: {
            id: "changePasswordInside",
            rows: [
                {
                    view: "toolbar",
                    cols: [
                        {
                            view: "label",
                            label: "<span class='fa fa-key'></span> Izmjena lozinke",
                            width: 400
                        },
                        {},
                        {
                            hotkey: 'esc',
                            view: "icon",
                            icon: "close",
                            align: "right",
                            click: "util.dismissDialog('changePasswordDialog');"
                        }]
                }, {
                    id: "changePasswordForm",
                    view: "form",
                    width: 600,
                    elementsConfig: {
                        labelWidth: 200,
                        bottomPadding: 18
                    },
                    elements: [{
                        id: "oldPassword",
                        name: "oldPassword",
                        view: "text",
                        type: "password",
                        label: "Lozinka:",
                        required: true,
                        invalidMessage: "Molimo Vas da unesete staru lozinku.",
                    },
                        {
                            id: "newPassword",
                            name: "newPassword",
                            view: "text",
                            type: "password",
                            label: "Nova lozinka:",
                            required: true,
                            invalidMessage: "Molimo Vas da unesete novu lozinku.",
                        },
                        {
                            id: "repeatedNewPassword",
                            name: "repeatedNewPassword",
                            view: "text",
                            type: "password",
                            label: "Potvrdite novu lozinku: ",
                            required: true,
                            invalidMessage: "Molimo Vas da ponovite novu lozinku.",
                        },
                        {
                            margin: 5,
                            cols: [
                                {},
                                {
                                    id: "savePassword",
                                    view: "button",
                                    value: "Sačuvajte izmjene",
                                    type: "form",
                                    click: "profileView.save",
                                    hotkey: "enter",
                                    width: 150
                                }
                            ]
                        }
                    ],
                    rules: {
                        "oldPassword": function (value) {
                            if (!value) {
                                return false;
                            }

                            return true;
                        },
                        "newPassword": function (value) {
                            var regex1 = /[0-9]/;
                            var regex2 = /[a-z]/;
                            var regex3 = /[A-Z]/;
                            var regex4 = /[@#$%^&+=]/;

                            if (!value) {
                                return false;
                            }
                            if (value.length < 8) {
                                $$('changePasswordForm').elements.newPassword.config.invalidMessage = 'Lozinka mora da ima više od 8 karaktera.';
                                return false;
                            }
                            if (!regex1.test(value)) {
                                $$('changePasswordForm').elements.newPassword.config.invalidMessage = 'Lozinka mora da sadrži bar jedan broj.';
                                return false;
                            }
                            if (!regex2.test(value)) {
                                $$('changePasswordForm').elements.newPassword.config.invalidMessage = 'Lozinka mora da sadrži bar jedno malo slovo.';
                                return false;
                            }
                            if (!regex3.test(value)) {
                                $$('changePasswordForm').elements.newPassword.config.invalidMessage = 'Lozinka mora da sadrži bar jedno veliko slovo.';
                                return false;
                            }
                            if (!regex4.test(value)) {
                                $$('changePasswordForm').elements.newPassword.config.invalidMessage = 'Lozinka mora da sadrži specijalni karakter: (@ # $ % ^ & + =) !';
                                return false;
                            }

                            return true;
                        },
                        "repeatedNewPassword": function (value) {
                            if (!value) {
                                return false;
                            }
                            if (value != $$("changePasswordForm").getValues().newPassword) {
                                $$('changePasswordForm').elements.repeatedNewPassword.config.invalidMessage = 'Unešene lozinke nisu iste.';
                                return false;
                            }

                            return true;
                        },
                    }
                }
            ]
        }
    },
    hide: function () {
        $$("tmpUser").hide();
    },
    save: function () {
        var form = $$("changePasswordForm");
        if ($$("changePasswordForm").validate()) {
            webix.ajax().header({"Content-type": "application/json"})
                .post("hub/user/updatePassword", form.getValues()).then(function (data) {
                if (data.text() === "Success") {
                    util.dismissDialog('changePasswordDialog');
                    util.messages.showMessage("Lozinka je uspješno izmijenjena.");
                }
            }).fail(function (error) {
                util.messages.showMessage(error.responseText);
            });
        }
    }
};
webix.ui(
    {
        id: "uploadAPI",
        view: "uploader",
        accept: "image/jpeg, image/png",
        autosend: false,
        width: 200,
        apiOnly: true,
        align: "center",
        multiple: false,
        on: {
            onBeforeFileAdd: function (upload) {
                var file = upload.file;
                var reader = new FileReader();
                reader.onload = function (event) {
                    $$("photo").setValues({
                        src: event.target.result
                    });
                };
                reader.readAsDataURL(file);

                return false;
            }
        }
    }
)
