(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminUsersUpdateCtrl', AdminUsersUpdateCtrl);

  /* ngInject */
  function AdminUsersUpdateCtrl(
    $scope,
    $state,
    configService,
    adminUserService,
    userService
  ) {
    var vm = this;

    vm.state = 'update';
    vm.routerState = $state.current.name;
    
    vm.currentUser = userService.currentUser();

    vm.userRoles = configService.userRoles;

    vm.save = (user) => {
      adminUserService.updateUser(user)
        .then( () => {
          $state.go("admin.users.all");
        })
        .catch( (err) => {
          $scope.userForm.email.$setValidity('unique', false);
        });
    };

    $scope.$watch( () => vm.user && vm.user.username, () => {
      if ( $scope.userForm.email.$invalid ) {
        $scope.userForm.email.$setValidity('unique', true);
      }
    });
  }
})();
