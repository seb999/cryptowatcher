myApp.factory('cryptoApiService', function ($http) {

    var cryptoApiService = {};

    cryptoApiService.getPoloniexData = function (rsiPeriod, currencyName) {
        return $http({
            url: "api/Poloniex/" + rsiPeriod + "/" +  currencyName,
            method: "GET",
        })
    };

    cryptoApiService.getPoloniexHistoryChartData = function (currencyName, numberOfYear) {
        return $http({
            url: "api/Poloniex/GetHistoryChartData/" + currencyName + "/" + numberOfYear,
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

    cryptoApiService.getPoloniexCotation = function (rsiPeriod, currencyName) {
        return $http({
            url: "api/Poloniex/GetCotation/" + rsiPeriod + "/" + currencyName,
            method: "GET",
        })
    };

    return cryptoApiService;
});