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
    vm.loadChartData = function () {
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

    vm.getPoloniexOrder = function () {
        cryptoApiService.getPoloniexOrderData(vm.currencyName).then(function (response) {
            vm.orderList = response.data;
        }, function (error) {
            $log.error(error.message);
        });
    };


    vm.autoRefreshPoloniexOrder = function () {
        if (vm.isAutoRefrsh)
        {
            $timeout(function () {
                vm.getPoloniexOrder();
                vm.autoRefreshPoloniexOrder();
                }, 3000);
        }
    };

    //Command : change chart type
    vm.changeChartType = function (chartType) {
		vm.chartType = chartType;
		vm.displayChart();
	};

	vm.showIndicator = function () {
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
	vm.displayChart = function (currencyName) {
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
	groupingUnits = [['day', [1]]],

    //------------------Navigation----------------------------------
    vm.previousActivity = function () {

        if (vm.selectedIndexLine - 1 >= 0) {
            vm.selectedIndexLine--;
        };
        vm.currencyName = currencyList[vm.selectedIndexLine].name;
        vm.loadChartData();
        vm.getPoloniexOrder();
        checkNavigationButton();
    };

    vm.nextActivity = function () {
        if (vm.selectedIndexLine + 1 < currencyList.length) {
            vm.selectedIndexLine++;
        };
        vm.currencyName = currencyList[vm.selectedIndexLine].name;
        vm.loadChartData();
        vm.getPoloniexOrder();
        checkNavigationButton();
    };

    checkNavigationButton = function () {

        vm.previousButtonDisabled = false;
        vm.nextButtonDisabled = false;

        if (vm.selectedIndexLine === 0)
            vm.previousButtonDisabled = true;

        if (vm.selectedIndexLine === currencyList.length - 1)
            vm.nextButtonDisabled = true;
    };

    // load data for this currency div
    vm.getPoloniexOrder();
    vm.loadChartData();
    vm.autoRefreshPoloniexOrder();
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
