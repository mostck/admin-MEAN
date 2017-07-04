(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminUsersUpdateCtrl', AdminUsersUpdateCtrl);

  /* ngInject */
  function AdminUsersUpdateCtrl(
    $scope,
    $state,
    $stateParams,
    configService,
    adminUserService,
    adminCompanyService,
    adminCustomerService,
    userService,
    user
  ) {
    var vm = this;

    vm.state = 'update';
    vm.routerState = $state.current.name;
    
    vm.currentUser = userService.currentUser();

    vm.userRoles = configService.userRoles;

    vm.user = angular.extend({}, user, {
      permissions: user.permissions || configService.permissionsEmployee
    });

    adminCompanyService.getAllCompanies()
      .then(companies => {
        vm.getAllCompanies = companies;
      });

    adminCustomerService.getAllCustomers()
      .then( (customers) => {
        vm.customers = customers;
      });

    adminUserService.getAllPmsAdmin()
      .then(function (pms) {
        vm.pmsAdmin = pms.filter((p) => {
          return p._id != vm.userId;
        });
      });

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
