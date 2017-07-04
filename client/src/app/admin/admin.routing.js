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
          if(userService.getUserRole() == 3) {
            var permisions = userService.getUserPermisions();
            if(permisions && !permisions.projectsAll.read && !permisions.projectsOwner.read) {
              if(permisions && !permisions.devices.read) {
                $state.go('admin.orders.all');
              } else {
                $state.go('admin.devices.all');
              }
            }
          }
        },
        controllerAs: 'vm',
        sticky: true,
        deepStateRedirect: {
          default: { state: 'admin.projects.all' },
          fn: function ($dsr$, userService) {
            var state;
            if(userService.getUserRole() == 3) {
              var permisions = userService.getUserPermisions();
              if(permisions && !permisions.projectsAll.read && !permisions.projectsOwner.read) {
                if(permisions && !permisions.devices.read) {
                  state = 'admin.orders.all';
                } else {
                  state = 'admin.devices.all';
                }
              }
            }
            return {
              state: state ? state : 'admin.projects.all'
            };
          }
        }
      })

        //////////////
        // Projects //
        //////////////

        .state('admin.projects', {
          url: '/projects',
          templateUrl: 'app/common/views/sideBar.html',
          controller: function (menuService, $state) {
            this.navBar = Object.values(menuService.getMain().admin.menu.projects.menu);
          },
          controllerAs: 'vm',
          defaultSubstate: 'admin.projects.all'
        })
          .state('admin.projects.all', {
            url: '/all',
            templateUrl: 'app/admin/projects/all/all.html',
            controller: 'AdminProjectsAllCtrl',
            controllerAs: 'vm'
          })
          .state('admin.projects.update', {
            url: '/update/:id',
            templateUrl: 'app/admin/projects/edit/edit.html',
            params: {id: null},
            controller: 'AdminProjectsEditCtrl',
            controllerAs: 'vm',
            /* ngInject */
            onEnter: ($stateParams, $state) => {
              if(!$stateParams.id) { $state.go('admin.projects.all'); }
            }
          })
          .state('admin.projects.copy', {
            url: '/copy/:id',
            templateUrl: 'app/admin/projects/edit/edit.html',
            params: {id: null},
            controller: 'AdminProjectsEditCtrl',
            controllerAs: 'vm',
            /* ngInject */
            onEnter: ($stateParams, $state) => {
              if(!$stateParams.id) { $state.go('admin.projects.all'); }
            }
          })
          .state('admin.projects.create', {
            url: '/create',
            templateUrl: 'app/admin/projects/edit/edit.html',
            controller: 'AdminProjectsEditCtrl',
            controllerAs: 'vm'
          })
          .state('admin.projects.schedule', {
            url: '/schedule',
            templateUrl: 'app/admin/projects/schedule/schedule.html',
            controller: 'AdminScheduleCtrl',
            controllerAs: 'vm'
          })

        /////////////
        // Devices //
        /////////////

        .state('admin.devices', {
          url: '/devices',
          templateUrl: 'app/common/views/sideBar.html',
          controller: function (menuService) {
            this.navBar = Object.values(menuService.getMain().admin.menu.devices.menu);
          },
          controllerAs: 'vm',
          defaultSubstate: 'admin.devices.all'
        })
          .state('admin.devices.all', {
            url: '/all',
            templateUrl: 'app/admin/devices/all/all.html',
            controller: 'AdminDevicesAllCtrl',
            controllerAs: 'vm'
          })
          .state('admin.devices.update', {
            url: '/update/:type/:id',
            templateUrl: 'app/admin/devices/edit/edit.html',
            params: { id: null, type: null },
            controller: 'AdminDevicesEditCtrl',
            controllerAs: 'vm',
            /* ngInject */
            onEnter: ($stateParams, $state) => {
              if(!$stateParams.id && !$stateParams.type) { $state.go('admin.devices.all'); }
            }
          })
          .state('admin.devices.create', {
            url: '/create',
            params: {type: 'silo'},
            templateUrl: 'app/admin/devices/edit/edit.html',
            controller: 'AdminDevicesEditCtrl',
            controllerAs: 'vm'
          })

        /////////////
        // Customers //
        /////////////

        .state('admin.customers', {
          url: '/customers',
          templateUrl: 'app/common/views/sideBar.html',
          controller: function (menuService, userService, $state) {
            this.navBar = Object.values(menuService.getMain().admin.menu.customers.menu);
            if(userService.getUserRole() == 3) {
                $state.go('permissionDenied');
            }
          },
          controllerAs: 'vm',
          defaultSubstate: 'admin.customers.all'
        })
          .state('admin.customers.all', {
            url: '/all',
            templateUrl: 'app/admin/customers/all/all.html',
            controller: 'AdminCustomersAllCtrl',
            controllerAs: 'vm'
          })
          .state('admin.customers.update', {
            url: '/update/:id',
            templateUrl: 'app/admin/customers/common/edit.html',
            params: {id: null},
            controller: 'AdminCustomersUpdateCtrl',
            controllerAs: 'vm',
            /* ngInject */
            onEnter: ($stateParams, $state) => {
              if(!$stateParams.id) { $state.go('admin.customers.all'); }
            },
            resolve: {
              /* ngInject */
              customer (adminCustomerService, $stateParams, $state) {
                return adminCustomerService.getCustomer($stateParams.id)
                  .catch(() => { $state.go('404', {}, {location: "replace"}); });
              }
            }
          })
          .state('admin.customers.create', {
            url: '/create',
            templateUrl: 'app/admin/customers/common/edit.html',
            controller: 'AdminCustomersCreateCtrl',
            controllerAs: 'vm'
          })

        ////////////
        // Orders //
        ////////////

        .state('admin.orders', {
          url: '/orders',
          templateUrl: 'app/common/views/sideBar.html',
          controller: function (menuService) {
            this.navBar = Object.values(menuService.getMain().admin.menu.orders.menu);
          },
          controllerAs: 'vm',
          defaultSubstate: 'admin.orders.all'
        })
          .state('admin.orders.update', {
            url: '/update/:id',
            templateUrl: 'app/admin/orders/update/update.html',
            params: {id: null},
            controller: 'AdminOrdersUpdateCtrl',
            controllerAs: 'vm',
            resolve: {
              /* ngInject */
              order (adminOrderService, $stateParams, $state) {
                return adminOrderService.get($stateParams.id)
                  .catch( () => $state.go('404', {}, {location: "replace"}) );
              }
            }
          })
          .state('admin.orders.all', {
            url: '/all',
            templateUrl: 'app/admin/orders/all/all.html',
            controller: 'AdminOrdersAllCtrl',
            controllerAs: 'vm'
          })
          .state('admin.orders.create', {
            url: '/create',
            templateUrl: 'app/admin/orders/create/create.html',
            controller: 'AdminOrdersCreateCtrl',
            controllerAs: 'vm'
          })

        /////////////
        // Company //
        /////////////

        .state('admin.company', {
          url: '/company',
          templateUrl: 'app/common/views/editCompany.html',
          controller: 'AdminCompanyCtrl',
          controllerAs: 'vm',
          onEnter(userService, $state) {
            if(userService.getUserRole() == 3) {
              $state.go('permissionDenied');
            }
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
          })

        .state('admin.statistics', {
          url: '/statistics',
          templateUrl: 'app/common/views/sideBar.html',
          controller: function (menuService) {
            this.navBar = Object.values(menuService.getMain().admin.menu.statistics.menu);
          },
          controllerAs: 'vm',
          deepStateRedirect: { default: { state: 'admin.statistics.projects' } }
        })
          .state('admin.statistics.projects', {
            url: '/projects',
            templateUrl: 'app/admin/statistics/projects/projects.html',
            controller: 'AdminStatisticsProjectsService',
            controllerAs: 'vm'
          })
          .state('admin.statistics.suppliers', {
            url: '/suppliers',
            templateUrl: 'app/admin/statistics/suppliers/suppliers.html',
            controller: 'AdminStatisticsSuppliersCtrl',
            controllerAs: 'vm'
          })

        .state('admin.logs', {
          url: '/logs',
          templateUrl: 'app/common/logs/logs.html',
          controller: 'AdminLogsCtrl',
          controllerAs: 'vm',
          onEnter(userService, $state) {
            if(userService.getUserRole() == 3) {
              $state.go('permissionDenied');
            }
          }
        });
  }
})();