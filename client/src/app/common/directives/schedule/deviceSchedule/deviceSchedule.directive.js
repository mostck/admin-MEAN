(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .directive('deviceSchedule', deviceSchedule);

  deviceSchedule.$inject = [];

  /* @ngInject */
  function deviceSchedule() {
    // Usage:
    //
    // Creates:
    //
    var directive = {
      bindToController: true,
      controller: Controller,
      controllerAs: 'ds',
      templateUrl: 'app/common/directives/schedule/deviceSchedule/deviceSchedule.html',
      restrict: 'AE',
      scope: {
        scheduleData: "="
      }
    };
    return directive;
  }

  /* @ngInject */
  function Controller($scope, $translate) {
    const vm = this,
      duration = getDuration(vm.scheduleData),
      translate = $translate.instant;
    vm.options = {
      currentDate     : 'column',
      // columnWidth  : 25,
      // rowContent   : '{{row.model.title}}',
      // autoExpand   : true,
      // columnMagnet : '1 day',
      headersFormats : {
        month: c => moment(c.date).format('MMMM')
      },
      daily           : true,
      expandToFit     : true,
      shrinkToFit     : true,
      readOnly        : true,
      // fromDate                : scheduleOpts && scheduleOpts.fromDate && new Date(scheduleOpts.fromDate),
      // toDate                  : scheduleOpts && scheduleOpts.toDate && new Date(scheduleOpts.toDate),
      viewScale       : duration.asMonths() > 2 ? 'month' : duration.asWeeks() > 4 ? 'week' :  'day',
      tooltip: {
        content: `{{task.model.name}}</br>
                  <small>
                    {{task.isMilestone() === true && getFromLabel() || getFromLabel() + \' - \' + getToLabel()}}
                  </small>`
      }
    };

    // vm.headersFormats = {
    //   month: c => moment(c.date).format('MMMM')
    // };

    // vm.registerApi = function(api) {
    //   $scope.api = api;
    //   // api.core.on.ready($scope, function () {
    //   // });
    // }

    $scope.$on('changeLanguage', (event, locale) => {
      vm.options.headersFormats.month = c => moment(c.date).locale(locale).format('MMMM');
    });

    vm.data = getData(vm.scheduleData);

    $scope.$watch(()=> vm.scheduleData, (data) => {
      vm.data = getData(data);
    });


    function getData(data) {
      return [{
        name: 'Device schedule',
        tasks: data.map(p => {
          return angular.extend({}, p, {
            name: p.project ? `Project: ${p.project.name} -- Object: ${p.object.name}` : 'Service',
            color: p.project ? '#689db0' : '#c23e00',
            tooltips: {
              dateFormat: 'DD/MM/YYYY'
            }
          });
        })
      }];
    }

    function getDuration(data) {
      let bounds = {
        min: null,
        max: null
      };
      
      data.forEach(item => {
        bounds.min = bounds.min ? moment.min(item.from, bounds.min) : item.from;
        bounds.max = bounds.max ? moment.max(item.to, bounds.max) : item.to;
      });

      return moment.duration(bounds.max - bounds.min, 'ms');
    }
  }
})();