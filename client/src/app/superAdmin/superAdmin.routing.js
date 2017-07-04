(function() {
  'use strict';
  angular
    .module('heaterSiloM2M.routing')
    .config(routing);

  function routing($stateProvider) {
    $stateProvider
    // admin section
      .state('superAdmin', {
        url: '/superAdmin',
        templateUrl: 'app/common/views/layout.html',
        controller: function (menuService) {
          this.navBar = Object.values(menuService.getMain().superAdmin.menu);
        },
        controllerAs: 'vm',
        deepStateRedirect: { default: { state: 'superAdmin.config' } }
      })
        .state('superAdmin.logout', {
          /* ngInject */
          onEnter($state, userService) {
            userService.logout();
            $state.go('login');
          }
        })
        .state('superAdmin.config', {
          url: '/config',
          templateUrl: 'app/superAdmin/config/config.html',
          controller: 'AdminConfigCtrl',
          controllerAs: 'vm'
        })
        .state('superAdmin.adminUsers', {
          url: '/adminUsers',
          templateUrl: 'app/common/views/sideBar.html',
          controller: function (menuService) {
            this.navBar = Object.values(menuService.getMain().superAdmin.menu.adminUsers.menu);
          },
          controllerAs: 'vm',
          defaultSubstate: 'superAdmin.adminUsers.all'
        })
          .state('superAdmin.adminUsers.all', {
            url: '/all',
            templateUrl: 'app/superAdmin/adminUsers/all/all.html',
            controller: 'AdminAdminUsersAllCtrl',
            controllerAs: 'vm'
          })
          .state('superAdmin.adminUsers.create', {
            url: '/create',
            templateUrl: 'app/common/views/editUser.html',
            controller: 'AdminAdminUsersCreateCtrl',
            controllerAs: 'vm'
          })
          .state('superAdmin.adminUsers.update', {
            url: '/update/:id',
            templateUrl: 'app/common/views/editUser.html',
            params: {id: null},
            controller: 'AdminAdminUsersUpdateCtrl',
            controllerAs: 'vm',
            /* ngInject */
            onEnter($stateParams, $state) {
              if(!$stateParams.id) { $state.go('superAdmin.adminUsers.all'); }
            }
          })
        .state('superAdmin.companies', {
          url: '/companies',
          templateUrl: 'app/common/views/sideBar.html',
          controller: function (menuService) {
            this.navBar = Object.values(menuService.getMain().superAdmin.menu.companies.menu);
          },
          controllerAs: 'vm',
          defaultSubstate: 'superAdmin.companies.all'
        })
          .state('superAdmin.companies.all', {
            url: '/all',
            templateUrl: 'app/superAdmin/companies/all/all.html',
            controller: 'AdminCompaniesAllCtrl',
            controllerAs: 'vm'
          })
          .state('superAdmin.companies.create', {
            url: '/create',
            templateUrl: 'app/common/views/editCompany.html',
            controller: 'AdminCompaniesCreateCtrl',
            controllerAs: 'vm'
          })
          .state('superAdmin.companies.update', {
            url: '/update/:id',
            templateUrl: 'app/common/views/editCompany.html',
            params: {id: null},
            controller: 'AdminCompaniesUpdateCtrl',
            controllerAs: 'vm'
          })
        .state('superAdmin.logs', {
          url: '/logs',
          templateUrl: 'app/common/logs/logs.html',
          controller: 'AdminLogsCtrl',
          controllerAs: 'vm'
        });
  }
})();