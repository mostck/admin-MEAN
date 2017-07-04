(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminCompaniesAllCtrl', AdminCompaniesAllCtrl);

  AdminCompaniesAllCtrl.$inject = ['$state', 'adminCompanyService', 'dialogService'];

  function AdminCompaniesAllCtrl($state, adminCompanyService, dialogService) {
    var vm = this;

    vm.query = {
      order: 'name',
      limit: 10,
      page: 1
    };

    adminCompanyService.getAllCompanies()
      .then((companies) => {
        vm.getAllCompanies = companies;
      });

    vm.remove = (company) => {
      let ok = () => {
        vm.getAllCompanies.splice(vm.getAllCompanies.indexOf(company), 1);
        adminCompanyService.removeCompany(company._id);
      };
      dialogService.confirmRemoveItem(ok);
    };

    vm.update = (id) => {
      $state.go("superAdmin.companies.update", {id: id});
    };

  }
})();