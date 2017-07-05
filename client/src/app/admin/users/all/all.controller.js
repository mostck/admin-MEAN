(function() {
  'use strict';

  angular.module('heaterSiloM2M')
    .controller('AdminUsersAllCtrl', AdminUsersAllCtrl);

  AdminUsersAllCtrl.$inject = ['$state', 'configService', 'adminUserService', 'dialogService', 'userService'];

  function AdminUsersAllCtrl($state, configService, adminUserService, dialogService, userService) {
    var vm = this;
    vm.userRoles = configService.userRoles;

    vm.query = {
      order: 'username',
      limit: 10,
      page: 1
    };

    vm.currentUser = userService.currentUser();

    adminUserService.getAllUsers()
      .then((users) => {
        users.forEach((user) => {
          user.role = vm.userRoles.find((el) => {
            return el.id == user.roleId;
          });
        });
        vm.getAllUsers = users;
      });

    vm.remove = (user) => {
      let ok = () => {
        vm.getAllUsers.splice(vm.getAllUsers.indexOf(user), 1);
        adminUserService.removeUser(user._id);
      };
      dialogService.confirmRemoveItem(ok);
    };

    vm.update = (id) => {
      $state.go("admin.users.update", {id: id});
    };
  }
})();