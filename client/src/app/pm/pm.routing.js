(function() {
  'use strict';
  angular
    .module('heaterSiloM2M.routing')
    .config(routing);

  function routing($stateProvider) {
    $stateProvider
      .state('pm', {
        url: '/pm',
        template: '<ui-view/>',
        deepStateRedirect: { default: { state: 'pm.heaters' } }
      })
        .state('pm.users', {
          url: '/users',
          templateUrl: 'app/common/views/sideBar.html',
          controller: function (menuService) {
            this.navBar = Object.values(menuService.getMain().pmUsers.menu);
          },
          controllerAs: 'vm',
          defaultSubstate: 'pm.users.all'
        })
          .state('pm.users.all', {
            url: '/all',
            templateUrl: 'app/pm/users/all/all.html',
            controller: 'pmUsersAllCtrl',
            controllerAs: 'vm'
          })
          .state('pm.users.create', {
            url: '/create',
            templateUrl: 'app/pm/users/editUser.html',
            controller: 'pmUsersCreateCtrl',
            controllerAs: 'vm'
          })
          .state('pm.users.update', {
            url: '/update/:id',
            templateUrl: 'app/pm/users/editUser.html',
            params: { id: null },
            controller: 'pmUsersUpdateCtrl',
            controllerAs: 'vm'
          })
        .state('pm.heaters', {
          url: '/heaters',
          templateUrl: 'app/pm/heaters/heaters.html',
          controller: 'pmHeatersAllCtrl',
          controllerAs: 'vm'
        })
        .state('pm.projects', {
          url: '/projects',
          templateUrl: 'app/pm/projects/projects.html',
          controller: 'pmProjectsAllCtrl',
          controllerAs: 'vm'
        })
        .state('pm.project', {
          url: '/project/:id',
            templateUrl: 'app/project/project.html',
            params: {id: null},
            controller: 'ProjectCtrl',
            controllerAs: 'vm',
            /* ngInject */
            onEnter($stateParams, $state) {
              if(!$stateParams.id) { $state.go('pm.projects'); }
            },
            resolve: {
              /* ngInject */
              project (adminProjectService, $stateParams, $state) {
                return adminProjectService.get($stateParams.id)
                  .catch(() => { $state.go('404', {}, {location: "replace"}); });
              }
            }
        });
  }
})();