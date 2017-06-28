myApp.controller('testHighchartController', function ($scope, $log, $http, $window, $timeout, $uibModal, cryptoApiService) {

    $scope.isSecondLoad = false;
    $scope.loaderVisibility = false;
    $scope.showChart = false;
    $scope.chartType = 'line';

    $scope.currencyName = "BTC_BTS";
    $scope.chartType = 'line';

    //-----------------highchart---------------------
    groupingUnits = [[
        'day',                         // unit name
        [1]                             // allowed multiples
    ]],

    $scope.chartConfig = {
        chart: {
            zoomType: 'x'
        },
        chartType: 'stock',
        title: {
            text: ''
        },
        series: [{
            cropThreshold: 0,
            id: 'abc',
            name: 'abc',
            data: [],
            tooltip: {
                valueDecimals: 2
            }
        }],
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
        //indicators: [{
        //    id: 'abc',
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
    }



    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=aapl-ohlcv.json&callback=?', function (data123) {


        $scope.chartConfig.series[0].type = 'candlestick';
        $scope.chartConfig.series[0].data = data123;

        console.log($scope.chartConfig.series[0]);
   

        //$scope.chartConfig.series = [];
        //$scope.chartConfig.series[0] = ({
        //    id: 'abc',
        //    data: data,
        //    type: 'candlestick',
        //    yAxis: 0,
        //    dataGrouping: {
        //        units: groupingUnits
        //    }
        //});

    });



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

    $scope.displayChart = function (currencyName) {
        $scope.chartConfig.loading = false;

        console.log($scope.chartConfig.series[0]);

        $scope.chartConfig.series[0].type = 'candlestick';
        $scope.chartConfig.series[0].data = $scope.chartData;

        //$scope.chartConfig.series.push({
        //    id: 'abc',
        //    data: $scope.chartData,
        //    type: $scope.chartType,
        //    yAxis: 0,
        //    dataGrouping: {
        //        units: groupingUnits
        //    }
        //});

        //$scope.chartConfig.series.push({
        //    name: 'volume',
        //    data: $scope.chartVolume,
        //    type: 'column',
        //    yAxis: 1,
        //    dataGrouping: {
        //        units: groupingUnits
        //    }
        //});
    };







   $scope.loadChartData();


});