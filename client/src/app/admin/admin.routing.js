(function() {
  'use strict';
  angular
    .module('heaterSiloM2M.routing')
    .config(routing);

  /* ngInject */
  function routing($stateProvider) {
    $stateProvider
      .state('admin', {
        url: '/admin',
        templateUrl: 'app/common/views/layout.html',
        controller: function (menuService, userService, $state) {
          this.navBar = Object.values(menuService.getMain().admin.menu);
        },
        controllerAs: 'vm',
        sticky: true,
        deepStateRedirect: {
          default: { state: 'admin.users.all' }
        }
      })
        ///////////
        // Users //
        ///////////

        .state('admin.users', {
          url: '/user',
          templateUrl: 'app/common/views/sideBar.html',
          controller: function (menuService, userService, $state) {
            this.navBar = Object.values(menuService.getMain().admin.menu.users.menu);
            if(userService.getUserRole() == 3) {
              $state.go('permissionDenied');
            }
          },
          controllerAs: 'vm',
          defaultSubstate: 'admin.users.all'
        })
          .state('admin.users.all', {
            url: '/all',
            templateUrl: 'app/admin/users/all/all.html',
            controller: 'AdminUsersAllCtrl',
            controllerAs: 'vm'
          })
          .state('admin.users.create', {
            url: '/create',
            templateUrl: 'app/common/views/editUser.html',
            controller: 'AdminUsersCreateCtrl',
            controllerAs: 'vm'
          })
          .state('admin.users.update', {
            url: '/update/:id',
            templateUrl: 'app/common/views/editUser.html',
            params: {id: null},
            controller: 'AdminUsersUpdateCtrl',
            controllerAs: 'vm',
            /* ngInject */
            onEnter($stateParams, $state) {
              if(!$stateParams.id) { $state.go('admin.users.all'); }
            },
            resolve: {
              /* ngInject */
              user (adminUserService, $stateParams, $state) {
                return adminUserService.getUser($stateParams.id)
                  .catch(() => { $state.go('404', {}, {location: "replace"}); });
              }
            }
          });
  }
})();