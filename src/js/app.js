const _AppTheme = function() {
    let appThemeColors = ['default'];
    return {
        init: function(colors) {
            appThemeColors = colors;
            const currentThemeColor = localStorage.getItem('app-theme-color');
            const currentThemeDark = localStorage.getItem('app-theme-dark');
            if(!currentThemeColor) this.changeTheme('default', currentThemeDark === 'dark');
            else this.changeTheme(currentThemeColor, currentThemeDark === 'dark');
            return this;
        },
        toggleDarkMode: function() {
            $('html').toggleClass('dark');
            this.setThemeDark($('html').hasClass('dark') ? 'dark' : '');
        },
        changeTheme: function(theme = 'default', dark = false) {

            if($('html').hasClass('dark')) dark = true;
            this.setThemeDark(dark ? 'dark' : '');

            if(!appThemeColors.includes(theme)) theme = 'default';
            this.setThemeColor(theme);

            $('html').removeClass();
            $('html').addClass(`theme--${theme} ${dark ? 'dark' : ''}`);
        },
        setThemeColor(theme) {
            localStorage.setItem('app-theme-color', theme);
        },
        setThemeDark(dark) {
            localStorage.setItem('app-theme-dark', dark);
        }
    };
}();

const _handleVendor_jqueryScrollbar = function() {
    $(`[data-vendor="jquery.scrollbar"]`).addClass('scrollbar').addClass('scrollbar-macosx').scrollbar({
        ignoreOverlay: true,
        ignoreMobile: true,
        disableBodyScroll : false
    });
}

var App = function() {
    "use strict";
    let appThemeColors = ['default', 'green', 'orange'];

    const _appTheme = _AppTheme.init(appThemeColors);
    
    return {
        init: function() {
            _handleVendor_jqueryScrollbar();
        },
        theme: _appTheme
    };
}();


const _handleSidebar = function() {
    $('[data-click="sidebar-toggle"]').on('click', (e) => {
        $('body').toggleClass('show-sidebar');
    });

    const currentPaths = window.location.pathname.split('/');
    const currentPath = `${currentPaths[currentPaths.length - 1]}`;
    // console.log(window.location);

    $('.nav-sidebar ul.nav-sidebar-main li > a.btn').each((index, element) => {
        if(`${$(element).attr('href')}` === currentPath) {
            $(element).parents('.nav-sidebar').removeClass('show-sub');
            $(element).parent().addClass('active');
        }
    });
    $('.nav-sidebar ul.nav-sidebar-main li > a:not(.btn)').each((index, element) => {
        if($(element).attr('href') === currentPath) {
            $(element).parent().addClass('active');
            $(element).parents('.nav-sidebar').addClass('show-sub');
            $(element).parents('.nav-sidebar-children').prev().parent().addClass('active');
            $('body').addClass('show-sidebar');
        }
    });

    $('.nav-sidebar ul.nav-sidebar-main li > button.btn').on('click', (e) => {
        $(e.target).parents('ul.nav-sidebar-main').find('li.sidebar-main-item').removeClass('active');
        $(e.target).parents('.nav-sidebar').find('li.sidebar-main-item').removeClass('show-sub');

        $(e.target).parent().addClass('active');
        $('body').removeClass('show-sidebar');
        $(e.target).parents('.nav-sidebar').removeClass('show-sub');
        if ($(e.target).next().hasClass('nav-sidebar-children')) {
            $(e.target).parents('.nav-sidebar').addClass('show-sub');
            $('body').addClass('show-sidebar');
        }
    });
    if($('.nav-sidebar-main').children('li.active').length) {
       var sub = $('.nav-sidebar-main').children('li.active').find('ul.nav-sidebar-children');
       if(sub.find('li.active').length) {
           $('.nav-sidebar').addClass('show-sub');
       }
    }
}
var TestApp = function() {
    "use strict";
    return {
        init: function() {
            _handleSidebar();
        }
    };
}();

$(document).ready(function() {
    App.init();
	TestApp.init();
});