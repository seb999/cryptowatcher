myApp
    .controller("currencyTabController", currencyTabController)
    .directive("currencyTab", currencyTab);

function currencyTabController($scope, $log, $timeout, cryptoApiService) {

    var vm = this;
    vm.currencyName = vm.name;
    $log.info("Creating dynamic tab for "+vm.name);

    vm.chartVolume = [];
	vm.chartData = [];
    vm.chartType = 'area';
    vm.isAutoRefrsh = true;
    vm.loaderVisibility = true;
    vm.checkBoxParent = {};

    // utils
    vm.loadChartData = loadChartData;
    vm.displayChart = displayChart;
    vm.getOrderData = getOrderData;
    vm.changeChartType = changeChartType;
    vm.showIndicator = showIndicator;
    vm.drawAskBidChart = drawAskBidChart;

    //Life start here
    vm.getOrderData();
    vm.loadChartData();

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
    function loadChartData () {
        vm.loaderVisibility = true;
        vm.chartVolume = [];
        vm.chartValue = [];
        cryptoApiService.getPoloniexChartData(vm.currencyName).then(function (response) {
            vm.loaderVisibility = false;
            for (var i = 0; i < response.data.length; i++) {
                vm.chartVolume.push([response.data[i].date * 1000, response.data[i].volume]);
                vm.chartValue.push([response.data[i].date * 1000, response.data[i].open, response.data[i].high, response.data[i].low, response.data[i].close]);
            }
            vm.displayChart();
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
		vm.displayChart();
	};

	function showIndicator() {
        console.log(vm.checkBoxParent);
        vm.chartIndicators = [];
        vm.chartType = "candlestick";
        if (vm.checkBoxParent.showRsi) vm.chartIndicators.push(vm.indicatorRsi);
        if (vm.checkBoxParent.showAtr) vm.chartIndicators.push(vm.indicatorAtr);
        if (vm.checkBoxParent.showSma) vm.chartIndicators.push(vm.indicatorSma);
        if (vm.checkBoxParent.showEma) vm.chartIndicators.push(vm.indicatorEma);
        vm.loadChartData();
    };

	//Command : display chart data
	function displayChart(currencyName) {
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
        templateUrl : "../App/Home/currencyTab.html"
    };
};
