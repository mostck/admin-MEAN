(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminUsersCreateCtrl', AdminUsersCreateCtrl);

  /* ngInject */
  function AdminUsersCreateCtrl(
    $scope,
    $state,
    adminCompanyService,
    adminUserService,
    adminCustomerService,
    configService,
    userService
  ) {
    var vm = this;

    vm.user = {};
    vm.user.permissions = configService.permissionsEmployee;
    vm.userRoles = configService.userRoles;
    vm.currentUser = userService.currentUser();
    vm.state = 'create';
    vm.routerState = $state.current.name;

    adminCompanyService.getAllCompanies()
      .then(companies => {
        vm.getAllCompanies = companies;
      });

    adminCustomerService.getAllCustomers()
      .then((customers) => {
        vm.customers = customers;
      });

    adminUserService.getAllPmsAdmin()
      .then(function (pms) {
        vm.pmsAdmin = pms;
      });

    vm.save = (user) => {
      user.companyId = vm.currentUser.companyId;
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
