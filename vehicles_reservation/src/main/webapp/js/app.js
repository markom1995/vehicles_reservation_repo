var MENU_STATES = {
    COLLAPSED: 0,
    EXPANDED: 1
};
var menuState = MENU_STATES.COLLAPSED;

var userData = null;
var companyData = null;
var userForRegistration = null;

var menuActions = function (id) {

    switch (id) {
        case "company":
            companyView.selectPanel();
            break;
        case "logger":
            loggerView.selectPanel();
            break;
        case "location":
            locationView.selectPanel();
            break;
        case "vehicle":
            vehicleView.selectPanel();
            break;
        case "home":
            homeView.selectPanel();
            break;
        case "vehicle_maintenance":
            vehicleMaintenanceView.selectPanel();
            break;
        case "reservation":
            reservationView.selectPanel();
            break;
        case "chart":
            chartView.selectPanel();
            break;
        case "users":
            usersView.selectPanel();
            break;
    }
};

var menuSuperAdmin = [
    {
        id: "company",
        value: "Kompanije",
        icon: "briefcase"
    },
    {
        id: "logger",
        value: "Loger korisničkih akcija",
        icon: "history"
    }
];

var menuAdmin = [
    {
        id: "home",
        value: "Početna strana",
        icon: "home"
    },
    {
        id: "location",
        value: "Lokacije vozila",
        icon: "map"
    },
    {
        id: "vehicle",
        value: "Vozila",
        icon: "car"
    },
    {
        id: "vehicle_maintenance",
        value: "Troškovi",
        icon: "wrench"
    },
    {
        id: "chart",
        value: "Grafikoni za troškove vozila",
        icon: "percent"
    },
    {
        id: "logger",
        value: "Loger korisničkih akcija",
        icon: "history"
    },
    {
        id: "users",
        value: "Korisnici",
        icon: "user"
    }
];

var menuUser = [
    {
        id: "home",
        value: "Početna strana",
        icon: "home"
    },
    {
        id: "location",
        value: "Lokacije vozila",
        icon: "map"
    },
    {
        id: "vehicle",
        value: "Vozila",
        icon: "car"
    },
    {
        id: "reservation",
        value: "Rezervacije",
        icon: "bookmark"
    }
];

var panel = {id: "empty"};
var rightPanel = null;

var init = function () {
    preloadDependencies();
    if (!webix.env.touch && webix.ui.scrollSize) webix.CustomScroll.init();
    webix.i18n.setLocale("sr-SP");
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
                                    if (userData.roleId === 2) {
                                        $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>" + userData.firstName + " " + userData.lastName + "<br>Administrator</p>");
                                    }
                                    else {
                                        $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>" + userData.firstName + " " + userData.lastName + "<br>Korisnik</p>");
                                    }
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
                        $$("userInfo").setHTML("<p style='display: table-cell; line-height: 13px; vertical-align: text-top; horizontal-align:right;font-size: 14px; margin-left: auto;margin-right: 0;}'>" + userData.firstName + " " + userData.lastName + "<br>Administrator sistema</p>");
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

var startTimerForRequest = function () {
    webix.ajax().get("hub/user/numberOfRequests").then(function (data) {
        numberOfRequests = data.text();
        if(numberOfRequests == 0){
            $$("requestBtn").config.badge = null;
        }
        else{
            $$("requestBtn").config.badge = numberOfRequests;
        }

        $$("requestBtn").refresh();
    }).fail(function (error) {
        util.messages.showErrorMessage("Neuspješno dobavljanje broja zahtjeva");
    });
};

var showApp = function () {
    var main = webix.copy(mainLayout);
    webix.ui(main, panel);
    panel = $$("app");
    if (companyData != null) {
        document.getElementById("appLogo").src = "data:image/jpg;base64," + companyData.logo;
    }

    var localMenuData = null;
    if (userData != null) {
        switch (userData.roleId) {
            case 1:
                localMenuData = webix.copy(menuSuperAdmin);
                $$("requestBtn").hide();
                break;
            case 2:
                localMenuData = webix.copy(menuAdmin);
                setInterval(startTimerForRequest, 30000);
                $$("requestBtn").show();
                $$("requestBtn").show();
                startTimerForRequest();
                break;
            case 3:
                localMenuData = webix.copy(menuUser);
                $$("requestBtn").hide();
                break;
        }
    }
    else if (userForRegistration != null) localMenuData = webix.copy(menuRegistration);
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
    if (userData != null) {
        if (userData.roleId === 1) {
            companyView.selectPanel();
            $$("mainMenu").select("company");
        } else {
            homeView.selectPanel();
            $$("mainMenu").select("home");
        }
    }
};

var showForgottenPasswordPopup = function () {
    if (util.popupIsntAlreadyOpened("forgottenPasswordPopup")) {
        webix.ui(webix.copy(forgottenPasswordPopup)).show();
        $$("forgottenPasswordForm").focus();
    }
};

var forgottenPasswordPopup = {
    view: "popup",
    id: "forgottenPasswordPopup",
    modal: true,
    position: "center",
    body: {
        rows: [
            {
                view: "toolbar",
                cols: [
                    {
                        view: "label",
                        label: "Zaboravljena lozinka",
                        width: 400
                    },
                    {},
                    {
                        view: "icon",
                        icon: "close",
                        align: "right",
                        hotkey: "esc",
                        click: "util.dismissDialog('forgottenPasswordPopup');"
                    }
                ]
            },
            {
                width: 400,
                view: "form",
                id: "forgottenPasswordForm",
                elementsConfig: {
                    labelWidth: 150,
                    bottomPadding: 18
                },
                elements: [
                    {

                        view: "text",
                        id: "username",
                        name: "username",
                        required: "true",
                        label: "Korisničko ime:",
                        invalidMessage: "Korisničko ime je obavezno!"
                    },
                    {

                        view: "text",
                        id: "companyName",
                        name: "companyName",
                        required: "true",
                        label: "Kompanija:",
                        invalidMessage: "Kompanija je obavezna!"
                    },
                    {
                        cols: [
                            {},
                            {
                                view: "button",
                                value: "Generišite lozinku",
                                type: "form",
                                click: "generatePassword();",
                                hotkey: "enter",
                            }
                        ]
                    }
                ]
            }
        ]
    }
};

var generatePassword = function () {
    var form = $$("forgottenPasswordForm");
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

var preloadDependencies = function () {
    webix.ajax().get("hub/vehicleMaintenanceType").then(function (data) {

        var vehicleMaintenancesTypeTemp = data.json();
        firstVehicleMaintenancesType = vehicleMaintenancesTypeTemp[0].id;
        vehicleMaintenancesTypeTemp.forEach(function (obj) {
            vehicleMaintenancesType.push({
                id: obj.id,
                value: obj.name
            });
        });
    }).fail(function (error) {
        util.messages.showErrorMessage("Neuspješno dobavljanje vrsta troškova");
    });
};

//main call
window.onload = function () {
    init();
};

