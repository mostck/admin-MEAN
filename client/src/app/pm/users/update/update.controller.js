(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('pmUsersUpdateCtrl', pmUsersUpdateCtrl);

  /* ngInject */
  function pmUsersUpdateCtrl($state, $stateParams, adminUserService, userService) {
    /*jshint validthis:true */
    var vm = this;

    vm.userId = $stateParams.id;
    if (!vm.userId) $state.go("pm.users.all");
    vm.currentUser = userService.currentUser();

    vm.state = 'update';

    adminUserService.getAllPmsCustomer( vm.currentUser.customer)
      .then(users => {
        vm.getAllUsers = users;
        vm.user = vm.getAllUsers.find(user => {
          return user._id == vm.userId;
        });
      });

    vm.save = (user) => {
      adminUserService.updateUser(user)
        .then(() => {
          $state.go("pm.users.all");
        });
    };

  }
})();