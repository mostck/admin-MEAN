(function() {
  'use strict';

  angular.module('heaterSiloM2M')
    .controller('AdminAdminUsersAllCtrl', AdminAdminUsersAllCtrl);

  AdminAdminUsersAllCtrl.$inject = ['$state', 'configService', 'adminCompanyService', 'adminUserService', 'dialogService', 'userService'];

  function AdminAdminUsersAllCtrl($state, configService, adminCompanyService, adminUserService, dialogService, userService) {
    var vm = this;
    vm.userRoles = configService.userSuperRoles;

    vm.query = {
      order: 'username',
      limit: 10,
      page: 1
    };

    vm.currentUser = userService.currentUser();

    adminUserService.getAllAdminUsers()
      .then((users) => {
        adminCompanyService.getAllCompanies()
          .then((companies) => {
            users.forEach((user) => {
              user.company = companies.find((comp) => {
                return comp._id == user.companyId;
              });
              user.role = vm.userRoles.find((el) => {
                return el.id == user.roleId;
              });
            });
            vm.getAllUsers = users;
          });
      });

    vm.remove = (user) => {
      let ok = () => {
        vm.getAllUsers.splice(vm.getAllUsers.indexOf(user), 1);
        adminUserService.removeUser(user._id);
      };
      dialogService.confirmRemoveItem(ok);
    };

    vm.update = (id) => {
      $state.go("superAdmin.adminUsers.update", {id: id});
    };

  }
})();