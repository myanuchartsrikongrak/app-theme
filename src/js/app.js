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
            let theme_text = theme;
            if($('html').hasClass('dark')) dark = true;
            this.setThemeDark(dark ? 'dark' : '');
            if(!appThemeColors.includes(theme)) theme_text = 'default';
            this.setThemeColor(theme_text);
            theme_text = `theme--${theme_text}`;
            if(dark) theme_text = `${theme_text} dark`;
            $('html').removeClass();
            $('html').addClass(theme_text);
        },
        setThemeColor(theme) {
            localStorage.setItem('app-theme-color', theme);
        },
        setThemeDark(dark) {
            localStorage.setItem('app-theme-dark', dark);
        }
    };
}();

var App = function() {
    "use strict";
    const appThemeColors = ['default', 'green', 'orange'];
    return {
        init: function() {
            
        },
        theme: _AppTheme.init(appThemeColors)
    };
}();


const _handleSidebar = function() {
    $('[data-click="sidebar-toggle"]').on('click', (e) => {
        $('body').toggleClass('show-sidebar');
    });

    const currentPath = window.location.pathname;

    $('.nav-sidebar ul.nav-sidebar-main li > a.btn').each((index, element) => {
        if($(element).attr('href') === currentPath) {
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