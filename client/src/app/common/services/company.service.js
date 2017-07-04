(function() {
  'use strict';
  /* jshint validthis: true */

  angular
    .module('heaterSiloM2M')
    .service('companyService', companyService);

  /* ngInject */
  function companyService($q, CompanyModel) {
    let company,
      deferred = $q.defer();

    this.setCompany = setCompany;
    this.getCompany = getCompany;
    this.getCompanySync = getCompanySync;
    ////////////////
    function setCompany(c) {
      company = new CompanyModel(c);
      deferred.resolve(company);
    }

    function getCompany() {
      return deferred.promise;
    }

    function getCompanySync() {
      return company;
    }

  }
})();