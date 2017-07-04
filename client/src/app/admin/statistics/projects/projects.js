(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminStatisticsProjectsService', AdminStatisticsProjectsService);

  AdminStatisticsProjectsService.$inject = ['adminStatisticsService', '$translate'];

  function AdminStatisticsProjectsService(adminStatisticsService, $translate) {
    var vm = this;

    vm.query = {
      statistic: 'name',
      limit: 10,
      page: 1
    };

    vm.myChartObject = {};

    vm.myChartObject.type = "BarChart";
    vm.myChartObject.options = {
      // 'title': 'Bar chart amount of ton',
      colors: ['#1b9e77', '#d95f02', '#7570b3']
    };

    function prepareStatistics(statistics) {
      if(!statistics) return;
      var rows = [];
      vm.export = [];
      statistics.forEach((stat) => {
        rows.push({c:[
          {v: stat.name},
          {v: stat.amountOfTons},
          {v: stat.operationHours},
          {v: stat.days}
        ]});
        vm.export.push({name: stat.name, amountOfTons: stat.amountOfTons, operationHours: stat.operationHours, days: stat.days})
      });
      vm.statistics = statistics;

      $translate(['statistics.name', 'statistics.amountOfTons', 'statistics.operationHours', 'statistics.days'])
        .then(res => {
          vm.myChartObject.data = {"cols": [
            {id: "s", label: res['statistics.name'], type: "string"},
            {id: "t", label: res['statistics.amountOfTons'], type: "number"},
            {id: "o", label: res['statistics.operationHours'], type: "number"},
            {id: "d", label: res['statistics.days'], type: "number"}
          ], "rows": rows};
        });
    }

    vm.changeProject = () => {
      if(vm.chosenProject) {
        prepareStatistics(vm.chosenProject.objects);
      } else {
        prepareStatistics(vm.projects);
      }
    };

    vm.changeObject = () => {

      if(vm.chosenObject) {
        prepareStatistics(vm.chosenObject.silos);
      } else {
        prepareStatistics(vm.chosenProject.objects);
      }
    };

    vm.getByProject = () => {
      adminStatisticsService.getByProject()
        .then((projects) => {
          vm.projects = projects;
          prepareStatistics(projects);
        });
    };

    vm.getByProject();
  }
})();
