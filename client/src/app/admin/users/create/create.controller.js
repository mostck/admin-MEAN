(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminUsersCreateCtrl', AdminUsersCreateCtrl);

  /* ngInject */
  function AdminUsersCreateCtrl(
    $scope,
    $state,
    adminUserService,
    configService,
    userService
  ) {
    var vm = this;

    vm.user = {};
    vm.userRoles = configService.userRoles;
    vm.currentUser = userService.currentUser();
    vm.state = 'create';
    vm.routerState = $state.current.name;

    vm.save = (user) => {
      adminUserService.createUser(user)
        .then(() => {
          $state.go("admin.users.all");
        })
        .catch((err) => {
          $scope.userForm.email.$setValidity('unique', false);
        });
    };

    $scope.$watch(() => vm.user.username, () => {
      if ($scope.userForm.email.$invalid) {
        $scope.userForm.email.$setValidity('unique', true);
      }
    });
  }
})();
