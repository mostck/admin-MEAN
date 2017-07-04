(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('pmUsersAllCtrl', pmUsersAllCtrl);

  pmUsersAllCtrl.$inject = ['$state', 'dialogService', 'userService', 'adminUserService'];

  function pmUsersAllCtrl($state, dialogService, userService, adminUserService) {
    /*jshint validthis:true */
    var vm = this;

    vm.query = {
      order: 'username',
      limit: 10,
      page: 1
    };

    adminUserService.getAllPmsCustomer(userService.currentUser().customer)
      .then((users) => {
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
      $state.go("pm.users.update", {id: id});
    };

  }
})();