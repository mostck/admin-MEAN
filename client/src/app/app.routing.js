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
      .state('project', {
        url: '/project/:id',
        templateUrl: 'app/project/project.html',
        params: {id: null},
        controller: 'ProjectCtrl',
        controllerAs: 'vm',
        /* ngInject */
        onEnter($stateParams, $state) {
          if(!$stateParams.id) { $state.go('admin.projects.all'); }
        },
        resolve: {
          /* ngInject */
          project (adminProjectService, $stateParams, $state) {
            return adminProjectService.get($stateParams.id)
              .catch(() => { $state.go('404', {}, {location: "replace"}); });
          }
        }
      })
      .state('silo', {
        url: '/silo/:id',
        templateUrl: 'app/silo/silo.html',
        params: {id: null},
        controller: 'SiloCtrl',
        controllerAs: 'vm',
        /* ngInject */
        onEnter($stateParams, $state) {
          if(!$stateParams.id) { $state.go('admin.devices.all'); }
        },
        resolve: {
          /* ngInject */
          silo (adminDeviceService, $stateParams, $state) {
            return adminDeviceService.getSilo($stateParams.id)
              .catch(() => { $state.go('404', {}, {location: "replace"}); });
          }
        }
      })
      .state('heater', {
        url: '/heater/:id',
        templateUrl: 'app/heater/heater.html',
        params: {id: null},
        controller: 'HeaterCtrl',
        controllerAs: 'vm',
        /* ngInject */
        onEnter($stateParams, $state) {
          if(!$stateParams.id) { $state.go('admin.devices.all'); }
        },
        resolve: {
          /* ngInject */
          heater (adminDeviceService, $stateParams, $state) {
            return adminDeviceService.getHeater($stateParams.id)
              .catch(() => { $state.go('404', {}, {location: "replace"}); });
          }
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
      })
      .state('dataCollection', {
        url: '/dataCollection',
        templateUrl: 'app/dataCollection/dataCollection.html',
        controller: 'DataCollectionCtrl',
        controllerAs: 'vm'
      });

    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise('/login');
  }
})();