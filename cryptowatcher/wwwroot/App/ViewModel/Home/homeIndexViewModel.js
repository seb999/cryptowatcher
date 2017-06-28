myApp.controller('homeController', function ($scope, $log, $http, $window, $timeout, $uibModal, cryptoApiService) {

    $scope.isSecondLoad = false;
    $scope.loaderVisibility = false;
    $scope.showChart = false;
    $scope.chartType = 'line';

    var columnDefUI = [
        { field: 'name', cellTemplate: '<div ng-binding ng-scope" style="margin-left:5px"><img src="{{grid.appScope.getTemplateUI(COL_FIELD)}}" alt=""/>{{ COL_FIELD }}</div>'},
        { headerName: "Last", field: "last", width: 110},
        { headerName: "LowestAsk", field: "lowestAsk", width: 110 },
        { headerName: "HighestBid", field: "highestBid", width: 110 },
        { headerName: "PercentChange", field: "percentChange", width: 110 },
        { headerName: "BaseVolume", field: "baseVolume", width: 110 },
        { headerName: "QuoteVolume", field: "quoteVolume" },
        { headerName: "High24hr", field: "high24hr" },
        { headerName: "Low24hr", field: "low24hr" },
        { field: 'rsi', cellTemplate: '<div ng-binding ng-scope" style="margin-left:5px">{{ COL_FIELD }}<img src="{{$scope.getRsiTemplateUI(COL_FIELD)}}" alt="" width= "30" ng-show="$scope.isLoadingRsi"/></div>' },
        { field: 'name', cellTemplate: '<div ng-binding ng-scope" style="margin-left:5px"><span class="btn-label"><span class="btn-label" style="color:dodgerblue;cursor:pointer" uib-tooltip="Chart" ng-click="grid.appScope.openChart(COL_FIELD)"><i class="glyphicon glyphicon-stats"></i></span></div > ', width:40 },
    ];

    $scope.gridOptionsUI = {
        data: null,
        columnDefs: columnDefUI
    };

    $scope.getTemplateUI = function (value) {
        if (value.substring(0, 3) === 'BTC') { return "/images/bitcoin.png" };
        if (value.substring(0, 3) === 'XMR') { return "/images/monero.png" };
        if (value.substring(0, 3) === 'ETH') { return "/images/eth.png" };
        if (value.substring(0, 3) === 'USD') { return "/images/usdt.png" };
        return "";
    };

    $scope.getRsiTemplateUI = function (valueRsi) {
        if (valueRsi === 'loading RSI') {
            $scope.isLoadingRsi = true;
            return "images/loader.gif"
        };
        $scope.isLoadingRsi = false;
        return "";
    }; 

    $scope.loadData = function () {
        $scope.loaderVisibility = true;
        cryptoApiService.getPoloniexData().then(function (response) {
            $scope.loaderVisibility = false;
            $scope.gridOptionsUI = { data: response.data };
            //Bind data to Ag-Grid
            //$scope.gridOptionsAG.api.setRowData(response.data);          
        }, function (error) { $log.error(error.message); });

        //Second pass to load the RSI behind the scene as it take 20 second
        cryptoApiService.getPoloniexData(true).then(function (response) {
            $scope.loaderVisibility = false;
            $scope.gridOptionsUI = { data: response.data };
            //Bind data to Ag-Grid
            //$scope.gridOptionsAG.api.setRowData(response.data);          
        }, function (error) { $log.error(error.message); });
    };

    $scope.loadData();

    //Command : open chart
    $scope.openChart = function (currencyName) {
        //$scope.showChart = true;
        $scope.currencyName = currencyName;
        $scope.chartType = 'line';
        //$scope.loadChartData();


        var modalInstance = $uibModal.open({
            templateUrl: '../../App/View/home/homeChartView.html',
            controller: 'homeChartViewModel',
            //backdrop: 'static',
            size: 'lg',
            cache: false,
            resolve: {
                currencyName: function () {
                    return $scope.currencyName;
                }
            }
        });
        modalInstance.result.then(function () {
            loadActivityList(activityIndex);
        });
    }; 

    //Command : change chart type
    $scope.changeChartType = function (chartType) {
        $scope.chartType = chartType;
        $scope.displayChart();
    };

    //command : refresh data
    $scope.refreshData = function () {
        $scope.loadData();
    };

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
                text: '',
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

    $scope.loadChartData = function () {

        $scope.chartConfig.loading = true;
        cryptoApiService.getPoloniexChartData($scope.currencyName).then(function (response) {    
           
            $scope.chartVolume = [];
            $scope.chartData = [];
            
            for (var i = 0; i < response.data.length; i++) {
                $scope.chartVolume.push([response.data[i].date * 1000, response.data[i].volume]);
                $scope.chartData.push([response.data[i].date * 1000, response.data[i].open, response.data[i].high, response.data[i].low, response.data[i].close]);
            }

            $scope.displayChart();

        }, function (error) {
            $log.error(error.message);
        });
    };

    $scope.displayChart = function (currencyName) {
        $scope.chartConfig.loading = false;
        
        $scope.chartConfig.series = [];
        $scope.chartConfig.series.push({
            name: $scope.currencyName,
            data: $scope.chartData,
            type: $scope.chartType,
            yAxis: 0,
            dataGrouping: {
                units: groupingUnits
            }
        });

        $scope.chartConfig.series.push({
            name: 'volume',
            data: $scope.chartVolume,
            type: 'column',
            yAxis: 1,
            dataGrouping: {
                units: groupingUnits
            }
        });
    };
















    ///////////////////////////////////////////////////////////
    //I keep this for futur reference if we switch to ag-grid//
    ///////////////////////////////////////////////////////////


    //$scope.gridOptionsAG = {
    //    columnDefs: columnDefAG,
    //    rowData: $scope.ar,
    //    enableFilter: true,
    //    enableColResize: true,
    //    enableSorting: true,
    //    suppressScrollOnNewData: true
    //};

    ////Function : get logo for crypto currency
    //function getTemplateAG(params, field) {
    //    var element = document.createElement("span");
    //    var imageElement = document.createElement("img");

    //    // visually indicate if this months value is higher or lower than last months value
    //    if (params.value.substring(0, 3) === 'BTC') { imageElement.src = "images/bitcoin.png" };
    //    if (params.value.substring(0, 3) === 'XMR') { imageElement.src = "images/monero.png" };
    //    if (params.value.substring(0, 3) === 'ETH') { imageElement.src = "images/eth.png" };
    //    if (params.value.substring(0, 3) === 'USD') { imageElement.src = "images/usdt.png" };

    //    element.appendChild(imageElement);
    //    element.appendChild(document.createTextNode(params.value));
    //    return element;
    //}

    //var columnDefAG = [
    //    {
    //        headerName: "Name",
    //        field: "name",
    //        width: 110,
    //        cellRenderer: function (params) {
    //            return getTemplateAG(params, "name");
    //        }
    //    },
    //    { headerName: "Id", field: "id", width: 110 },
    //    {
    //        headerName: "Last", field: "last",
    //        width: 110,
    //        newValueHandler: function (params) {
    //            var data = params.data;
    //            var newval = params.newValue;
    //            var oldval = params.oldValue;
    //            if (newval != oldval) {

    //            }
    //            // change the value, maybe we want it in upper case
    //            var value = formatTheValueSomehow(value);
    //            data.iAmNotUsingTheField = value;
    //        }
    //    },
    //    { headerName: "LowestAsk", field: "lowestAsk", width: 110 },
    //    { headerName: "HighestBid", field: "highestBid", width: 110 },
    //    { headerName: "PercentChange", field: "percentChange", width: 110 },
    //    { headerName: "BaseVolume", field: "baseVolume", width: 110 },
    //    { headerName: "QuoteVolume", field: "quoteVolume" },
    //    { headerName: "IsFrozen", field: "isFrozen" },
    //    { headerName: "High24hr", field: "high24hr" },
    //    { headerName: "Low24hr", field: "low24hr" }
    //];
});