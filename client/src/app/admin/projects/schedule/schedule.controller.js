(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminScheduleCtrl', AdminScheduleCtrl);

  AdminScheduleCtrl.$inject = [
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
    'Project'
  ];

  /* @ngInject */
  function AdminScheduleCtrl(
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
    Project
  ) {
    const vm = this;
    let scheduleOpts = sessionStorageService.get('scheduleOpts');

    vm.title = 'AdminScheduleCtrl';
    vm.options = {
      currentDate             : 'none',
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
      readOnly                : true,
      headersFormats : {
        month: c => moment(c.date).format('MMMM')
      },
      tooltip: {
        content: `{{task.model.title}}</br>
                  <small>
                    {{task.isMilestone() === true && getFromLabel() || getFromLabel() + \' - \' + getToLabel()}}
                  </small>`
      },
      filterRow(row) {
        const gantt = row.rowsManager.gantt;
        // show projects that there are only in range of a chart
        return gantt.getPositionByDate(row.to) > 0 &&
          gantt.getPositionByDate(row.from) < gantt.width;
      }
    };

    vm.projects = [];

    ////////////////

    activate();

    function activate(cb) {
      vm.isChanged = false;

      adminDeviceService.getAllSilos()
        .then((silos) => {
          vm.silosLength = silos.length;
          adminProjectService.getAllProjects().then(projects => {
            vm.projects.length = 0;
            vm.projects = projects
              .map(project => new Project(project))
              .sort((a, b) => a.from - b.from);

            if (cb) cb();
          });
        });
    }

    vm.refresh = () => activate(Schedule.refresh.bind(Schedule));

    $scope.$watchGroup([
      () => vm.options.fromDate,
      () => vm.options.toDate,
      () => vm.options.scale
      ], ([fromDate, toDate, scale]) => {
        sessionStorageService.set('scheduleOpts', {fromDate, toDate, scale});
    });
  }
})();