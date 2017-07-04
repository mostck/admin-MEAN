(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('ProjectCtrl', ProjectCtrl);

  ProjectCtrl.$inject = [
    '$scope',
    '$state',
    '$rootScope',
    '$q',
    'sessionStorageService',
    'adminProjectService',
    'adminDeviceService',
    'Schedule',
    'Toast',
    'ganttDebounce',
    'dialogService',
    'Project',
    '$translate',
    'project'
  ];

  /* @ngInject */
  function ProjectCtrl(
    $scope,
    $state,
    $rootScope,
    $q,
    sessionStorageService,
    adminProjectService,
    adminDeviceService,
    Schedule,
    Toast,
    debounce,
    dialogService,
    Project,
    $translate,
    project
  ) {
    const vm = this;
    let scheduleOpts = sessionStorageService.get('projectScheduleOpts');

    vm.title = 'ProjectCtrl';

    vm.allowResizing = {
      past: 0,
      future: 0
    };
    vm.options = {
      // currentDate             : 'column',
      // currentDateValue        : new Date(),
      treeTableColumns        : [],
      width                   : 800,
      columnWidth             : 25,
      rowContent              : '{{row.model.title}}',
      taskContent             : '{{task.model.title}}',
      groupDisplayMode        : 'group',
      taskOutOfRange          : 'none',
      // autoExpand           : true,
      columnMagnet            : '1 day',
      daily                   : true,
      allowSideResizing       : false,
      keepAncestorOnFilterRow : true,
      expandToFit             : true,
      shrinkToFit             : false,
      sideWidth               : 200,
      fromDate                : scheduleOpts && scheduleOpts.fromDate && new Date(scheduleOpts.fromDate),
      toDate                  : scheduleOpts && scheduleOpts.toDate && new Date(scheduleOpts.toDate),
      scale                   : scheduleOpts && scheduleOpts.scale || 'day',
      readOnly                : !vm.allowResizing.past || !vm.allowResizing.future,
      hideActions: true,
      headersFormats : {
        month: c => moment(c.date).format('MMMM')
      },
      tooltip: {
        content: `{{task.model.title}}</br>
                  <small>
                    {{task.isMilestone() === true && getFromLabel() || getFromLabel() + \' - \' + getToLabel()}}
                  </small>`
      }
    };

    vm.resetChart = () => {
      // vm.project = new Project( originProject );
       Schedule.reset();
    };

    ////////////////

    activate();

    function activate(cb) {
      vm.isChanged = false;

      // adminProjectService.get($state.params.id).then(project => {
        // vm.projects.length = 0;
      vm.project = new Project(project);
      vm.allowResizing.future = vm.project.reminderDate;
      if (cb) cb();
      // });


    }

    vm.confirm = () => {
      adminProjectService.confirm(vm.project._id)
        .then(project => {
          vm.project.reminderDate = project.reminderDate;
          vm.allowResizing.future = vm.project.reminderDate;
          $translate('project.toast.confirmEndProj')
            .then((message) => {
              Toast.show({
                content: message,
                type: 'success'
              });
            });
        });
    };

    vm.prolong = () => {
      adminProjectService.prolong(vm.project)
        .then(project => {
          vm.project.reminderDate = project.reminderDate;
          vm.allowResizing.future = vm.project.reminderDate;
          $translate('project.toast.prolongEndProj')
            .then((message) => {
              Toast.show({
                content: message,
                type: 'success'
              });
            });
        });
    };

    $scope.$watchGroup([
      () => vm.options.fromDate,
      () => vm.options.toDate,
      () => vm.options.scale
      ], ([fromDate, toDate, scale]) => {
        sessionStorageService.set('projectScheduleOpts', {fromDate, toDate, scale});
    });

  }
})();