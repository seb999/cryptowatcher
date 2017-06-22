myApp.factory('cryptoApiService', function ($http) {

    var macroBitApiService = {};

    macroBitApiService.getPoloniexData = function () {
        return $http({
            url: "/api/Poloniex",
            method: "GET",
        })
    }

    macroBitApiService.getPoloniexChartData = function () {
        return $http({
            url: "/api/Poloniex/GetChartData/",
            method: "GET",
        })
    }

    return macroBitApiService;
});