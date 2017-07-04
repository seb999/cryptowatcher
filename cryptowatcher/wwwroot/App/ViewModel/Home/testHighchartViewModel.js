myApp.controller('testHighchartController', function ($scope, $log, $http, $window, $timeout, $uibModal, cryptoApiService) {

    $scope.isSecondLoad = false;
    $scope.loaderVisibility = false;
    $scope.showChart = false;

    $scope.currencyName = "BTC_BTS";
    $scope.chartType = 'candlestick';
    $scope.showRsi = false;

    $scope.indicatorRsi = {
        id: 'abc',
        type: 'rsi',
        lineWidth: 1,
        params: {
            period: 14,
            overbought: 70,
            oversold: 30
        },
        styles: {
            lineWidth: 1,
            stroke: '#005EA4',
            dashstyle: 'solid'
        },
        yAxis: {
            lineWidth: 2,
            title: {
                text: 'RSI',
            },
            labels: {
                align: 'right',
                x: -3
            },
        }
    };

    $scope.indicatorAtr = {
        id: 'abc',
        type: 'atr',
        params: {
            period: 14
        },
        styles: {
            strokeWidth: 2,
            stroke: 'orange',
            dashstyle: 'solid'
        },
        yAxis: {
            lineWidth: 2,
            title: {
                text: 'ATR'
            }
        }
    }
    
    $scope.indicatorSma = {
        id: 'abc',
        type: 'sma',
        params: {
            period: 14
        }
    }
    
    $scope.indicatorEma =  {
        id: 'abc',
        type: 'ema',
        params: {
            period: 14,
            index: 0 //optional parameter for ohlc / candlestick / arearange - index of value
        },
        styles: {
            strokeWidth: 1,
            stroke: '#93959B',
            dashstyle: 'solid',
        }
    }
    
    //-----------------highchart---------------------
    $scope.loadChartData = function () {
        cryptoApiService.getPoloniexChartData($scope.currencyName).then(function (response) {    
            $scope.chartVolume = [];
            $scope.chartValue = [];          
            for (var i = 0; i < response.data.length; i++) {
                $scope.chartVolume.push([response.data[i].date * 1000, response.data[i].volume]);
                $scope.chartValue.push([response.data[i].date * 1000, response.data[i].open, response.data[i].high, response.data[i].low, response.data[i].close, response.data[i].volume]);
            }
            $scope.displayChart();
        }, function (error) {
            $log.error(error.message);
        });
    };

    $scope.showIndicator = function () {
        $scope.chartIndicators = [];
        if($scope.showRsi) $scope.chartIndicators.push($scope.indicatorRsi);
        if($scope.showAtr) $scope.chartIndicators.push($scope.indicatorAtr);
        if($scope.showSma) $scope.chartIndicators.push($scope.indicatorSma);
        if($scope.showEma) $scope.chartIndicators.push($scope.indicatorEma);
        $scope.loadChartData();
    };

    $scope.displayChart = function () {
        //$scope.chartLoading = true;
        $scope.chartTitle = $scope.currencyName;

        $scope.chartData = [];
        $scope.chartData.push({
            id: 'abc',
            name: $scope.currencyName,
            data: $scope.chartValue,
            type: $scope.chartType,
            yAxis: 0,
            dataGrouping: {
                units: groupingUnits
            }
        });
        $scope.chartData.push({
            name: 'volume',
            data: $scope.chartVolume,
            type: 'column',
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        });
    };



    groupingUnits = [[
        'day',                         // unit name
        [1]                             // allowed multiples
    ]];

    $scope.loadChartData();
});