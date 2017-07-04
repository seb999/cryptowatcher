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

// $scope.chartIndicators = [];
// 	$scope.chartIndicators.push($scope.indicatorRsi);
//    $scope.chartIndicators.push($scope.indicatorAtr);
//      $scope.chartIndicators.push($scope.indicatorSma);
//     $scope.chartIndicators.push($scope.indicatorEma);

    //var columnDefUI = [
    //    { headerName: "Ask Quantity", field: "askQuantity" },
    //    { headerName: "Ask Price", field: "askPrice"},
    //    { headerName: "Bid Price", field: "bidPrice"},
    //    { headerName: "Bid Quantity", field: "bidQuantity"},
    //];

    //$scope.gridOptionsUI = {
    //    data: null,
    //    columnDefs: columnDefUI
    //};

	//Life start here : we load from API the data to display
    $scope.getPoloniexChartData = function () {
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
    $scope.getPoloniexChartData();

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
		debugger;
        $scope.chartIndicators = [];
        if($scope.showRsi) $scope.chartIndicators.push($scope.indicatorRsi);
        if($scope.showAtr) $scope.chartIndicators.push($scope.indicatorAtr);
        if($scope.showSma) $scope.chartIndicators.push($scope.indicatorSma);
        if($scope.showEma) $scope.chartIndicators.push($scope.indicatorEma);
        $scope.getPoloniexChartData();
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


	groupingUnits = [[
		'day',                         // unit name
		[1]                             // allowed multiples
	]],

	// $scope.chartConfig1 = {
	// 		chart: {
	// 			zoomType: 'x',
	// 			spacingTop: 15,
	// 			spacingBottom: 15,
	// 			spacingLeft: 15,
	// 			spacingRight: 15,
				
	// 		},
	// 		chartType: 'stock',
	// 		title: {
	// 			text: ''
	// 		},
	// 		series: [],
	// 		useHighStocks: true,
	// 		loading: true,
	// 		options: {
	// 			rangeSelector: {
	// 				enabled: true
	// 			},
	// 			navigator: {
	// 				enabled: true
	// 			},

	// 			colors: ['#00A1E2', '#6769B5', '#3BC3A3', '#93959B', '#2D8F78', '#C3842F', '#005EA4'],
	// 			tooltip: {
	// 				pointFormat: '{series.name}: <b>{point.y}</b>'
	// 			},
	// 		},
	// 		xAxis: {
	// 			type: 'datetime',
	// 			title: {
	// 				text: 'Date'
	// 			},
	// 			minTickInterval: 5,
	// 			minorTickInterval: 1
	// 		},	   
	// 		yAxis: [{
	// 			labels: {
	// 				align: 'right',
	// 				x: -3
	// 			},
	// 			title: {
	// 				text: ''
	// 			},
	// 			height: '65%',
	// 			lineWidth: 2
	// 		}, {
	// 			labels: {
	// 				align: 'right',
	// 				x: -3
	// 			},
	// 			title: {
	// 				text: 'Volume'
	// 			},
	// 			top: '70%',
	// 			height: '30%',
	// 			offset: 0,
	// 			lineWidth: 2
	// 		}],
	// 		legend: {
	// 			enabled: true
	// 		},
	// 	}
	// $scope.chartConfig1.loading = true;


    //------------------Navigation----------------------------------
    $scope.previousActivity = function () {

        if ($scope.selectedIndexLine - 1 >= 0) {
            $scope.selectedIndexLine--;
        };
        $scope.currencyName = currencyList[$scope.selectedIndexLine].name;
        $scope.getPoloniexChartData();
        $scope.getPoloniexOrder();
        checkNavigationButton();
    };

    $scope.nextActivity = function () {
        if ($scope.selectedIndexLine + 1 < currencyList.length) {
            $scope.selectedIndexLine++;
        };
        $scope.currencyName = currencyList[$scope.selectedIndexLine].name;
        $scope.getPoloniexChartData();
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