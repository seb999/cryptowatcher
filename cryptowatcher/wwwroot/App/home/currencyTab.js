myApp
    .controller("currencyTabController", currencyTabController)
    .directive("currencyTab", currencyTab);

function currencyTabController($scope, $log, $timeout, cryptoApiService) {

    var vm = this;
    
    this.$onInit = function(){

        vm.currencyName = vm.name;
        $log.info("Creating dynamic tab for "+vm.name);
    
        vm.chartVolume = [];
        vm.chartData = [];
        vm.chartType = 'area';
        vm.chartDayType = 'line';
        vm.isAutoRefrsh = true;
        vm.loaderVisibility = true;
        vm.checkBoxParent = {};
    
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
    
        //Life start here
        vm.getOrderData();
        vm.loadHistoryChartData();
        vm.loadDayChartData();
        vm.getCurrencyCotation();
    
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
        
        vm.indicatorEma =  {
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
        function loadHistoryChartData () {
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
                debugger;
                vm.displayDayChart();
            }, function (error) {
                $log.error(error.message);
            });
        };
    
        //we load from API Cotation data to display
        function getCurrencyCotation() {
            cryptoApiService.getPoloniexCotation(vm.currencyName).then(function (response) {
                vm.currencyCotation = response.data;
                vm.currencyCotation.change24hr = vm.currencyCotation.change24hr.toFixed(2);
            }, function (error) {
                $log.error(error.message);
            });
        };
    
        function getOrderData() {
            cryptoApiService.getPoloniexOrderData(vm.currencyName).then(function (response) {
                vm.orderList = response.data;
                var askQuantityTotal=0;
                var bidQuantityTotal=0;
    
                 for (var i = 0; i < vm.orderList.length; i++) {
                    askQuantityTotal = parseFloat(askQuantityTotal) + parseFloat(vm.orderList[i].askQuantity);
                    bidQuantityTotal = parseFloat(bidQuantityTotal) + parseFloat(vm.orderList[i].bidQuantity);
                };
                vm.drawAskBidChart(askQuantityTotal, bidQuantityTotal);
    
            }, function (error) {
                $log.error(error.message);
            });
        };
    
        function drawAskBidChart(askQuantityTotal, bidQuantityTotal){
           vm.askPourcentStyle = {width: askQuantityTotal / (askQuantityTotal + bidQuantityTotal) * 100 + '%'};
           vm.bidQuantityStyle = {width: bidQuantityTotal / (askQuantityTotal + bidQuantityTotal) * 100 + '%'};
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
    if(angular.version.major === 1 && angular.version.minor <5){
        this.$onInit();
    }

};

function currencyTab() {
    return {
        require: 'ngModel',
        restrict:'E',
        scope:{
            name:'@'
        },

        bindToController:true,
        controllerAs:'vm',
        controller:'currencyTabController',
        templateUrl : "App/home/currencyTab.html"
    };
};
