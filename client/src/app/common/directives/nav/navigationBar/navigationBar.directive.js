(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .directive('navigationBar', navigationBar);

  /* ngInject */
  function navigationBar($translate, userService, $state, localeService, $rootScope, menuService, $document) {
    return {
      restrict: 'E',
      templateUrl: 'app/common/directives/nav/navigationBar/navigationBar.html',
      link: function (scope) {
        scope.locales = {
          en: 'eng',
          de: 'deu'
        };
        scope.currentLocale = localeService.get();
        scope.changeLanguage = changeLanguage;
        scope.showSwitcherHandler = showSwitcherHandler;

        scope.$on('changeLanguage', (event, locale) => {
          localeService.set(locale);
          scope.currentLocale = locale;
        });

        function changeLanguage(locale) {
          $rootScope.$broadcast('changeLanguage', locale);
        }

        function showSwitcherHandler() {
          scope.isOpen = !scope.isOpen;
          $document
            .one('mouseup', (evt) => {
              scope.isOpen = false;
              scope.$apply();
            })
            .one('keyup', (evt) => {
              if (evt.which === 27) {
                scope.isOpen = false;
                scope.$apply();
              }
            });
        }

        scope.isLoggedIn = userService.isLoggedIn();
        scope.$on('user.authenticate', (event, isLoggedIn) => {
          scope.isLoggedIn = isLoggedIn;
          $rootScope.userRole = scope.userRole = userService.getUserRole();
          $rootScope.userPermissions = userService.getUserPermisions();
          scope.navBar = Object.values(menuService.getMain());
        });

        // scope.logout = function() {
        //   userService.logout();
        //   $state.go('login');
        // };

        $rootScope.userRole = scope.userRole = userService.getUserRole();
        $rootScope.userPermissions = userService.getUserPermisions();

        scope.navBar = Object.values(menuService.getMain());
      }
    };
  }
})();