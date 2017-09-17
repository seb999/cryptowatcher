myApp
    .controller("currencyTabController", currencyTabController)
    .directive("currencyTab", currencyTab);

function currencyTabController($scope, $log, $timeout, $interval, cryptoApiService) {

    var vm = this;

    this.$onInit = function () {

        vm.currencyName = vm.name;
        $log.info("Creating dynamic tab for " + vm.name);

        vm.chartVolume = [];
        vm.chartData = [];
        vm.chartType = 'candlestick';
        vm.chartDayType = 'line';
        vm.isAutoRefrsh = true;
        vm.loaderVisibility = true;
        vm.checkBoxParent = {};
        vm.currencyCotation = {};

        // utils
        vm.loadHistoryChartData = loadHistoryChartData;
        vm.displayHistoryChart = displayHistoryChart;
        vm.loadDayChartData = loadDayChartData;
        vm.displayDayChart = displayDayChart;
        vm.getOrderData = getOrderData;
        vm.changeChartType = changeChartType;
        vm.changeChartDayType = changeChartDayType;
        vm.showIndicator = showIndicator;
        vm.drawAskBidChart = drawAskBidChart;
        vm.getCurrencyCotation = getCurrencyCotation;
        vm.autoUpdate = autoUpdate;

        //Life start here
        vm.getOrderData();
        vm.loadHistoryChartData();
        vm.loadDayChartData();
        vm.getCurrencyCotation();
        vm.autoUpdate();

        function autoUpdate() {
            $interval(getCurrencyCotation, 3000);
            $interval(getOrderData, 5000);
            $interval(loadDayChartData, 30000);
        }

        var gridColumn = [
            { headerName: "Ask quantity", field: "bidQuantity", enableFiltering: false },
            { headerName: "Ask price", field: "bidPrice", enableFiltering: false },
            { headerName: "Bid price", field: "askPrice", enableFiltering: false },
            { headerName: "Bid quantity", field: "askQuantity", enableFiltering: false },
        ];

        vm.gridOptionsOrder = {
            data: null,
            columnDefs: gridColumn,
        };

        vm.indicatorRsi = {
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

        vm.indicatorAtr = {
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

        vm.indicatorSma = {
            id: 'abc',
            type: 'sma',
            params: {
                period: 14
            }
        }

        vm.indicatorEma = {
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

        //we load from API the data to display
        function loadHistoryChartData() {
            vm.loaderVisibility = true;
            vm.chartVolume = [];
            vm.chartValue = [];
            cryptoApiService.getPoloniexHistoryChartData(vm.currencyName).then(function (response) {
                vm.loaderVisibility = false;
                for (var i = 0; i < response.data.length; i++) {
                    vm.chartVolume.push([response.data[i].date * 1000, response.data[i].volume]);
                    vm.chartValue.push([response.data[i].date * 1000, response.data[i].open, response.data[i].high, response.data[i].low, response.data[i].close]);
                }
                vm.displayHistoryChart();
            }, function (error) {
                $log.error(error.message);
            });
        };

        //we load from API the data to display
        function loadDayChartData() {
            vm.chartDayVolume = [];
            vm.chartDayValue = [];
            cryptoApiService.getPoloniexDayChartData(vm.currencyName).then(function (response) {
                for (var i = 0; i < response.data.length; i++) {
                    vm.chartDayVolume.push([response.data[i].date * 1000, response.data[i].volume]);
                    vm.chartDayValue.push([response.data[i].date * 1000, response.data[i].open, response.data[i].high, response.data[i].low, response.data[i].close]);
                }
                vm.displayDayChart();
            }, function (error) {
                $log.error(error.message);
            });
        };

        //we load from API Cotation data to display
        function getCurrencyCotation() {
        
            cryptoApiService.getPoloniexCotation(vm.currencyName).then(function (response) {

                if (vm.currencyCotation.change24hr != response.data.change24hr.toFixed(2)) {
                    vm.highlightChange = "lightgray";
                    $timeout(function () {
                        vm.highlightChange = "";
                    }, 600);
                }
                vm.currencyCotation = response.data;
                if(parseFloat(response.data.last)> 0.001)vm.currencyCotation.last = parseFloat(response.data.last).toFixed(2);        
                if(parseFloat(response.data.quoteVolume)> 0.00001)vm.currencyCotation.quoteVolume = parseFloat(response.data.quoteVolume).toFixed(0);        
                if(parseFloat(response.data.high24hr)> 0.001)vm.currencyCotation.high24hr = parseFloat(response.data.high24hr).toFixed(2);        
                if(parseFloat(response.data.low24hr)> 0.001)vm.currencyCotation.low24hr = parseFloat(response.data.low24hr).toFixed(2);        
                if(parseFloat(response.data.baseVolume)> 0.001)vm.currencyCotation.baseVolume = parseFloat(response.data.baseVolume).toFixed(0);        
                vm.currencyCotation.change24hr =response.data.change24hr.toFixed(2);

            }, function (error) {
                $log.error(error.message);
            });
        };

        function getOrderData() {
            cryptoApiService.getPoloniexOrderData(vm.currencyName).then(function (response) {
                var askQuantityTotal = 0;
                var bidQuantityTotal = 0;
                
                vm.orderList = response.data;
                for (var i = 0; i < vm.orderList.length; i++) {            
                    askQuantityTotal = parseFloat(askQuantityTotal) + parseFloat(vm.orderList[i].askQuantity);
                    bidQuantityTotal = parseFloat(bidQuantityTotal) + parseFloat(vm.orderList[i].bidQuantity);
                    if(parseFloat(vm.orderList[i].bidPrice)> 0.001)vm.orderList[i].bidPrice = parseFloat(vm.orderList[i].bidPrice).toFixed(4);
                    if(parseFloat(vm.orderList[i].askPrice)> 0.001)vm.orderList[i].askPrice = parseFloat(vm.orderList[i].askPrice).toFixed(4);
                    vm.orderList[i].bidQuantity = parseFloat(vm.orderList[i].bidQuantity).toFixed(4);
                    vm.orderList[i].askQuantity = parseFloat(vm.orderList[i].askQuantity).toFixed(4);
                };

                vm.gridOptionsOrder = { data: vm.orderList, columnDefs: gridColumn };
                vm.drawAskBidChart(askQuantityTotal, bidQuantityTotal);

            }, function (error) {
                $log.error(error.message);
            });
        };

        function drawAskBidChart(askQuantityTotal, bidQuantityTotal) {
            vm.askPourcentStyle = { width: askQuantityTotal / (askQuantityTotal + bidQuantityTotal) * 100 + '%' };
            vm.bidQuantityStyle = { width: bidQuantityTotal / (askQuantityTotal + bidQuantityTotal) * 100 + '%' };
        };

        //Command : change chart type
        function changeChartType(chartType) {
            vm.chartType = chartType;
            vm.displayHistoryChart();
        };

        function changeChartDayType(chartDayType) {
            vm.chartDayType = chartDayType;
            vm.displayDayChart();
        };

        function showIndicator() {
            console.log(vm.checkBoxParent);
            vm.chartIndicators = [];
            vm.chartType = "candlestick";
            if (vm.checkBoxParent.showRsi) vm.chartIndicators.push(vm.indicatorRsi);
            if (vm.checkBoxParent.showAtr) vm.chartIndicators.push(vm.indicatorAtr);
            if (vm.checkBoxParent.showSma) vm.chartIndicators.push(vm.indicatorSma);
            if (vm.checkBoxParent.showEma) vm.chartIndicators.push(vm.indicatorEma);
            vm.loadHistoryChartData();
        };

        //Command : display chart data
        function displayHistoryChart(currencyName) {
            //vm.chartConfig1.loading = false;

            vm.chartTitle = vm.currencyName;
            vm.chartData = [];
            vm.chartData.push({
                id: 'abc',
                name: vm.currencyName,
                data: vm.chartValue,
                type: vm.chartType,
                yAxis: 0,
                dataGrouping: {
                    units: groupingUnits
                }
            });

            vm.chartData.push({
                name: 'volume',
                data: vm.chartVolume,
                type: 'column',
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            });
        };
        groupingUnits = [['day', [1]]];

        //Command : display chart data
        function displayDayChart(currencyName) {
            vm.chartDayData = [];
            vm.chartDayData.push({
                id: 'abc',
                name: vm.currencyName,
                data: vm.chartDayValue,
                type: vm.chartDayType,
                yAxis: 0,
                dataGrouping: {
                    units: groupingDayUnits
                }
            });

            vm.chartDayData.push({
                name: 'volume',
                data: vm.chartDayVolume,
                type: 'column',
                yAxis: 1,
                dataGrouping: {
                    units: groupingDayUnits
                }
            });
        };
        groupingDayUnits = [['hour', [1]]];
    };

    // Prior to v1.5, we need to call onInit manually
    if (angular.version.major === 1 && angular.version.minor < 5) {
        this.$onInit();
    }

};

function currencyTab() {
    return {
        require: 'ngModel',
        restrict: 'E',
        scope: {
            name: '@'
        },

        bindToController: true,
        controllerAs: 'vm',
        controller: 'currencyTabController',
        templateUrl: "App/home/currencyTab.html"
    };
};
