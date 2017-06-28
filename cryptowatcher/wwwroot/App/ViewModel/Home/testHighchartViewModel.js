myApp.controller('testHighchartController', function ($scope, $log, $http, $window, $timeout, $uibModal, cryptoApiService) {

    $scope.isSecondLoad = false;
    $scope.loaderVisibility = false;
    $scope.showChart = false;

    $scope.currencyName = "BTC_BTS";
    $scope.chartType = 'candlestick';

    //-----------------highchart---------------------

        $scope.chartConfig = {
            title: {
                useHTML: true,
                x: -10,
                y: 8,
                text: '<span class="chart-title">SMA, EMA, ATR, RSI indicators <span class="chart-href"> <a href="http://www.blacklabel.pl/highcharts" target="_blank"> Black Label </a> </span> <span class="chart-subtitle">plugin by </span></span>'
            },
            indicators: [ {
                id: 'AAPL',
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
            }, {
                id: 'AAPL',
                type: 'rsi',
                params: {
                    period: 14,
                    overbought: 70,
                    oversold: 30
                },
                styles: {
                    strokeWidth: 2,
                    stroke: 'black',
                    dashstyle: 'solid'
                },
                yAxis: {
                    lineWidth: 2,
                    title: {
                        text: 'RSI'
                    }
                }
            }],
            yAxis: {
                opposite: false,
                title: {
                    text: 'DATA SMA EMA',
                    x: -4
                },
                lineWidth: 2,
                labels: {
                    x: 22
                }
            },
            rangeSelector: {
                selected: 0
            },
            tooltip: {
                enabledIndicators: true
            },
            series: [{
                cropThreshold: 0,
                id: 'AAPL',
                name: 'AAPL',
                data: [],
                tooltip: {
                    valueDecimals: 2
                }
            }]
    }


    $scope.loadChartData = function () {

        $scope.chartConfig.loading = true;
        cryptoApiService.getPoloniexChartData($scope.currencyName).then(function (response) {    
           
            $scope.chartVolume = [];
            $scope.chartData = [];
            
            for (var i = 0; i < response.data.length; i++) {
                $scope.chartVolume.push([response.data[i].date * 1000, response.data[i].volume]);
                $scope.chartData.push([response.data[i].date * 1000, response.data[i].open, response.data[i].high, response.data[i].low, response.data[i].close, response.data[i].volume]);
            }

            $scope.displayChart();

        }, function (error) {
            $log.error(error.message);
        });
    };

   
    $scope.myTitle = 'sebie';
    $scope.displayChart = function (currencyName) {
        $scope.loading = ;    

        $scope.chartTitle = $scope.currencyName;

        $scope.myData = [];
        $scope.myData.push({
            id: 'abc',
            data: $scope.chartData,
            type: $scope.chartType,
            yAxis: 0,
            dataGrouping: {
                units: groupingUnits
            }
        });

        $scope.myData.push({
            name: 'volume',
            data: $scope.chartVolume,
            type: 'column',
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        });

        $timeout(function () {
            $scope.myIndicators = [{
                id: 'abc',
                type: 'sma',
                params: {
                    period: 14
                }
            }, {
                id: 'abc',
                type: 'ema',
                params: {
                    period: 14,
                    index: 0 //optional parameter for ohlc / candlestick / arearange - index of value
                },
                styles: {
                    strokeWidth: 2,
                    stroke: 'green',
                    dashstyle: 'solid'
                }
                }];

        }, 100);
        
    };


    groupingUnits = [[
        'day',                         // unit name
        [1]                             // allowed multiples
    ]];

    $scope.loadChartData();
});