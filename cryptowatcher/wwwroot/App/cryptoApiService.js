myApp.factory('cryptoApiService', function ($http) {

    var cryptoApiService = {};

    cryptoApiService.getPoloniexData = function (currencyName) {
        return $http({
            url: "api/Poloniex/" + currencyName,
            method: "GET",
        })
    };

    cryptoApiService.getPoloniexChartData = function (currencyName) {
        return $http({
            url: "/api/Poloniex/GetChartData/" + currencyName,
            method: "GET",
        })
    };

    cryptoApiService.getPoloniexOrderData = function (currencyName) {
        return $http({
            url: "api/Poloniex/GetOrderData/" + currencyName,
            method: "GET",
        })
    };

    return cryptoApiService;
});