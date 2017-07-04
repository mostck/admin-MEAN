(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminCompaniesCreateCtrl', AdminCompaniesCreateCtrl);

  AdminCompaniesCreateCtrl.$inject = ['$state', 'adminCompanyService', 'Upload', 'configService', 'CompanyModel'];

  function AdminCompaniesCreateCtrl($state, adminCompanyService, Upload, configService, CompanyModel) {
    var vm = this;

    vm.state = 'create';

    vm.daysOfWeek = configService.daysOfWeek;

    var company = {
      officeTime: {
        startTime: '8:00',
        endTime: '17:00',
        daysOfWeek: [1, 2, 3, 4, 5]
      },
      reminderTime: '12:00',
      reminderProjTime: '12:00',
      operationsServiceTime: 100,
      periodicServiceTime: 1000
    };

    vm.company = new CompanyModel(company);

    vm.saveCompany = (company) => {
      adminCompanyService.createCompany(company)
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
