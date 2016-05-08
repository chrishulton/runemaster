angular
    .module('runemaster', [
        'ngRoute',
        'ngResource',
        'templates',
        'ui.bootstrap',
        'LocalStorageModule',
    ]).config(function ($routeProvider, $locationProvider, localStorageServiceProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'home.html',
                controller: 'HomeCtrl as mainVm'
            });
        $locationProvider.html5Mode({
          enabled: true,
          requireBase: false
        });

        localStorageServiceProvider.setPrefix('runemaster');
    });

