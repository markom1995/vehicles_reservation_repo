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
                                        {},
                                        {
                                            id: "registerBtn",
                                            view: "button",
                                            value: "Prijava na sistem",
                                            type: "form",
                                            align: "right",
                                            hotkey: "enter",
                                            width: 150,
                                            click: "login"
                                        },
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

function login() {
    var form = $$("loginForm");
    if (form.validate()) {
        webix.ajax().header({"Content-type": "application/json"})
            .post("hub/user/login", form.getValues()).then(function (data) {
            userData = data.json;
            showApp();
        }).fail(function (error) {
            util.messages.showErrorMessage("Neuspješno prijavljivanje.")
        });
    }
};