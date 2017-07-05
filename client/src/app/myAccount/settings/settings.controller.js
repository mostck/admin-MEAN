(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('SettingsCtrl', SettingsCtrl);

  SettingsCtrl.$inject = ['adminUserService', 'userService', 'Toast'];

  /* @ngInject */
  function SettingsCtrl(adminUserService, userService, Toast) {
    var vm = this;
    vm.title = 'SettingsCtrl';

    var currentUser = userService.currentUser();

    vm.updateUser = (user) => {
      adminUserService.updateUser(user)
        .then( (user) => {
          Toast.show({
            content: 'Saved',
            type: 'success'
          });
        });
    };

    activate();

    ////////////////

    function activate() {
      adminUserService.getUser(currentUser._id)
        .then( (user) => {
          vm.user = user;
        });
    }
  }
})();
