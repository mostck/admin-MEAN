(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('dialogService', dialogService);

  /* ngInject */
  function dialogService($translate, $mdDialog) {
    const translate = $translate.instant;

    let confirmRemoveItem = (ok, cancel) => {
      var confirm = $mdDialog.confirm()
        .title(translate('confirm.removeItem.title'))
        .textContent(translate('confirm.removeItem.textContent'))
        .ok(translate('button.ok'))
        .cancel(translate('button.cancel'));
      
      $mdDialog.show(confirm).then(function () {
        if (typeof ok == 'function') ok();
      }, function () {
        if (typeof cancel == 'function') cancel();
      });
    };

    let confirmLeavePage = (ok, cancel) => {
      var confirm = $mdDialog.confirm()
        .title(translate('confirm.leavePage.title'))
        .textContent(translate('confirm.leavePage.textContent'))
        .ok(translate('button.ok'))
        .cancel(translate('button.cancel'));
      
      $mdDialog.show(confirm).then(function () {
        if (typeof ok == 'function') ok();
      }, function () {
        if (typeof cancel == 'function') cancel();
      });
    };

    let confirmAdjustDuration = (ok, cancel) => {
      var confirm = $mdDialog.confirm()
        .title(translate('confirm.adjustDuration.title'))
        .textContent(translate('confirm.adjustDuration.textContent'))
        .ok(translate('button.ok'))
        .cancel(translate('button.cancel'));
      
      $mdDialog.show(confirm).then(function () {
        if (typeof ok == 'function') ok();
      }, function () {
        if (typeof cancel == 'function') cancel();
      });
    };

    const dialogConfig = {
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      escapeToClose: true,
      controllerAs: 'vm'
    };

    function dialogSupplier(supplier) {
      return $mdDialog.show(angular.extend({}, dialogConfig, {
        controller: 'AdminProjectDialogSupplierCtrl',
        templateUrl: 'app/admin/projects/dialogs/supplier/dialogSupplier.html',
        locals: { supplier }
      }));
    }

    function objectDialog(object) {
      return $mdDialog.show(angular.extend({}, dialogConfig, {
        controller: 'ObjectDialogCtrl',
        templateUrl: 'app/admin/projects/dialogs/object/objectDialog.html',
        locals: { object }
      }));
    }

    function cruRecordDialog(record, deviceId, state) {
      return $mdDialog.show(angular.extend({}, dialogConfig, {
        controller: 'cruRecordDialogCtrl',
        templateUrl: 'app/cru/cruRecordDialog.html',
        locals: {
          record,
          deviceId,
          state
        }
      }));
    }

    return {
      confirmRemoveItem     : confirmRemoveItem,
      confirmLeavePage      : confirmLeavePage,
      confirmAdjustDuration : confirmAdjustDuration,
      dialogSupplier        : dialogSupplier,
      objectDialog          : objectDialog,
      cruRecordDialog       : cruRecordDialog
    };
  }
})();