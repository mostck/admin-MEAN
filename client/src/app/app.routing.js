(function() {
  'use strict';
  angular
    .module('heaterSiloM2M.routing', [
      'ui.router',
      'ct.ui.router.extras.dsr',
    ])
    .config(routing);

  function routing($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('permissionDenied', {
        url: '/permission-denied',
        templateUrl: 'app/permissionDenied/permissionDenied.html'
      })
      .state('404', {
        url: '/404',
        templateUrl: 'app/common/views/404.html'
      })
      .state('myAccount', {
        url: '/my-account',
        templateUrl: 'app/common/views/layout.html',
        deepStateRedirect: { default: { state: 'myAccount.settings' } }
      })
        .state('myAccount.settings', {
          url: '/settings',
          templateUrl: 'app/myAccount/settings/settings.html',
          controller: 'SettingsCtrl',
          controllerAs: 'vm'
        })
        .state('myAccount.logout', {
          /* ngInject */
          onEnter($state, userService) {
            userService.logout();
            $state.go('login');
          }
        })
      .state('login', {
        url: '/login',
        params: {
          redirectTo: null,
          redirectToParams: null
        },
        templateUrl: 'app/user/login/login.html',
        controller: 'UserLoginCtrl',
        controllerAs: 'vm'
      })
      .state('registration', {
        url: '/registration',
        templateUrl: 'app/user/registration/registration.html',
        controller: 'UserRegistrationCtrl',
        controllerAs: 'vm'
      })
      .state('forgot', {
        url: '/forgot',
        templateUrl: 'app/user/forgot/forgot.html',
        controller: 'UserForgotCtrl',
        controllerAs: 'vm'
      })
      .state('reset', {
        url: '/reset/:id',
        templateUrl: 'app/user/reset/reset.html',
        controller: 'UserResetCtrl',
        controllerAs: 'vm'
      });

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/login');
  }
})();