(function() {
  'use strict';

  angular
    .module('heaterSiloM2M')
    .factory('userService', userService);

  /* ngInject */
  function userService(
    $http,
    $cookies,
    $window,
    configService,
    $rootScope,
    $deepStateRedirect,
    adminCompanyService,
    companyService
  ) {

    var saveToken = function (token) {
      $cookies.put("token", token);
    };

    var getToken = function () {
      return $cookies.get("token");
    };


    var isLoggedIn = function () {
      var token = getToken();

      return !!token;
    };

    var getPayload = function () {
      const token = getToken();
      let payload = token.split('.')[1];

      payload = $window.atob(payload);

      return JSON.parse(payload);
    };

    var currentUser = function () {
      if (isLoggedIn()) {
        return getPayload();
      }
    };

    var getUserRole = function () {
      if (isLoggedIn()) {
        return getPayload().roleId;
      }
    };

    var getUserPermisions = function () {
      if (isLoggedIn()) {
        return getPayload().permissions;
      }
    };


    var ping = function () {
      return $http.get(configService.getApiUri + '/ping')
        .then(function (response) {
          return response.data;
        });
    };

    var login = function (username, password) {
      return $http.post(configService.getApiUri + '/login', {username: username, password: password})
        .then(function (response) {
          saveToken(response.data.token);
  
          const user = currentUser();

          adminCompanyService.getCompany(user.companyId)
            .then( company => {
              companyService.setCompany(company);
            });

          $rootScope.$broadcast('user.authenticate', true);

          if (user.preferredLanguage) {
            $rootScope.$broadcast('changeLanguage', user.preferredLanguage);
          }
          
          return response.data;
        });
    };

    var logout = function () {
      $deepStateRedirect.reset();
      $cookies.remove("token");
      $rootScope.$broadcast('user.authenticate', false);
    };

    var register = function (username, email, password, companyId) {
      return $http.post(configService.getApiUri + '/register', {
        username: username,
        email: email,
        password: password,
        companyId: companyId
      })
        .then(function (response) {
          return response.data;
        });
    };

    var forgot = function (username) {
      return $http.post(configService.getApiUri + '/forgot', {username: username})
        .then(function (response) {
          return response.data;
        });
    };

    var reset = function (id, password) {
      return $http.get(configService.getApiUri + '/reset/' + id)
        .then(function (response) {
          return $http.post(configService.getApiUri + '/reset/' + id, {password: password})
            .then(function (response) {
              return response.data;
            });
        });
    };

    return {
      // requireAuthenticationAndPermission: requireAuthenticationAndPermission,
      currentUser: currentUser,
      getUserRole: getUserRole,
      getUserPermisions: getUserPermisions,
      saveToken: saveToken,
      getToken: getToken,
      isLoggedIn: isLoggedIn,
      ping: ping,
      login: login,
      logout: logout,
      register: register,
      forgot: forgot,
      reset: reset
    };
  }
})();