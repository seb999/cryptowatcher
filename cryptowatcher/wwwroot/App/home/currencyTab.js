myApp
    .controller("currencyTabController", currencyTabController)
    .directive("currencyTab", currencyTab);

function currencyTabController($scope, $log, $timeout, $interval, cryptoApiService) {

    //clear angular cashing
    //$templateCache.removeAll();
    var vm = this;

    var stopInternal1;
    var stopInternal2;
    var stopInternal3;

  

    $scope.$on('$destroy', function() {
        $log.warn("clear viewModel from memory ");

        $interval.cancel(stopInternal1);
        $interval.cancel(stopInternal2);
        $interval.cancel(stopInternal3);
        vm.chartVolume = [];
        vm.chartData = [];
        vm.isAutoRefrsh = false;
        vm.checkBoxParent = {};
        vm.currencyCotation = {};
    });

    this.$onInit = function () {

        console.log(vm.isMacdVisible);
        $log.warn("OnInit called");
        vm.currencyName = vm.name;
        $log.info("Creating dynamic tab for " + vm.name);

        vm.chartVolume = [];
        vm.chartData = [];
        vm.chartType = 'candlestick';
        vm.chartDayType = 'candlestick';
        vm.isAutoRefrsh = true;
        vm.loaderVisibility = true;
        vm.checkBoxParent = {};
        vm.currencyCotation = {};
        vm.chartPeriod = "1";
        vm.rsiPeriod = "14";
        vm.isMacdVisible = false;
        vm.volumeHeight = '30%';

        // utils
        vm.loadHistoryChartData = loadHistoryChartData;
        vm.displayHistoryChart = displayHistoryChart;
        vm.loadDayChartData = loadDayChartData;
        vm.displayDayChart = displayDayChart;
        vm.getOrderData = getOrderData;
        vm.changeChartType = changeChartType;
        vm.changeChartPeriod = changeChartPeriod;
        vm.changeRsiPeriod = changeRsiPeriod;
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
            if(vm.isAutoRefrsh){
                stopInternal1 = $interval(getCurrencyCotation, 3000);
                stopInternal2 = $interval(getOrderData, 3000);
                stopInternal3 = $interval(loadDayChartData, 20000);
            }
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

        //###############Indicators to push to chart directive#####################
        vm.indicatorRsi = {
            id: 'abc',
            type: 'rsi',
            lineWidth: 1,
            params: {
                period: parseInt(vm.rsiPeriod),
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

     

        //##############Load chart data / display chart#############################
        //we load from API the data to display
        function loadHistoryChartData() {
            vm.loaderVisibility = true;
            vm.chartVolume = [];
            vm.chartValue = [];
            cryptoApiService.getPoloniexHistoryChartData(vm.currencyName, vm.chartPeriod).then(function (response) {
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

        //Command : display chart data
        function displayHistoryChart(currencyName) {
            //vm.chartConfig1.loading = false;
            console.log(vm.isMacdVisible);
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

            if (vm.checkBoxParent.showMacd) {
                vm.chartData.push({
                    name: 'macd',
                    type: 'macd',
                    linkedTo: 'abc',
                    yAxis: 2,
                    params: {
                        shortPeriod: 12,
                        longPeriod: 26,
                        signalPeriod: 9,
                        period: 26
                    },
                    dataGrouping: {
                        units: groupingUnits
                    }
                });
            }
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

        //############Load cotation data and order book##############################
        function getCurrencyCotation() {
            cryptoApiService.getPoloniexCotation(vm.rsiPeriod, vm.currencyName).then(function (response) {

                if (vm.currencyCotation.change24hr !== response.data.change24hr.toFixed(2)) {
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

                console.log("reload");
                
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

        //#############Event managers#############################################
        //Command : change chart type
        function changeChartType(chartType) {
            vm.chartType = chartType;
            vm.displayHistoryChart();
        };

        function changeChartPeriod(numberOfYear) {
            vm.chartPeriod = numberOfYear;
            vm.loadHistoryChartData();
        };

        function changeRsiPeriod() {
            getCurrencyCotation();
            vm.indicatorRsi.params.period = parseInt(vm.rsiPeriod);
            showIndicator();
        };

        function changeChartDayType(chartDayType) {
            vm.chartDayType = chartDayType;
            vm.displayDayChart();
        };

        function showIndicator() {
            vm.loaderVisibility = true;
            vm.chartIndicators = [];
            vm.chartType = "candlestick";
            if (vm.checkBoxParent.showMacd) {
                vm.isMacdVisible =!vm.isMacdVisible;
                vm.volumeHeight = '15%';
                vm.macdHeight = '15%';
             
            }
            else{
                vm.volumeHeight = '30%';
                vm.macdHeight = '0%';
                vm.isMacdVisible =!vm.isMacdVisible;
            }
            if (vm.checkBoxParent.showRsi) vm.chartIndicators.push(vm.indicatorRsi);
            if (vm.checkBoxParent.showAtr) vm.chartIndicators.push(vm.indicatorAtr);
            if (vm.checkBoxParent.showSma) vm.chartIndicators.push(vm.indicatorSma);
            if (vm.checkBoxParent.showEma) vm.chartIndicators.push(vm.indicatorEma);
            vm.loadHistoryChartData();
        };
    };

    // Prior to v1.5, we need to call onInit manually
    if (angular.version.major === 1 && angular.version.minor < 5) {
        this.$onInit();
    }

};

function currencyTab() {
    return {
        cache: false,
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
