const _HelperSelector = (function () {
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

const _Helpers = (function () {
    return {
        Selector: _HelperSelector
    };
})();

const _handleVendor__jqueyr_scrollbar = function () {
    const options = {
        ignoreOverlay: true,
        ignoreMobile: true,
        disableBodyScroll : false
    };

    $(`#page-container[data-vendor="jquery.scrollbar"]`).addClass('scrollbar').addClass('scrollbar-macosx').scrollbar(Object.assign({
        onScroll: (y, x) => {
            var breadcrumb = _Helpers.Selector.findOne('.breadcrumb-section nav .breadcrumb');
            var header = _Helpers.Selector.findOne('aside.header');
            var breadcrumbHeader = _Helpers.Selector.findOne('#breadcrumb-header');
            if(breadcrumb && breadcrumbHeader) {
                var offsets = breadcrumb.getBoundingClientRect();
                var breadcrumbText = breadcrumb.cloneNode(true);
                if(offsets.top <= 40) {
                    breadcrumbHeader.classList.add('show');
                    header.classList.add('scrolled');
                } else if(offsets.top > 40) {
                    breadcrumbHeader.innerHTML = "";
                    breadcrumbHeader.appendChild(breadcrumbText);
                    breadcrumbHeader.classList.remove('show');
                    header.classList.remove('scrolled');
                }
            }
        }
    }, options));

    $(`.sidebar [data-vendor="jquery.scrollbar"]`).addClass('scrollbar').addClass('scrollbar-macosx').scrollbar(Object.assign({

    }, options));
};

const _handle_sidebar_state = function() {
    const currentPaths = window.location.pathname.split("/");
    const currentPath = `${currentPaths[currentPaths.length - 1]}`;
    const sidebar = _Helpers.Selector.findOne(`.nav-sidebar`);

    sidebar.classList.add('show-children');

    // main sidebar
    const mainSidebarItems = _Helpers.Selector.find(`.sidebar-main-item`);
    mainSidebarItems.forEach((mainItem, mainItemIndex) => {
        const button = _Helpers.Selector.findOne('a.btn, button.btn', mainItem);
        if(button && (button.getAttribute('href') === currentPath || button.getAttribute('href') === window.location.pathname)) {
            mainItem.classList.add('active');
            sidebar.classList.remove('show-children');
            return;
        }

        // children sidebar
        const childrenSidebarItems = _Helpers.Selector.find(`.sidebar-children-item`, mainItem);
        childrenSidebarItems.forEach((childrenItem, childrenItemIndex) => {
            const button = _Helpers.Selector.findOne('a', childrenItem);
            if(button && (button.getAttribute('href') === currentPath || button.getAttribute('href') === window.location.pathname)) {
                childrenItem.classList.add('active');
                mainItem.classList.add('active');
                if(_Helpers.Selector.findOne('ul.nav-sidebar-children', mainItem)) {
                    sidebar.classList.add('show-children');
                    document.body.classList.add('sidebar-has-children');
                }
            }
        });
    });
};

const _handle_sidebar_actions = function() {
    const sidebar = _Helpers.Selector.findOne(`.nav-sidebar`);
    
    sidebar.classList.add('show-children');
    const mainSidebarItems = _Helpers.Selector.find(`.sidebar-main-item`);
    mainSidebarItems.forEach((mainItem, index) => {
        const button = _Helpers.Selector.findOne('a.btn, button.btn', mainItem);
        if(button) {
            button.addEventListener('click', () => {
                const scrollsidebar = _Helpers.Selector.findOne(`.scroll-wrapper.nav-sidebar`);
                mainSidebarItems.forEach((mainItemTemp, indexTemp) => {
                    mainItemTemp.classList.remove('active');
                    if(_Helpers.Selector.findOne('ul.nav-sidebar-children', mainItem)) {
                        sidebar.classList.add('show-children');
                        scrollsidebar.classList.add('show-children');
                        document.body.classList.add('sidebar-has-children');
                    } else {
                        sidebar.classList.remove('show-children');
                        scrollsidebar.classList.remove('show-children');
                        document.body.classList.remove('sidebar-has-children');
                    }
                });
                mainItem.classList.add('active');
            });
        }
    });

    const toggleButtons = _Helpers.Selector.find(`[data-click="sidebar-toggle"]`);
    toggleButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            document.body.classList.toggle('hide-mobile-sidebar');
            document.body.classList.toggle('hide-disktop-sidebar');
        });
    });
};

const _AppTheme = (function () {
    return {
        colors: ['default'],
        init: function (colors = ['default']) {
            this.colors = colors;
            const currentThemeColor = localStorage.getItem("app-theme-color");
            const currentThemeDark = localStorage.getItem("app-theme-dark");
            this.change(currentThemeColor ? currentThemeColor : "default", currentThemeDark ? currentThemeDark : "");
            return this;
        },
        toggleDarkMode: function () {
            document.documentElement.classList.toggle("dark");
            this.setThemeDark(document.documentElement.classList.contains("dark") ? "dark" : "");
        },
        change: function (theme = "default", dark = "") {
            if (document.documentElement.classList.contains("dark")) dark = "dark";
            this.setThemeDark(dark);
            if (!this.colors.includes(theme)) theme = "default";
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

var App = (function () {
    "use strict";

    var settings = {};
    
    return {
        init: function (options) {
            Object.assign(settings, options);
            this.theme = _AppTheme.init(settings.colors);
            this.helpers = _Helpers;
            this.initVendor();
            this.initSidebar();
            return this;
        },
        initSidebar: function()  {
            _handle_sidebar_actions();
            _handle_sidebar_state();
        },
        initVendor: function() {
            _handleVendor__jqueyr_scrollbar();
        }
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
    App.init({
        colors: ["default", "green", "orange", "gray"]
    });
    TestApp.init();
}, false);