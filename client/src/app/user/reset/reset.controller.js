(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('UserResetCtrl', UserResetCtrl);

  /* ngInject */
  function UserResetCtrl(userService, $stateParams, $state, Toast) {
    var id = $stateParams.id;

    var vm = this;

    vm.resetUser = (password) => {
      userService.reset(id, password).then((res) => {
        $state.go('login');
        Toast.success('user.alert.success_reset');
      });
    };

    vm.getPattern = function () {
      return vm.password && vm.password.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1');
    };

  }
})();