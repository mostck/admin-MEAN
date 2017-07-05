(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('UserRegistrationCtrl', UserRegistrationCtrl);

  UserRegistrationCtrl.$inject = ['userService'];

  function UserRegistrationCtrl(userService) {
    var vm = this;

    vm.registerUser = (username, email, password) => {
      userService.register(username, email, password);
    };

  }
})();