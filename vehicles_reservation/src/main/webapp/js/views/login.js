var loginLayout = {
    id: "login",
    width: "auto",
    height: "auto",
    rows: [

        {
            cols: [
                {},
                {
                    height: 50,
                    view: "label",
                    label: "Vehicles Reservation System",
                    css: "company-name-size",
                    align: "center"
                },
                {}
            ]
        },
        {
            cols: [
                {},
                {
                    rows: [
                        {
                            height: 115
                        },
                        {
                            id: "loginForm",
                            view: "form",
                            width: 400,
                            borderless: true,
                            elementsConfig: {
                                labelWidth: 150,
                                bottomPadding: 20
                            },
                            elements: [
                                {
                                    id: "username",
                                    name: "username",
                                    view: "text",
                                    label: "Korisničko ime:",
                                    invalidMessage: "Molimo Vas da unesete korisničko ime.",
                                    required: true
                                },
                                {
                                    id: "password",
                                    name: "password",
                                    view: "text",
                                    type: "password",
                                    label: "Lozinka:",
                                    invalidMessage: "Molimo Vas da unesete lozinku.",
                                    required: true
                                },
                                {
                                    id: "companyName",
                                    name: "companyName",
                                    view: "text",
                                    label: "Ime kompanije:"
                                },
                                {
                                    margin: 10,
                                    cols: [
                                        {
                                            id: "registerBtn",
                                            view: "button",
                                            value: "Registrujte se",
                                            type: "form",
                                            width: 150,
                                            click: "tokenCheck"
                                        },
                                        {},
                                        {
                                            id: "loginBtn",
                                            view: "button",
                                            value: "Prijava na sistem",
                                            type: "form",
                                            align: "right",
                                            hotkey: "enter",
                                            width: 150,
                                            click: "login"
                                        },
                                    ]
                                },
                                {
                                    margin: 5,
                                    cols: [
                                        {},
                                        {
                                            width: 150,
                                            align: "right",
                                            view: "label",
                                            label: "<a href='javascript:showForgottenPasswordPopup();'>Zaboravili ste lozinku?</a>"
                                        }

                                    ]
                                }
                            ]
                        },
                        {}
                    ]
                },
                {
                    borderless: true,
                    view: "template",
                    width: 500,
                    template: "<img src='img/logo.png'/>"
                },
                {}
            ]
        }
    ]
};

var tokenLayout = {
    id: "tokenVerify",
    width: "auto",
    height: "auto",
    rows: [
        {
            cols: [
                {
                    height: 50,
                    view: "label",
                    label: "Vehicles Reservation System",
                    css: "company-name-size",
                    align: "center"
                }
            ]
        },
        {
            cols: [
                {},
                {
                    view: "form",
                    id: "tokenForm",
                    width: 400,
                    elementsConfig: {
                        labelWidth: 150,
                        bottomPadding: 20
                    },
                    elements: [
                        {
                            id: "token",
                            name: "token",
                            view: "text",
                            label: "Token",
                            invalidMessage: "Molimo Vas da unesete token.",
                            required: true
                        },
                        {
                            margin: 5,
                            cols: [
                                {},
                                {
                                    id: "tokenVerifyBtn",
                                    view: "button",
                                    type: "form",
                                    value: "Provjera validnosti tokena",
                                    click: "tokenConfirm",
                                    hotkey: "enter",
                                    align: "center",
                                    autowidth: true
                                },
                                {}
                            ]
                        }
                    ]
                },
                {}
            ]
        }
    ]
};

var registrationLayout = {
    id: "registration",
    width: "auto",
    height: "auto",
    rows: [
        {
            cols: [
                {
                    height: 50,
                    view: "label",
                    label: "Vehicles Reservation System",
                    css: "company-name-size",
                    align: "center"
                }
            ]
        },
        {
            cols: [
                {},
                {
                    view: "form",
                    id: "registrationForm",
                    width: 400,
                    elementsConfig: {
                        labelWidth: 150,
                        bottomPadding: 20
                    },
                    elements: [
                        {
                            id: "username",
                            name: "username",
                            view: "text",
                            label: "Korisničko ime:",
                            invalidMessage: "Molimo Vas da unesete korisničko ime.",
                            required: true
                        },
                        {
                            id: "password",
                            name: "password",
                            view: "text",
                            type: "password",
                            label: "Lozinka:",
                            invalidMessage: "Molimo Vas da unesete lozinku.",
                            required: true
                        },
                        {
                            id: "firstName",
                            name: "firstName",
                            view: "text",
                            label: "Ime:",
                            invalidMessage: "Molimo Vas da unesete ime.",
                            required: true
                        },
                        {
                            id: "lastName",
                            name: "lastName",
                            view: "text",
                            label: "Prezime:",
                            invalidMessage: "Molimo Vas da unesete prezime.",
                            required: true
                        },
                        {
                            view: "uploader",
                            value: "Fotografija",
                            accept: "image/jpeg, image/png",
                            autosend: false,
                            width: 200,
                            align: "center",
                            multiple: false,
                            on: {
                                onBeforeFileAdd: function (upload) {
                                    var file = upload.file;
                                    var reader = new FileReader();
                                    reader.onload = function (event) {
                                        $$("tmpWin").show();
                                        $$("tmp").setValues({src: event.target.result});
                                        var form = $$("registrationForm");
                                        form.elements.base64ImageUser.setValue(event.target.result.split("base64,")[1]);

                                    };
                                    reader.readAsDataURL(file)
                                    return false;
                                }
                            }
                        },
                        {
                            margin: 5,
                            id: "newUser",
                            view: "button",
                            align: "center",
                            value: "Registracija na sistem",
                            type: "form",
                            click: "saveUser",
                            hotkey: "enter",
                            width: 200,
                        }
                    ],
                    rules: {
                        "username": function (value) {
                            if (!value) {
                                return false;
                            }
                            if (value.length > 128) {
                                $$('registrationForm').elements.username.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                return false;
                            }
                            return true;
                        },
                        "password": function (value) {
                            var regex1 = /[0-9]/;
                            var regex2 = /[a-z]/;
                            var regex3 = /[A-Z]/;
                            var regex4 = /[@#$%^&+=]/;

                            if (!value) {
                                return false;
                            }
                            if (value.length < 8) {
                                $$('registrationForm').elements.password.config.invalidMessage = 'Lozinka mora da ima više od 8 karaktera.';
                                return false;
                            }
                            if (!regex1.test(value)) {
                                $$('registrationForm').elements.password.config.invalidMessage = 'Lozinka mora da sadrži bar jedan broj.';
                                return false;
                            }
                            if (!regex2.test(value)) {
                                $$('registrationForm').elements.password.config.invalidMessage = 'Lozinka mora da sadrži bar jedno malo slovo.';
                                return false;
                            }
                            if (!regex3.test(value)) {
                                $$('registrationForm').elements.password.config.invalidMessage = 'Lozinka mora da sadrži bar jedno veliko slovo.';
                                return false;
                            }
                            if (!regex4.test(value)) {
                                $$('registrationForm').elements.password.config.invalidMessage = 'Lozinka mora da sadrži specijalni karakter: (@ # $ % ^ & + =) !';
                                return false;
                            }

                            return true;
                        },
                        "firstname": function (value) {
                            if (!value) {
                                return false;
                            }
                            if (value.length > 128) {
                                $$('registrationForm').elements.firstname.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                return false;
                            }
                            return true;
                        },
                        "lastname": function (value) {
                            if (!value) {
                                return false;
                            }
                            if (value.length > 128) {
                                $$('registrationForm').elements.lastname.config.invalidMessage = 'Maksimalan broj karaktera je 128.';
                                return false;
                            }
                            return true;
                        }
                    }
                },
                {}
            ]
        }
    ]
};

function saveUser() {
    if ($$("registrationForm").validate()) {
        userForRegistration.firstName = $$("registrationForm").getValues().firstName;
        userForRegistration.lastName = $$("registrationForm").getValues().lastName;
        userForRegistration.username = $$("registrationForm").getValues().username;
        userForRegistration.password = $$("registrationForm").getValues().password;
        userForRegistration.photo = $$("registrationForm").getValues().base64ImageUser;

        webix.ajax().header({"Content-type": "application/json"})
            .post("hub/user/registration", JSON.stringify(userForRegistration)).then(function (data) {
            if (data.text() === "Success") {
                util.messages.showMessage("Uspješna registracija.");
                userForRegistration = null;
                userData = null;
                companyData = null;
                connection.reload();
            }
        }).fail(function (error) {
            util.messages.showMessage(error.responseText);
        });
    }
}

function tokenCheck() {
    var register = webix.copy(tokenLayout);
    webix.ui(register, panel);
    panel = $$("tokenVerify");
};

function login() {
    var form = $$("loginForm");
    if (form.validate()) {
        webix.ajax().header({"Content-type": "application/json"})
            .post("hub/user/login", form.getValues()).then(function (data) {
            var user = data.json();
            if (user != null) {
                if (user.roleId === 1) {
                    userData = user;
                    companyData = null;
                    showApp();
                    $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>" + userData.firstName + " " + userData.lastName + "<br>Administrator sistema</p>");
                } else {
                    webix.ajax().get("hub/company/" + user.companyId).then(function (data) {
                        var company = data.json();
                        if (company != null) {
                            userData = user;
                            companyData = company;
                            companyData.deleted = 0;
                            showApp();
                            if (userData.roleId === 2) {
                                $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>" + userData.firstName + " " + userData.lastName + "<br>Administrator</p>");
                            }
                            else {
                                $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>" + userData.firstName + " " + userData.lastName + "<br>Korisnik</p>");
                            }
                        } else {
                            util.messages.showErrorMessage("Neuspješno prijavljivanje");
                        }
                    }).fail(function (error) {
                        util.messages.showErrorMessage("Neuspješno prijavljivanje.")
                    });
                }
            } else {
                util.messages.showErrorMessage("Neuspješno prijavljivanje");
            }
        }).fail(function (error) {
            util.messages.showErrorMessage("Neuspješno prijavljivanje.")
        });
    }
};

function tokenConfirm() {
    var token = ($$("tokenForm")).getValues().token;
    webix.ajax().get("hub/user/registration/" + token).then(function (data) {
        userForRegistration = data.json();

        if (userForRegistration == null) {
            util.messages.showErrorMessage("Neispravan ili istekao token.")
        } else {
            webix.ajax().get("company/" + userForRegistration.companyId).then(function (data) {
                var company = data.json();
                if (company != null) {
                    companyData = company;
                    companyData.deleted = 0;
                    showApp();
                } else {
                    userForRegistration = null;
                    showLogin();
                }
            }).fail(function (error) {
                userData = null;
                showLogin();
            });
        }
    }).fail(function (error) {
        util.messages.showErrorMessage(error.responseText);
    });
};

function hide() {
    $$("tmpWin").hide();
}

webix.ui({
    view: "popup",
    id: "tmpWin",
    position: "center",
    close: true,
    body: {
        rows: [
            {
                view: "toolbar",
                cols: [
                    {
                        view: "label",
                        label: "<span class='webix_icon fa fa-image'></span> Korisnička slika",
                        width: 400
                    },
                    {},
                    {
                        hotkey: 'esc',
                        view: "icon",
                        icon: "close",
                        align: "right",
                        click: "hide"
                    }
                ]
            },
            {
                id: "tmp",
                view: "template",
                template: "<img src='#src#' style='width: 100%;height: 100%; max-width:100%; alignment: center; max-height:100%'></img>",
                width: 500,
                autoheight: true
            },
            {
                view: "uploader",
                value: "Izmjena fotografije",
                accept: "image/jpeg, image/png",
                autosend: false,
                width: 200,
                align: "center",
                multiple: false,
                on: {
                    onBeforeFileAdd: function (upload) {
                        var file = upload.file;
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            $$("tmp").setValues({src: event.target.result});
                            var form = $$("registrationForm");
                            form.elements.base64ImageUser.setValue(event.target.result.split("base64,")[1]);
                        };
                        reader.readAsDataURL(file)
                        return false;
                    }
                }
            }
        ]
    }
})