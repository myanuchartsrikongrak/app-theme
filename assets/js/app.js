"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _HelperSelectorEngine = (function () {
    return {
        find: function find(selector) {
            var _ref;

            var element = arguments[1] === undefined ? document.documentElement : arguments[1];

            return (_ref = []).concat.apply(_ref, _toConsumableArray(Element.prototype.querySelectorAll.call(element, selector)));
        },
        findOne: function findOne(selector) {
            var element = arguments[1] === undefined ? document.documentElement : arguments[1];

            return Element.prototype.querySelector.call(element, selector);
        },
        children: function children(element, selector) {
            var _ref;

            return (_ref = []).concat.apply(_ref, _toConsumableArray(element.children)).filter(function (child) {
                return child.matches(selector);
            });
        },
        parents: (function (_parents) {
            var _parentsWrapper = function parents(_x, _x2) {
                return _parents.apply(this, arguments);
            };

            _parentsWrapper.toString = function () {
                return _parents.toString();
            };

            return _parentsWrapper;
        })(function (element, selector) {
            var parents = [];
            var ancestor = element.parentNode;
            while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
                if (ancestor.matches(selector)) {
                    parents.push(ancestor);
                }
                ancestor = ancestor.parentNode;
            }
            return parents;
        }),
        prev: function prev(element, selector) {
            var previous = element.previousElementSibling;
            while (previous) {
                if (previous.matches(selector)) {
                    return [previous];
                }
                previous = previous.previousElementSibling;
            }
            return [];
        },
        next: (function (_next) {
            var _nextWrapper = function next(_x, _x2) {
                return _next.apply(this, arguments);
            };

            _nextWrapper.toString = function () {
                return _next.toString();
            };

            return _nextWrapper;
        })(function (element, selector) {
            var next = element.nextElementSibling;
            while (next) {
                if (next.matches(selector)) {
                    return [next];
                }
                next = next.nextElementSibling;
            }
            return [];
        })
    };
})();

var _AppHelpers = (function () {
    return {
        SelectorEngine: _HelperSelectorEngine
    };
})();

var _AppTheme = (function () {
    var appThemeColors = [];
    return {
        init: function init() {
            var colors = arguments[0] === undefined ? [] : arguments[0];

            appThemeColors = colors;
            var currentThemeColor = localStorage.getItem("app-theme-color");
            var currentThemeDark = localStorage.getItem("app-theme-dark");
            this.changeTheme(currentThemeColor ? currentThemeColor : "default", currentThemeDark ? currentThemeDark : "");
            return this;
        },
        toggleDarkMode: function toggleDarkMode() {
            document.documentElement.classList.toggle("dark");
            this.setThemeDark(document.documentElement.classList.contains("dark") ? "dark" : "");
        },
        changeTheme: function changeTheme() {
            var theme = arguments[0] === undefined ? "default" : arguments[0];
            var dark = arguments[1] === undefined ? "" : arguments[1];

            if (document.documentElement.classList.contains("dark")) dark = "dark";
            this.setThemeDark(dark);
            if (!appThemeColors.includes(theme)) theme = "default";
            this.setThemeColor(theme);
            document.documentElement.className = "theme--" + theme + " " + dark;
        },
        setThemeColor: function setThemeColor(theme) {
            localStorage.setItem("app-theme-color", theme);
        },
        setThemeDark: function setThemeDark(dark) {
            localStorage.setItem("app-theme-dark", dark);
        } };
})();

var _handleVendor_scrollbot = function _handleVendor_scrollbot() {
    new Scrollbot("[data-vendor=\"scrollbot\"]");
};

var _handle_sidebar_state = function _handle_sidebar_state() {
    var currentPaths = window.location.pathname.split("/");
    var currentPath = "" + currentPaths[currentPaths.length - 1];

    var sidebar = _AppHelpers.SelectorEngine.findOne(".nav-sidebar");

    sidebar.classList.add("show-children");

    // main sidebar
    var mainSidebarItems = _AppHelpers.SelectorEngine.find(".sidebar-main-item");
    mainSidebarItems.forEach(function (mainItem, mainItemIndex) {
        var button = _AppHelpers.SelectorEngine.findOne("a.btn", mainItem);
        if (button && button.getAttribute("href") === currentPath) {
            mainItem.classList.add("active");
            sidebar.classList.remove("show-children");
            return;
        }

        // children sidebar
        var childrenSidebarItems = _AppHelpers.SelectorEngine.find(".sidebar-children-item", mainItem);
        childrenSidebarItems.forEach(function (childrenItem, childrenItemIndex) {
            var button = _AppHelpers.SelectorEngine.findOne("a", childrenItem);
            if (button && button.getAttribute("href") === currentPath) {
                childrenItem.classList.add("active");
                mainItem.classList.add("active");
                if (_AppHelpers.SelectorEngine.findOne("ul.nav-sidebar-children", mainItem)) {
                    sidebar.classList.add("show-children");
                }
            }
        });
    });
};

var _handle_sidebar_actions = function _handle_sidebar_actions() {
    var sidebar = _AppHelpers.SelectorEngine.findOne(".nav-sidebar");

    var mainSidebarItems = _AppHelpers.SelectorEngine.find(".sidebar-main-item");
    mainSidebarItems.forEach(function (mainItem, index) {
        var button = _AppHelpers.SelectorEngine.findOne("a.btn", mainItem);
        if (button) {
            button.addEventListener("click", function () {
                mainSidebarItems.forEach(function (mainItemTemp, indexTemp) {
                    mainItemTemp.classList.remove("active");
                    if (_AppHelpers.SelectorEngine.findOne("ul.nav-sidebar-children", mainItem)) {
                        sidebar.classList.add("show-children");
                    }
                });
                document.body.classList.add("show-sidebar");
                mainItem.classList.add("active");
            });
        }
    });

    var toggleButtons = _AppHelpers.SelectorEngine.find("[data-click=\"sidebar-toggle\"]");
    toggleButtons.forEach(function (button, index) {
        button.addEventListener("click", function () {
            document.body.classList.toggle("show-sidebar");
        });
    });
};

var App = (function () {
    "use strict";
    var _appThemeColors = ["default", "green", "orange"];
    var _appTheme = _AppTheme.init(_appThemeColors);
    return {
        init: function init() {
            this.initSidebar();
            this.initVendor();
        },
        initSidebar: function initSidebar() {
            _handle_sidebar_actions();
            _handle_sidebar_state();
        },
        initVendor: function initVendor() {
            _handleVendor_scrollbot();
        },
        theme: _appTheme,
        helpers: _AppHelpers };
})();

var TestApp = (function () {
    "use strict";
    return {
        init: function init() {} };
})();

document.addEventListener("DOMContentLoaded", function () {
    App.init();
    TestApp.init();
}, false);