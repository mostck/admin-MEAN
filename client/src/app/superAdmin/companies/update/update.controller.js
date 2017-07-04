(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminCompaniesUpdateCtrl', AdminCompaniesUpdateCtrl);

  AdminCompaniesUpdateCtrl.$inject = ['$state', 'adminCompanyService', '$stateParams', 'Upload', 'configService', 'CompanyModel'];

  function AdminCompaniesUpdateCtrl($state, adminCompanyService, $stateParams, Upload, configService, CompanyModel) {
    var vm = this;

    vm.state = 'update';

    vm.companyId = $stateParams.id;
    if (!vm.companyId) $state.go("superAdmin.companies.all");

    vm.daysOfWeek = configService.daysOfWeek;

    adminCompanyService.getAllCompanies()
      .then((companies) => {
        vm.getAllCompanies = companies;
        var company = vm.getAllCompanies.find((comp) => {
          return comp._id == vm.companyId;
        });
        vm.company = new CompanyModel(company);
      });

    vm.saveCompany = (company) => {
      adminCompanyService.updateCompany(company)
        .then(() => {
          $state.go("superAdmin.companies.all");
        });
    };

    vm.submit = () => {
      if (vm.upload_form.file.$valid && vm.file) {
        vm.upload(vm.file);
      }
    };

    vm.selectFile = () => {
      document.querySelector('.upload-logo').click();
    };

    vm.upload = (file) => {
      Upload.upload({
        url: configService.getApiUri + '/upload',
        data: {file: file}
      }).then((resp) => {
        if (resp.data.error_code === 0) {
          vm.company.logo = configService.getApiUri + '/uploads/' + resp.data.file.filename;
          vm.file = null;
        } else {
          console.log('an error occured');
        }
      }, (resp) => {
        console.log('Error status: ' + resp.status);
      }, (evt) => {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        vm.progress = 'progress: ' + progressPercentage + '% ';
      });
    };

  }
})();
