(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('UserLoginCtrl', UserLoginCtrl);

  UserLoginCtrl.$inject = ['userService', '$state', '$stateParams'];

  function UserLoginCtrl(userService, $state, $stateParams) {
    var vm = this;

    vm.loginUser = (username, password) => {
      userService.login(username, password)
        .then( (res) => {
          // vm.redirectTo = $stateParams.redirectTo || (userService.getUserRole() == 1) ? 'superAdmin' : ((userService.getUserRole() == 2) ? 'admin' : 'myAccount.settings');
          // vm.redirectToParams = $stateParams.redirectToParams;
          // $state.go(vm.redirectTo, vm.redirectToParams);
          let roleId = userService.getUserRole(),
          state = roleId === 1 ? 'superAdmin' :
                  roleId === 2 ? 'admin' :
                  ~[5,6].indexOf(roleId) ? 'pm.projects' :
                  roleId === 4 ? 'supplier.silos' : 'myAccount';

          vm.redirectTo = state;

          $state.go(state);
        }).catch( () => {
          vm.warning = true;
        });
    };
  }
})();