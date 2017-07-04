(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminProjectsEditCtrl', ProjectsEdit);

  /* @ngInject */
  function ProjectsEdit(
    $scope,
    $state,
    $stateParams,
    $timeout,
    adminUserService,
    adminProjectService,
    adminCustomerService,
    dialogService,
    Schedule,
    Project,
    Toast,
    $translate,
    ganttDebounce
  ) {
    var vm = this,
      debounce = ganttDebounce;

    vm.title = 'AdminProjectsEditCtrl';

    vm.state = $state.current.name.split('.').slice(-1)[0];
    vm.changed = false;
    vm.saveProject = () => {
      const action = vm.state === 'update' ? 'update': 'create';

      adminProjectService[action](vm.project)
        .then( (res) => {
          Toast.success('alert.' + action + 'd');
          if (vm.state === 'create') {
            $state.go('admin.projects.update', {id: res._id});
          }
          setProjectChangedWatcher();
        })
        .catch( (err) => {
          // duplicate key error
          if (err.data.code === 11000) {
            $scope.projectForm.projectName.$setValidity('unique', false);
            Toast.error('project.toast.name_exists');
          }
        });
    };

    vm.createObjectDialog = () => {
      dialogService.objectDialog()
        .then( obj => {
          if (obj) {
            vm.project.addObject(obj);
            Schedule.updateChartData();
          }
        });
    };

    vm.updateObjectDialog = (object) => {
      dialogService.objectDialog(angular.copy(object))
        .then( obj => {
          if (obj) {
            vm.project.updateObject(obj);
            Schedule.updateChartData();
          }
        });
    };

    vm.removeObject = (object) => {
      let ok = () => {
        vm.project.removeObject(object.uuid);
        Schedule.updateChartData();
      };
      dialogService.confirmRemoveItem(ok);
    };

    // vm.updateProjectDate = () => {
    //   vm.project.updateChildren();
    //       console.log('update children in eventHandler');

    // };

    $scope.$watch( () => vm.project && vm.project.name, () => {
      if ( $scope.projectForm.projectName.$invalid ) {
        $scope.projectForm.projectName.$setValidity('unique', true);
      }
    });

    $scope.$watchGroup([
        () => vm.project && vm.project.startDate,
        () => vm.project && vm.project.endDate
      ],
      debounce( ([startDate,endDate]) => {
        if (startDate && endDate) {
          if (startDate && startDate > vm.project.endDate) {
            vm.project.to = moment(startDate);
          }
          vm.project.updateChildren();
          if (Schedule.ready) Schedule.updateChartData();
        }
    }), 100);

    function setProjectChangedWatcher() {
      let init = true,
        offProjectChangedWatcher = $scope.$watch( 
        () => JSON.stringify(vm.project),
        () => {
          if (init) {
            $timeout(() => { init = false; }, 1000);
          } else {
            if (!init) {
              vm.changed = true;
              offProjectChangedWatcher();
            }
          }
        });
      vm.changed = false;
    }

    activate();

    ////////////////

    function activate() {
      adminUserService.getAllEmployees()
        .then(function (employees) {
          vm.employees = employees;
        });

      adminUserService.getAllPms()
        .then(function (pms) {
          vm.pms = pms;
        });

      adminCustomerService.getAllCustomers()
        .then(function (customers) {
          vm.customers = customers;
        });

      setProjectChangedWatcher();
  
      if (vm.state === 'create') {
        vm.project = new Project({
          startDate: moment().add(1, 'd').toDate(),
          endDate: moment().add(1, 'w').toDate(),
          objects: []
        });
      } else {
        adminProjectService.get($stateParams.id)
        .then( (data) => {
          if (data) {
            vm.project = new Project(data);

            if (vm.state === 'copy') {
              delete vm.project._id;
              vm.project.name = vm.project.name + ' (copy)';
            }
          }
        })
        .catch(() => { $state.go('404', {}, {location: "replace"}); });
      }
    }

    let offStateChangeStart = $scope.$on('$stateChangeStart', stateChangeStartHandler);
    function stateChangeStartHandler(evt, toState) {
      if (vm.changed && vm.state != 'create') {
        offStateChangeStart();
        evt.preventDefault();
        dialogService.confirmLeavePage(
          () => $state.go(toState.name),
          () => offStateChangeStart = $scope.$on('$stateChangeStart', stateChangeStartHandler)
        );
      }
    }
  }
})();