(function() {
  'use strict';

  angular.module('heaterSiloM2M')
    .controller('AdminAdminUsersCreateCtrl', AdminAdminUsersCreateCtrl);

  AdminAdminUsersCreateCtrl.$inject = ['$state', 'adminCompanyService', 'adminUserService', 'configService'];

  function AdminAdminUsersCreateCtrl($state, adminCompanyService, adminUserService, configService) {
    var vm = this;

    vm.state = 'create';
    vm.routerState = $state.current.name;

    vm.userRoles = configService.userSuperRoles;
    vm.user = {};

    adminCompanyService.getAllCompanies()
      .then(function (companies) {
        vm.getAllCompanies = companies;
      });
    vm.save = (user) => {
      adminUserService.createUser(user)
        .then(() => {
          $state.go("superAdmin.adminUsers.all");
        });
    };

  }
})();