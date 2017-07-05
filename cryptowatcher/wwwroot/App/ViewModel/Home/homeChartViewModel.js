myApp.controller('homeChartViewModel', function ($scope, $window, $http, $log, $timeout, $uibModalInstance, currencyName, currencyList, cryptoApiService, $uibModal) {
    for (var i = 0; i < currencyList.length; i++) {
        if (currencyList[i].name === currencyName) {
            $scope.selectedIndexLine = i;
        };
    };

	$scope.currencyName = currencyName; 
	$scope.chartVolume = [];
	$scope.chartData = [];
    $scope.chartType = 'area';
    $scope.isAutoRefrsh = true;
    $scope.loaderVisibility = true;
    $scope.checkBoxParent = {};

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

	//Life start here : we load from API the data to display
    $scope.loadChartData = function () {
		$scope.loaderVisibility = true;
		$scope.chartVolume = [];
		$scope.chartValue = [];
        cryptoApiService.getPoloniexChartData($scope.currencyName).then(function (response) {
            $scope.loaderVisibility = false;
            for (var i = 0; i < response.data.length; i++) {
                $scope.chartVolume.push([response.data[i].date * 1000, response.data[i].volume]);
                $scope.chartValue.push([response.data[i].date * 1000, response.data[i].open, response.data[i].high, response.data[i].low, response.data[i].close]);
            }
            //$scope.chartConfig1.loading = false;
            $scope.displayChart();
        }, function (error) {
            $log.error(error.message);
        });
    };
    $scope.loadChartData();

    $scope.getPoloniexOrder = function () {
        cryptoApiService.getPoloniexOrderData($scope.currencyName).then(function (response) {
            $scope.orderList = response.data;
            //$scope.gridOptionsUI = { data: response.data };
        }, function (error) {
            $log.error(error.message);
        });
    };
    $scope.getPoloniexOrder();

    $scope.autoRefreshPoloniexOrder = function () {
        if ($scope.isAutoRefrsh)
        {
            $timeout(function () {
                $scope.getPoloniexOrder();
                $scope.autoRefreshPoloniexOrder();
                }, 3000);
        }
    };
    $scope.autoRefreshPoloniexOrder();

	//command  :close popup
    $scope.close = function () {
        $scope.isAutoRefrsh = false;
		$uibModalInstance.dismiss('cancel');
	};

	//Command : change chart type
	$scope.changeChartType = function (chartType) {
		$scope.chartType = chartType;
		$scope.displayChart();
	};

	$scope.showIndicator = function () {
        console.log($scope.checkBoxParent);
        $scope.chartIndicators = [];
        $scope.chartType = "candlestick";
        if ($scope.checkBoxParent.showRsi) $scope.chartIndicators.push($scope.indicatorRsi);
        if ($scope.checkBoxParent.showAtr) $scope.chartIndicators.push($scope.indicatorAtr);
        if ($scope.checkBoxParent.showSma) $scope.chartIndicators.push($scope.indicatorSma);
        if ($scope.checkBoxParent.showEma) $scope.chartIndicators.push($scope.indicatorEma);
        $scope.loadChartData();
    };

	//Command : display chart data
	$scope.displayChart = function (currencyName) {
		//$scope.chartConfig1.loading = false;

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
	groupingUnits = [['day', [1]]],

    //------------------Navigation----------------------------------
    $scope.previousActivity = function () {

        if ($scope.selectedIndexLine - 1 >= 0) {
            $scope.selectedIndexLine--;
        };
        $scope.currencyName = currencyList[$scope.selectedIndexLine].name;
        $scope.loadChartData();
        $scope.getPoloniexOrder();
        checkNavigationButton();
    };

    $scope.nextActivity = function () {
        if ($scope.selectedIndexLine + 1 < currencyList.length) {
            $scope.selectedIndexLine++;
        };
        $scope.currencyName = currencyList[$scope.selectedIndexLine].name;
        $scope.loadChartData();
        $scope.getPoloniexOrder();
        checkNavigationButton();
        };

    checkNavigationButton = function () {

        $scope.previousButtonDisabled = false;
        $scope.nextButtonDisabled = false;

        if ($scope.selectedIndexLine === 0)
            $scope.previousButtonDisabled = true;

        if ($scope.selectedIndexLine === currencyList.length - 1)
            $scope.nextButtonDisabled = true;
    };
});