myApp.factory('cryptoApiService', function ($http) {

    var cryptoApiService = {};

    cryptoApiService.getPoloniexData = function (currencyName) {
        return $http({
            url: "api/Poloniex/" + currencyName,
            method: "GET",
        })
    };

    cryptoApiService.getPoloniexHistoryChartData = function (currencyName) {
        return $http({
            url: "api/Poloniex/GetHistoryChartData/" + currencyName,
            method: "GET",
        })
    };

    cryptoApiService.getPoloniexDayChartData = function (currencyName) {
        return $http({
            url: "api/Poloniex/GetDayChartData/" + currencyName,
            method: "GET",
        })
    };

    cryptoApiService.getPoloniexOrderData = function (currencyName) {
        return $http({
            url: "api/Poloniex/GetOrderData/" + currencyName,
            method: "GET",
        })
    };

    cryptoApiService.getNewCurrencyList = function () {
        return $http({
            url: "api/Poloniex/GetNewCurrencyList/",
            method: "GET",
        })
    };

    cryptoApiService.getPoloniexCotation = function (currencyName) {
        return $http({
            url: "api/Poloniex/GetCotation/" + currencyName,
            method: "GET",
        })
    };

    return cryptoApiService;
});