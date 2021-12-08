"use strict";

var _AppTheme = (function () {
    var appThemeColors = ["default"];
    return {
        init: function init(colors) {
            appThemeColors = colors;
            var currentThemeColor = localStorage.getItem("app-theme-color");
            var currentThemeDark = localStorage.getItem("app-theme-dark");
            if (!currentThemeColor) this.changeTheme("default", currentThemeDark === "dark");else this.changeTheme(currentThemeColor, currentThemeDark === "dark");
            return this;
        },
        toggleDarkMode: function toggleDarkMode() {
            $("html").toggleClass("dark");
            this.setThemeDark($("html").hasClass("dark") ? "dark" : "");
        },
        changeTheme: function changeTheme() {
            var theme = arguments[0] === undefined ? "default" : arguments[0];
            var dark = arguments[1] === undefined ? false : arguments[1];

            if ($("html").hasClass("dark")) dark = true;
            this.setThemeDark(dark ? "dark" : "");

            if (!appThemeColors.includes(theme)) theme = "default";
            this.setThemeColor(theme);

            $("html").removeClass();
            $("html").addClass("theme--" + theme + " " + (dark ? "dark" : ""));
        },
        setThemeColor: function setThemeColor(theme) {
            localStorage.setItem("app-theme-color", theme);
        },
        setThemeDark: function setThemeDark(dark) {
            localStorage.setItem("app-theme-dark", dark);
        }
    };
})();

var App = (function () {
    "use strict";
    var appThemeColors = ["default", "green", "orange"];
    return {
        init: function init() {},
        theme: _AppTheme.init(appThemeColors)
    };
})();

var _handleSidebar = function _handleSidebar() {
    $("[data-click=\"sidebar-toggle\"]").on("click", function (e) {
        $("body").toggleClass("show-sidebar");
    });

    var currentPaths = window.location.pathname.split("/");
    var currentPath = "" + currentPaths[currentPaths.length - 1];
    console.log(window.location);

    $(".nav-sidebar ul.nav-sidebar-main li > a.btn").each(function (index, element) {
        if ("" + $(element).attr("href") === currentPath) {
            $(element).parents(".nav-sidebar").removeClass("show-sub");
            $(element).parent().addClass("active");
        }
    });
    $(".nav-sidebar ul.nav-sidebar-main li > a:not(.btn)").each(function (index, element) {
        if ($(element).attr("href") === currentPath) {
            $(element).parent().addClass("active");
            $(element).parents(".nav-sidebar").addClass("show-sub");
            $(element).parents(".nav-sidebar-children").prev().parent().addClass("active");
            $("body").addClass("show-sidebar");
        }
    });

    $(".nav-sidebar ul.nav-sidebar-main li > button.btn").on("click", function (e) {
        $(e.target).parents("ul.nav-sidebar-main").find("li.sidebar-main-item").removeClass("active");
        $(e.target).parents(".nav-sidebar").find("li.sidebar-main-item").removeClass("show-sub");

        $(e.target).parent().addClass("active");
        $("body").removeClass("show-sidebar");
        $(e.target).parents(".nav-sidebar").removeClass("show-sub");
        if ($(e.target).next().hasClass("nav-sidebar-children")) {
            $(e.target).parents(".nav-sidebar").addClass("show-sub");
            $("body").addClass("show-sidebar");
        }
    });
    if ($(".nav-sidebar-main").children("li.active").length) {
        var sub = $(".nav-sidebar-main").children("li.active").find("ul.nav-sidebar-children");
        if (sub.find("li.active").length) {
            $(".nav-sidebar").addClass("show-sub");
        }
    }
};
var TestApp = (function () {
    "use strict";
    return {
        init: function init() {
            _handleSidebar();
        }
    };
})();

$(document).ready(function () {
    App.init();
    TestApp.init();
});