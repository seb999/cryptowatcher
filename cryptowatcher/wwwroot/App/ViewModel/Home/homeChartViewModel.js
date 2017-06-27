myApp.controller('homeChartViewModel', function ($scope, $window, $http, $log, $uibModalInstance, currencyName, cryptoApiService, $uibModal) {

    $scope.currencyName = currencyName; 
    $scope.chartVolume = [];
    $scope.chartData = [];
    $scope.chartType = 'area';


    //Life start here : we load from API the data to display
    cryptoApiService.getPoloniexChartData($scope.currencyName).then(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            $scope.chartVolume.push([response.data[i].date * 1000, response.data[i].volume]);
            $scope.chartData.push([response.data[i].date * 1000, response.data[i].open, response.data[i].high, response.data[i].low, response.data[i].close]);
        }
        //$scope.chartConfig1.loading = false;
        $scope.displayChart();
    }, function (error) {
        $log.error(error.message);
    });

    //command  :close popup
    $scope.close = function () {
        $uibModalInstance.dismiss('cancel');
    };

    //Command : change chart type
    $scope.changeChartType = function (chartType) {
        $scope.chartType = chartType;
        $scope.displayChart();
    };

    //Command : display chart data
    $scope.displayChart = function (currencyName) {
        $scope.chartConfig1.loading = false;

        $scope.chartConfig1.series = [];
        $scope.chartConfig1.series.push({
            id: 'AAPL',
            name: 'AAPL',
            data: $scope.chartData,
            type: $scope.chartType,
            dataGrouping: {
                units: groupingUnits
            }
        });

        $scope.chartConfig1.series.push({
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
    ]],

    $scope.chartConfig1 = {
            chart: {
                zoomType: 'x',
                spacingTop: 15,
                spacingBottom: 15,
                spacingLeft: 15,
                spacingRight: 15,
                
            },
            chartType: 'stock',
            title: {
                text: ''
            },
            //indicators: [{
            //    id: 'AAPL',
            //    type: 'rsi',
            //    params: {
            //        period: 14,
            //        overbought: 70,
            //        oversold: 30
            //    },
            //    styles: {
            //        strokeWidth: 2,
            //        stroke: 'black',
            //        dashstyle: 'solid'
            //    },
            //    yAxis: {
            //        lineWidth: 2,
            //        title: {
            //            text: 'RSI'
            //        }
            //    }
            //}],
            series: [],
            useHighStocks: true,
            loading: true,
            options: {
                rangeSelector: {
                    enabled: true
                },
                navigator: {
                    enabled: true
                },

                colors: ['#00A1E2', '#6769B5', '#3BC3A3', '#93959B', '#2D8F78', '#C3842F', '#005EA4'],
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.y}</b>'
                },
            },
            xAxis: {
                type: 'datetime',
                title: {
                    text: 'Date'
                },
                minTickInterval: 5,
                minorTickInterval: 1
            },
           
            yAxis: [{
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: ''
                },
                height: '65%',
                lineWidth: 2
            }, {
                labels: {
                    align: 'right',
                    x: -3
                },
                title: {
                    text: 'Volume'
                },
                top: '70%',
                height: '30%',
                offset: 0,
                lineWidth: 2
            }],
            legend: {
                enabled: true
            },
        }
    $scope.chartConfig1.loading = true;

});