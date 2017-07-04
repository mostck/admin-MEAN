(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('UserForgotCtrl', UserForgotCtrl);

  UserForgotCtrl.$inject = ['userService'];

  function UserForgotCtrl(userService) {
    var vm = this;

    vm.forgotUser = function (username) {
      userService.forgot(username)
        .then((res) => {
          vm.warning = null;
          vm.success = true;
        }).catch((err) => {
        vm.success = null;
        vm.warning = true;
      });
    };
  }
})();
