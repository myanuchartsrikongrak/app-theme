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

const _handleVendor__jquery_scrollbar = function () {
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
                if(offsets.top <= 50) {
                    breadcrumbHeader.classList.add('show');
                    header.classList.add('scrolled');
                } else if(offsets.top > 50) {
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
                        document.body.classList.remove('hide-desktop-sidebar');
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
            if(document.body.classList.contains('is-desktop')) {
                document.body.classList.toggle('hide-desktop-sidebar');
            }
            if(document.body.classList.contains('is-mobile')) {
                document.body.classList.toggle('hide-mobile-sidebar');
            }
        });
    });
};

const _handle_resize = function() {
    let isDesktop = false;
    let isMobile = false;
    try {
        isDesktop = window.getComputedStyle(_Helpers.Selector.findOne(`#is-desktop`)).display === "block";
        isMobile = window.getComputedStyle(_Helpers.Selector.findOne(`#is-mobile`)).display === "block";
    } catch(ex) {
        isDesktop = false;
        isMobile = false;
    }
    if(isDesktop) {
        document.body.classList.add('is-desktop');
        document.body.classList.remove('is-mobile');
    }
    if(isMobile) {
        document.body.classList.add('is-mobile');
        document.body.classList.remove('is-desktop');
    }
};

const _AppTheme = (function () {
    return {
        colors: ['default'],
        currentTheme: {
            color: 'default',
            dark: false
        },
        init: function (colors = ['default']) {
            this.colors = colors;
            const currentTheme = JSON.parse(localStorage.getItem("app-theme")) || this.currentTheme;
            const currentThemeColor = currentTheme.color;
            const currentThemeDark = currentTheme.dark;

            this.change(currentThemeColor ? currentThemeColor : "default", currentThemeDark);
            
            return this;
        },
        toggleDarkMode: function () {
            document.documentElement.classList.toggle("dark");
            this.setThemeDark(document.documentElement.classList.contains("dark"));
        },
        change: function (theme = "default", dark = false) {
            if (document.documentElement.classList.contains("dark")) dark = true;
            this.setThemeDark(dark);
            if (!this.colors.includes(theme)) theme = "default";
            this.setThemeColor(theme);
            document.documentElement.className = `theme--${theme} ${dark ? 'dark' : ''}`;
        },
        setThemeColor: function (theme) {
            localStorage.setItem("app-theme", JSON.stringify(Object.assign(this.currentTheme, {
                color: theme
            })));
        },
        setThemeDark: function (dark = true) {
            localStorage.setItem("app-theme", JSON.stringify(Object.assign(this.currentTheme, {
                dark: dark
            })));
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
            this.initPlatformDetection();
            this.initResize();
            this.initVendor();
            this.initSidebar();
            return this;
        },
        initPlatformDetection: function() {
            const div = document.createElement('DIV');
            div.setAttribute('id', 'platform-detection');
            const divIsMobile = document.createElement('DIV');
            divIsMobile.setAttribute('id', 'is-mobile');
            const divIsDesktop = document.createElement('DIV');
            divIsDesktop.setAttribute('id', 'is-desktop');
            div.appendChild(divIsMobile);
            div.appendChild(divIsDesktop);
            document.body.appendChild(div);
        },
        initResize: function() {
            _handle_resize();
            window.addEventListener('resize', function(event) {
                _handle_resize();
            }, true);
        },
        initSidebar: function()  {
            _handle_sidebar_actions();
            _handle_sidebar_state();
        },
        initVendor: function() {
            _handleVendor__jquery_scrollbar();
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
        colors: ["default", "green", "orange", "blue"]
    });
    TestApp.init();
}, false);