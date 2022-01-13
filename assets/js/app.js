"use strict";

var _toConsumableArray = function (arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } };

var _HelperSelector = (function () {
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

var _Helpers = (function () {
    return {
        Selector: _HelperSelector
    };
})();

var _handleVendor__jqueyr_scrollbar = function _handleVendor__jqueyr_scrollbar() {
    var options = {
        ignoreOverlay: true,
        ignoreMobile: true,
        disableBodyScroll: false
    };

    $("#page-container[data-vendor=\"jquery.scrollbar\"]").addClass("scrollbar").addClass("scrollbar-macosx").scrollbar(Object.assign({
        onScroll: function (y, x) {
            var breadcrumb = _Helpers.Selector.findOne(".breadcrumb-section nav .breadcrumb");
            var header = _Helpers.Selector.findOne("aside.header");
            var breadcrumbHeader = _Helpers.Selector.findOne("#breadcrumb-header");
            if (breadcrumb && breadcrumbHeader) {
                var offsets = breadcrumb.getBoundingClientRect();
                var breadcrumbText = breadcrumb.cloneNode(true);
                if (offsets.top <= 50) {
                    breadcrumbHeader.classList.add("show");
                    header.classList.add("scrolled");
                } else if (offsets.top > 50) {
                    breadcrumbHeader.innerHTML = "";
                    breadcrumbHeader.appendChild(breadcrumbText);
                    breadcrumbHeader.classList.remove("show");
                    header.classList.remove("scrolled");
                }
            }
        }
    }, options));

    $(".sidebar [data-vendor=\"jquery.scrollbar\"]").addClass("scrollbar").addClass("scrollbar-macosx").scrollbar(Object.assign({}, options));
};

var _handle_sidebar_state = function _handle_sidebar_state() {
    var currentPaths = window.location.pathname.split("/");
    var currentPath = "" + currentPaths[currentPaths.length - 1];
    var sidebar = _Helpers.Selector.findOne(".nav-sidebar");

    sidebar.classList.add("show-children");

    // main sidebar
    var mainSidebarItems = _Helpers.Selector.find(".sidebar-main-item");
    mainSidebarItems.forEach(function (mainItem, mainItemIndex) {
        var button = _Helpers.Selector.findOne("a.btn, button.btn", mainItem);
        if (button && (button.getAttribute("href") === currentPath || button.getAttribute("href") === window.location.pathname)) {
            mainItem.classList.add("active");
            sidebar.classList.remove("show-children");
            return;
        }

        // children sidebar
        var childrenSidebarItems = _Helpers.Selector.find(".sidebar-children-item", mainItem);
        childrenSidebarItems.forEach(function (childrenItem, childrenItemIndex) {
            var button = _Helpers.Selector.findOne("a", childrenItem);
            if (button && (button.getAttribute("href") === currentPath || button.getAttribute("href") === window.location.pathname)) {
                childrenItem.classList.add("active");
                mainItem.classList.add("active");
                if (_Helpers.Selector.findOne("ul.nav-sidebar-children", mainItem)) {
                    sidebar.classList.add("show-children");
                    document.body.classList.add("sidebar-has-children");
                }
            }
        });
    });
};

var _handle_sidebar_actions = function _handle_sidebar_actions() {
    var sidebar = _Helpers.Selector.findOne(".nav-sidebar");

    sidebar.classList.add("show-children");
    var mainSidebarItems = _Helpers.Selector.find(".sidebar-main-item");
    mainSidebarItems.forEach(function (mainItem, index) {
        var button = _Helpers.Selector.findOne("a.btn, button.btn", mainItem);
        if (button) {
            button.addEventListener("click", function () {
                var scrollsidebar = _Helpers.Selector.findOne(".scroll-wrapper.nav-sidebar");
                mainSidebarItems.forEach(function (mainItemTemp, indexTemp) {
                    mainItemTemp.classList.remove("active");
                    if (_Helpers.Selector.findOne("ul.nav-sidebar-children", mainItem)) {
                        sidebar.classList.add("show-children");
                        scrollsidebar.classList.add("show-children");
                        document.body.classList.add("sidebar-has-children");
                        document.body.classList.remove("hide-desktop-sidebar");
                    } else {
                        sidebar.classList.remove("show-children");
                        scrollsidebar.classList.remove("show-children");
                        document.body.classList.remove("sidebar-has-children");
                    }
                });
                mainItem.classList.add("active");
            });
        }
    });

    var toggleButtons = _Helpers.Selector.find("[data-click=\"sidebar-toggle\"]");
    toggleButtons.forEach(function (button, index) {
        button.addEventListener("click", function () {
            if (document.body.classList.contains("is-desktop")) {
                document.body.classList.toggle("hide-desktop-sidebar");
            }
            if (document.body.classList.contains("is-mobile")) {
                document.body.classList.toggle("hide-mobile-sidebar");
            }
        });
    });
};

var _handle_resize = function _handle_resize() {
    var isDesktop = false;
    var isMobile = false;
    try {
        isDesktop = window.getComputedStyle(_Helpers.Selector.findOne("#is-desktop")).display === "block";
        isMobile = window.getComputedStyle(_Helpers.Selector.findOne("#is-mobile")).display === "block";
    } catch (ex) {
        isDesktop = false;
        isMobile = false;
    }
    if (isDesktop) {
        document.body.classList.add("is-desktop");
        document.body.classList.remove("is-mobile");
    }
    if (isMobile) {
        document.body.classList.add("is-mobile");
        document.body.classList.remove("is-desktop");
    }
};

var _AppTheme = (function () {
    return {
        colors: ["default"],
        currentTheme: {
            color: "default",
            dark: ""
        },
        init: function init() {
            var colors = arguments[0] === undefined ? ["default"] : arguments[0];

            this.colors = colors;
            var currentThemeColor = localStorage.getItem("app-theme-color");
            var currentThemeDark = localStorage.getItem("app-theme-dark");
            var currentTheme = JSON.parse(localStorage.getItem("app-theme"));

            this.change(currentThemeColor ? currentThemeColor : "default", currentThemeDark ? currentThemeDark : "");

            return this;
        },
        toggleDarkMode: function toggleDarkMode() {
            document.documentElement.classList.toggle("dark");
            this.setThemeDark(document.documentElement.classList.contains("dark") ? "dark" : "");
        },
        change: function change() {
            var theme = arguments[0] === undefined ? "default" : arguments[0];
            var dark = arguments[1] === undefined ? "" : arguments[1];

            if (document.documentElement.classList.contains("dark")) dark = "dark";
            this.setThemeDark(dark);
            if (!this.colors.includes(theme)) theme = "default";
            this.setThemeColor(theme);
            document.documentElement.className = "theme--" + theme + " " + dark;
        },
        setThemeColor: function setThemeColor(theme) {
            localStorage.setItem("app-theme-color", theme);
            localStorage.setItem("app-theme", JSON.stringify(Object.assign(this.currentTheme, {
                color: theme
            })));
        },
        setThemeDark: function setThemeDark(dark) {
            localStorage.setItem("app-theme-dark", dark);
            localStorage.setItem("app-theme", JSON.stringify(Object.assign(this.currentTheme, {
                dark: dark === "dark"
            })));
        } };
})();

var App = (function () {
    "use strict";

    var settings = {};

    return {
        init: function init(options) {
            Object.assign(settings, options);
            this.theme = _AppTheme.init(settings.colors);
            this.helpers = _Helpers;
            this.initPlatformDetection();
            this.initResize();
            this.initVendor();
            this.initSidebar();
            return this;
        },
        initPlatformDetection: function initPlatformDetection() {
            var div = document.createElement("DIV");
            div.setAttribute("id", "platform-detection");
            var divIsMobile = document.createElement("DIV");
            divIsMobile.setAttribute("id", "is-mobile");
            var divIsDesktop = document.createElement("DIV");
            divIsDesktop.setAttribute("id", "is-desktop");
            div.appendChild(divIsMobile);
            div.appendChild(divIsDesktop);
            document.body.appendChild(div);
        },
        initResize: function initResize() {
            _handle_resize();
            window.addEventListener("resize", function (event) {
                _handle_resize();
            }, true);
        },
        initSidebar: function initSidebar() {
            _handle_sidebar_actions();
            _handle_sidebar_state();
        },
        initVendor: function initVendor() {
            _handleVendor__jqueyr_scrollbar();
        }
    };
})();

var TestApp = (function () {
    "use strict";
    return {
        init: function init() {} };
})();

document.addEventListener("DOMContentLoaded", function () {
    App.init({
        colors: ["default", "green", "orange", "blue"]
    });
    TestApp.init();
}, false);