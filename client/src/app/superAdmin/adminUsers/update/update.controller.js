(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminAdminUsersUpdateCtrl', AdminAdminUsersUpdateCtrl);

  /* ngInject */
  function AdminAdminUsersUpdateCtrl($state, $stateParams, configService, adminUserService, adminCompanyService, userService) {
    var vm = this;

    vm.state = 'update';
    vm.routerState = $state.current.name;

    vm.userRoles = configService.userSuperRoles;
    vm.currentUser = userService.currentUser();


    adminCompanyService.getAllCompanies()
      .then((companies) => {
        vm.getAllCompanies = companies;
      });

    adminUserService.getUser($stateParams.id)
      .then( user => {
        vm.user = user;
      });

    vm.save = (user) => {
      adminUserService.updateUser(user)
        .then(() => {
          $state.go("superAdmin.adminUsers.all");
        });
    };

  }
})();
