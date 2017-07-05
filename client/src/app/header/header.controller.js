(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('HeaderCtrl', HeaderCtrl);

  /* ngInject */
  function HeaderCtrl($rootScope, userService) {
    var vm = this;

    function activate() {
      var currentUser = userService.currentUser();
      vm.username = currentUser && (currentUser.username || currentUser.name);
      vm.isLoggedIn = userService.isLoggedIn();
    }

    activate();

    $rootScope.$on('user.authenticate', (event, bool) => {
      if (bool) {
        activate();
      }
    });

  }
})();
