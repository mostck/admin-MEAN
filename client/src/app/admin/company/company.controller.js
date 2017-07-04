(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminCompanyCtrl', AdminCompanyCtrl);


  /* @ngInject */
  function AdminCompanyCtrl(
    $rootScope,
    $scope,
    adminCompanyService,
    $stateParams,
    Upload,
    configService,
    Toast,
    CompanyModel
  ) {
    var vm = this;
    vm.title = 'AdminCompanyCtrl';

    vm.state = 'update';

    vm.daysOfWeek = configService.daysOfWeek;

    vm.saveCompany = (company) => {
      adminCompanyService.updateCompany(company)
        .then(() => {
          $rootScope.$broadcast('user.authenticate', true);
          Toast.show({
            content: 'Saved',
            type: 'success'
          });
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

    $scope.$watch('vm.upload_form.file.$error.maxSize', (maxSize) => {
      vm.upload_form.fileName.$setValidity('maxSize', !maxSize);
    });
    
    vm.upload = (file) => {
      Upload.upload({
        url: configService.getApiUri + '/upload',
        data:{file:file}
      }).then( (resp) => {
        if(resp.data.error_code === 0){
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

    activate();

    ////////////////

    function activate() {
      adminCompanyService.getCompany()
        .then( (company) => {
          vm.company = new CompanyModel(company);
        });
    }
  }
})();
