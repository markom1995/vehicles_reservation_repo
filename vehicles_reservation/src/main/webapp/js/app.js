var MENU_STATES = {
    COLLAPSED: 0,
    EXPANDED: 1
};
var menuState = MENU_STATES.COLLAPSED;

var userData = null;
var companyData = null;
var userForRegistration=null;

var menuActions = function (id) {

    switch (id) {
        case "company":
            companyView.selectPanel();
            break;
    }
};

var menuSuperAdmin = [
    {
        id: "company",
        value: "Kompanije",
        icon: "briefcase"
    }
];

var menuAdmin = [
    {
        id: "company",
        value: "Kompanije",
        icon: "briefcase"
    }
];

var menuUser = [
    {
        id: "company",
        value: "Kompanije",
        icon: "briefcase"
    }
];

var menuAdmin = [
    {
        id: "dashboard",
        value: "Početna",
        icon: "home"
    },

    {
        id: "building",
        value: "Zgrade",
        icon: "building"
    },
    {
        id: "note",
        value: "Oglasi",
        icon: "sticky-note"
    },
    {
        id: "settings",
        value: "Podešavanja",
        icon: "cog"
    },
    {
        id: "room",
        value: "Sale",
        icon: "cube"
    },
    {
        id: "gear",
        value: "Oprema",
        icon: "wrench"
    }, {
        id: "logger",
        value: "Logger korisničkih akcija",
        icon: "history"
    }, {
        id: "user",
        value: "Korisnici",
        icon: "user"
    },{
        id: "userGroup",
        value: "Korisničke grupe",
        icon: "users"
    }
];

var panel = {id: "empty"};
var rightPanel = null;

var init = function () {
    if (!webix.env.touch && webix.ui.scrollSize) webix.CustomScroll.init();
    //webix.i18n.setLocale("sr-SP");
    webix.Date.startOnMonday = true;
    webix.ui(panel);
    panel = $$("empty");
    webix.ajax("hub/user/state", {
        error: function (text, data, xhr) {
            if (xhr.status == 403) {
                showLogin();
            }
        },
        success: function (text, data, xhr) {
            if (xhr.status == "200") {
                if (data.json() != null && data.json().id != null) {
                    userData = data.json();
                    if (userData.roleId !== 1) {
                        webix.ajax().get("hub/company/" + userData.companyId, {
                            success: function (text, data, xhr) {
                                var company = data.json();
                                if (company != null) {
                                    companyData = company;
                                    companyData.deleted = 0;
                                    showApp();
                                    if(userData.roleId===2)
                                    $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>"+userData.firstName+" "+userData.lastName+"<br> administrator</p>");
                                    else if(userData.roleId===3)
                                        $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>"+userData.firstName+" "+userData.lastName+"<br> napredni korisnik</p>");
                                else $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>"+userData.firstName+" "+userData.lastName+"<br> korisnik</p>");

                                } else {
                                    userData = null;
                                    showLogin();

                                }
                            },
                            error: function (text, data, xhr) {
                                userData = null;
                                showLogin();
                            }
                        });
                    } else {
                        showApp();
                        $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>"+userData.firstName+" "+userData.lastName+"<br> super admin</p>");
                    }

                }
                else {
                    //TODO SHOW ERROR MESSAGE
                }
            } else {
                //TODO ERROR LOGIN
            }
        }
    });
};


var register = function () {
    var register = webix.copy(registrationLayout);
    webix.ui(register, panel);
    panel = $$("registration");
};
var registrationLayout={
    id: "registration",
    width: "auto",
    height: "auto",
    rows: [
        {
            cols: [

                {
                    height: 60,
                    align:"center",
                    view: "label",
                    label: "Schedule Up",
                    css: "appNameLabel"
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
                        labelWidth: 60,
                        bottomPadding: 18
                    },
                    elements: [
                        {
                            id: "token",
                            name: "token",
                            view: "text",
                            label: "Token",
                            invalidMessage: "Token je obavezan!",
                            required: true
                        },
                        {
                            margin: 5,
                            cols: [{}, {
                                id: "registerBtn",
                                view: "button",
                                align:"center",
                                value: "Potvrdi",
                                type: "form",
                                click: "tokenConfirm",
                                hotkey: "enter",
                                width: 150
                            },{}]
                        }]},{}]}]
};
var tokenConfirm = function () {
    var token=($$("tokenForm")).getValues().token;
    webix.ajax().get("/hub/user/registration/"+token, {
        success: function (text, data, xhr) {
            var jsonData = data.json();
            userForRegistration=jsonData;
            if(userForRegistration==null){
                util.messages.showErrorMessage("Neispravan ili istekao token.")

            }else{
                webix.ajax().get("/hub/company/" + userForRegistration.companyId, {
                    success: function (text, data, xhr) {
                        var company = data.json();
                        if (company != null) {
                            companyData = company;
                            companyData.deleted = 0;
                            showApp();
                        } else {
                            userForRegistration=null;
                            showLogin();

                        }
                    },
                    error: function (text, data, xhr) {
                        userData = null;
                        showLogin();
                    }
                });
            }
        },
        error: function (text, data, xhr) {
            util.messages.showErrorMessage(text);
        }
    });

};
/*var login = function () {

    console.log($$("loginForm").getValues());
    if ($$("loginForm").validate()) {
        webix.ajax().headers({
            "Content-type": "application/json"
        }).post("hub/user/login", $$("loginForm").getValues(), {
            success: function (text, data, xhr) {
                var user = data.json();
                console.log(user);
                if (user != null) {
                    if (user.roleId === 1) {
                        userData = user;
                        companyData = null;
                        showApp();
                        $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>"+userData.firstName+" "+userData.lastName+"<br> super admin</p>");

                    } else {
                        webix.ajax().get("hub/company/" + user.companyId, {
                            success: function (text, data, xhr) {
                                var company = data.json();
                                if (company != null) {
                                    userData = user;
                                    companyData = company;
                                    companyData.deleted = 0;
                                    showApp();
                                    if(userData.roleId===2)
                                        $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>"+userData.firstName+" "+userData.lastName+"<br> administrator</p>");
                                    else if(userData.roleId===3)
                                        $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>"+userData.firstName+" "+userData.lastName+"<br> napredni korisnik</p>");
                                    else $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>"+userData.firstName+" "+userData.lastName+"<br> korisnik</p>");

                                } else {
                                    util.messages.showErrorMessage("Prijavljivanje nije uspjelo!");

                                }
                            },
                            error: function (text, data, xhr) {
                                util.messages.showErrorMessage("Prijavljivanje nije uspjelo!");
                            }
                        });
                    }
                } else {
                    util.messages.showErrorMessage("Prijavljivanje nije uspjelo!");
                }
            },
            error: function (text, data, xhr) {
                console.log("NIJE" + text);
                util.messages.showErrorMessage("Prijavljivanje nije uspjelo!");
            }
        });
    }

};*/

var menuEvents = {
    onItemClick: function (item) {
        menuActions(item);
    }
};

var showLogin = function () {
    var login = webix.copy(loginLayout);
    webix.ui(login, panel);
    panel = $$("login");
};

var showApp = function () {
    var main = webix.copy(mainLayout);
    webix.ui(main, panel);
    panel = $$("app");
    if (companyData != null)
        document.getElementById("appLogo").src = "data:image/jpg;base64," + companyData.companyLogo;
    var localMenuData = null;
    if(userData!=null)
    {
    switch (userData.roleId) {
        case 1:
            localMenuData = webix.copy(menuSuperAdmin);
            break;
        case 2:
            localMenuData = webix.copy(menuAdmin);
            break;
        case 3:
            localMenuData = webix.copy(menuUser);
            break;
    }}
    else if(userForRegistration!=null) localMenuData = webix.copy(menuRegistration);
    webix.ui({
        id: "menu-collapse",
        view: "template",
        template: '<div id="menu-collapse" class="menu-collapse">' +
        '<span></span>' +
        '<span></span>' +
        '<span></span>' +
        '</div>',
        onClick: {
            "menu-collapse": function (e, id, trg) {
                var elem = document.getElementById("menu-collapse");
                if (menuState == MENU_STATES.COLLAPSED) {
                    elem.className = "menu-collapse open";
                    menuState = MENU_STATES.EXPANDED;
                    $$("mainMenu").toggle();
                } else {
                    elem.className = "menu-collapse";
                    menuState = MENU_STATES.COLLAPSED;
                    $$("mainMenu").toggle();
                }
            }
        }
    });

    $$("mainMenu").define("data", localMenuData);
    $$("mainMenu").define("on", menuEvents);

   rightPanel = "emptyRightPanel";
    /*if(userData!=null)
    {
    if (userData.roleId === 1) {
        companyView.selectPanel();
        $$("mainMenu").select("company");
    } else {
        dashboardView.selectPanel();
        $$("mainMenu").select("dashboard");
    }
    }
    else if(userForRegistration!=null){
        registrationView.selectPanel();
        $$("mainMenu").select("registration");
        $$("userMenu").hide();
        $$("userInfo").hide();
    }*/
};

var showForgottenPasswordPopup=function(){
    if (util.popupIsntAlreadyOpened("forgottenPasswordPopup")){
        webix.ui(webix.copy(forgottenPasswordPopup)).show();
        $$("forgottenPasswordForm").focus();
    }
};

var forgottenPasswordPopup={
    view:"popup",
    id:"forgottenPasswordPopup",
    modal:true,
    position:"center",
    body:{
        rows:[
            {
                view:"toolbar",
                cols:[
                    {
                        view:"label",
                        label:"Zaboravljena lozinka",
                        width:400
                    },
                    {},
                    {
                        view:"icon",
                        icon:"close",
                        align:"right",
                        hotkey:"esc",
                        click:"util.dismissDialog('forgottenPasswordPopup');"
                    }
                ]
            },
            {
                width:400,
                view:"form",
                id:"forgottenPasswordForm",
                elementsConfig: {
                    labelWidth: 150,
                    bottomPadding: 18
                },
                elements:[
                    {

                        view:"text",
                        id:"username",
                        name:"username",
                        required:"true",
                        label:"Korisničko ime:",
                        invalidMessage:"Korisničko ime je obavezno!"
                    },
                    {

                        view:"text",
                        id:"companyName",
                        name:"companyName",
                        required:"true",
                        label:"Kompanija:",
                        invalidMessage:"Kompanija je obavezna!"
                    },
                    {
                        cols:[
                            {},
                            {
                                view:"button",
                                value:"Generišite lozinku",
                                type:"form",
                                click:"generatePassword();",
                                hotkey: "enter",
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

var generatePassword= function(){
    var form=$$("forgottenPasswordForm");
    if (form.validate()) {
        var loginInformation = JSON.stringify(form.getValues());
        webix.ajax().headers({
            "Content-type": "application/json"
        }).post("hub/user/resetPassword", loginInformation).then(function (result) {
            if (result.text()) {
                util.messages.showMessage("Uspješno ste resetovali lozinku. Provjerite vaš e-mail.");
            } else {
                util.messages.showErrorMessage("Greška prilikom resetovanja lozinke!");
            }
        }).fail(function (error) {
            util.messages.showErrorMessage(error.responseText);
        });
        util.dismissDialog("forgottenPasswordPopup");
    }
};

//main call
window.onload = function () {
    init();
};

