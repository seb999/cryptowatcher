myApp.factory('cryptoApiService', function ($http) {

    var macroBitApiService = {};

    macroBitApiService.getPoloniexData = function (isIndicatorAdded) {
        return $http({
            url: "/api/Poloniex/" + isIndicatorAdded,
            method: "GET",
        })
    }

    macroBitApiService.getPoloniexChartData = function (currencyName) {
        return $http({
            url: "/api/Poloniex/GetChartData/" + currencyName,
            method: "GET",
        })
    }

    return macroBitApiService;
});