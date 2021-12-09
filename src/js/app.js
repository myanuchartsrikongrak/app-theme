const _HelperSelectorEngine = (function () {
    return {
        find: function (selector, element = document.documentElement) {
            return [].concat(
                ...Element.prototype.querySelectorAll.call(element, selector)
            );
        },
        findOne: function (selector, element = document.documentElement) {
            return Element.prototype.querySelector.call(element, selector);
        },
        children: function (element, selector) {
            return []
                .concat(...element.children)
                .filter((child) => child.matches(selector));
        },
        parents: function (element, selector) {
            const parents = [];
            let ancestor = element.parentNode;
            while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE && ancestor.nodeType !== NODE_TEXT) {
                if (ancestor.matches(selector)) {
                    parents.push(ancestor);
                }
                ancestor = ancestor.parentNode;
            }
            return parents;
        },
        prev: function (element, selector) {
            let previous = element.previousElementSibling;
            while (previous) {
                if (previous.matches(selector)) {
                    return [previous];
                }
                previous = previous.previousElementSibling;
            }
            return [];
        },
        next: function (element, selector) {
            let next = element.nextElementSibling;
            while (next) {
                if (next.matches(selector)) {
                    return [next];
                }
                next = next.nextElementSibling;
            }
            return [];
        }
    };
})();

const _AppHelpers = (function () {
    return {
        SelectorEngine: _HelperSelectorEngine
    };
})();

const _AppTheme = (function () {
    let appThemeColors = [];
    return {
        init: function (colors = []) {
            appThemeColors = colors;
            const currentThemeColor = localStorage.getItem("app-theme-color");
            const currentThemeDark = localStorage.getItem("app-theme-dark");
            this.changeTheme(currentThemeColor ? currentThemeColor : "default", currentThemeDark ? currentThemeDark : "");
            return this;
        },
        toggleDarkMode: function () {
            document.documentElement.classList.toggle("dark");
            this.setThemeDark(document.documentElement.classList.contains("dark") ? "dark" : "");
        },
        changeTheme: function (theme = "default", dark = "") {
            if (document.documentElement.classList.contains("dark")) dark = "dark";
            this.setThemeDark(dark);
            if (!appThemeColors.includes(theme)) theme = "default";
            this.setThemeColor(theme);
            document.documentElement.className = `theme--${theme} ${dark}`;
        },
        setThemeColor: function (theme) {
            localStorage.setItem("app-theme-color", theme);
        },
        setThemeDark: function (dark) {
            localStorage.setItem("app-theme-dark", dark);
        },
    };
})();

const _handleVendor_scrollbot = function () {
    new Scrollbot(`[data-vendor="scrollbot"]`);
};

const _handle_sidebar_state = function() {
    const currentPaths = window.location.pathname.split("/");
    const currentPath = `${currentPaths[currentPaths.length - 1]}`;

    const sidebar = _AppHelpers.SelectorEngine.findOne(`.nav-sidebar`);

    sidebar.classList.add('show-children');

    // main sidebar
    const mainSidebarItems = _AppHelpers.SelectorEngine.find(`.sidebar-main-item`);
    mainSidebarItems.forEach((mainItem, mainItemIndex) => {
        const button = _AppHelpers.SelectorEngine.findOne('a.btn', mainItem);
        if(button && button.getAttribute('href') === currentPath) {
            mainItem.classList.add('active');
            sidebar.classList.remove('show-children');
            return;
        }

        // children sidebar
        const childrenSidebarItems = _AppHelpers.SelectorEngine.find(`.sidebar-children-item`, mainItem);
        childrenSidebarItems.forEach((childrenItem, childrenItemIndex) => {
            const button = _AppHelpers.SelectorEngine.findOne('a', childrenItem);
            if(button && button.getAttribute('href') === currentPath) {
                childrenItem.classList.add('active');
                mainItem.classList.add('active');
                if(_AppHelpers.SelectorEngine.findOne('ul.nav-sidebar-children', mainItem)) {
                    sidebar.classList.add('show-children');
                }
            }
        });
    });
};

const _handle_sidebar_actions = function() {
    const sidebar = _AppHelpers.SelectorEngine.findOne(`.nav-sidebar`);

    const mainSidebarItems = _AppHelpers.SelectorEngine.find(`.sidebar-main-item`);
    mainSidebarItems.forEach((mainItem, index) => {
        const button = _AppHelpers.SelectorEngine.findOne('a.btn', mainItem);
        if(button) {
            button.addEventListener('click', () => {
                mainSidebarItems.forEach((mainItemTemp, indexTemp) => {
                    mainItemTemp.classList.remove('active');
                    if(_AppHelpers.SelectorEngine.findOne('ul.nav-sidebar-children', mainItem)) {
                        sidebar.classList.add('show-children');
                    }
                });
                document.body.classList.add('show-sidebar');
                mainItem.classList.add('active');
            });
        }
    });

    const toggleButtons = _AppHelpers.SelectorEngine.find(`[data-click="sidebar-toggle"]`);
    toggleButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            document.body.classList.toggle('show-sidebar');
        });
    });
};

var App = (function () {
    "use strict";
    const _appThemeColors = ["default", "green", "orange"];
    const _appTheme = _AppTheme.init(_appThemeColors);
    return {
        init: function () {
            this.initSidebar();
            this.initVendor();
        },
        initSidebar: function()  {
            _handle_sidebar_actions();
            _handle_sidebar_state();
        },
        initVendor: function() {
            _handleVendor_scrollbot();
        },
        theme: _appTheme,
        helpers: _AppHelpers,
    };
})();

var TestApp = (function () {
    "use strict";
    return {
        init: function () {
            
        },
    };
})();

document.addEventListener('DOMContentLoaded', function(){ 
    App.init();
    TestApp.init();
}, false);