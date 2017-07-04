(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('pmUsersCreateCtrl', pmUsersCreateCtrl);

  /* ngInject */
  function pmUsersCreateCtrl($state, adminUserService, userService) {
    /*jshint validthis:true */
    var vm = this;
    vm.user = {};
    vm.state = 'create';
    vm.currentUser = userService.currentUser();

    vm.save = function (user) {
      var currentUser = vm.currentUser;
      user.roleId = 6;
      user.companyId = currentUser.companyId;
      user.customer = currentUser.customer;

      adminUserService.createUser(user)
        .then(() => {
          $state.go("pm.users.all");
        });
    };

  }
})();