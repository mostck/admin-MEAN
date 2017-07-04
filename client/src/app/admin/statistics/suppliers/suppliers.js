(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .controller('AdminStatisticsSuppliersCtrl', AdminStatisticsSuppliersCtrl);

  AdminStatisticsSuppliersCtrl.$inject = ['adminStatisticsService', '$translate'];

  function AdminStatisticsSuppliersCtrl(adminStatisticsService, $translate) {
    var vm = this;

    vm.query = {
      statistic: 'name',
      limit: 10,
      page: 1
    };



    vm.startDate = new Date();
    vm.startDate.setDate(vm.startDate.getDate() - 7);
    vm.endDate = new Date();

    vm.myChartObject = {};

    vm.myChartObject.type = "BarChart";
    vm.myChartObject.options = {
      // 'title': 'Bar chart amount of ton',
      colors: ['#1b9e77', '#d95f02', '#7570b3']
    };

    function prepareStatistics(statistics) {
      if(!statistics) return;
      vm.export = [];
      var rows = [];
      statistics.forEach((stat) => {
        rows.push({c:[
          {v: stat.supplier.companyName},
          {v: stat.amountOfTons}
        ]});
        vm.export.push({username: stat.supplier.username, amountOfTons: stat.amountOfTons})
      });
      vm.statistics = statistics;

      $translate(['statistics.name', 'statistics.amountOfTons'])
        .then(res => {
          vm.myChartObject.data = {"cols": [
            {id: "s", label: res['statistics.name'], type: "string"},
            {id: "t", label: res['statistics.amountOfTons'], type: "number"}
          ], "rows": rows};
        });
    }

    vm.getBySupplier = () => {
      adminStatisticsService.getBySupplier(vm.startDate, vm.endDate)
        .then((orders) => {
          prepareStatistics(orders);
        });
    };

    vm.getBySupplier();
  }
})();
