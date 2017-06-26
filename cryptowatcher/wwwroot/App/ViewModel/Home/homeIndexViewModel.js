myApp.controller('homeController', function ($scope, $log, $http, $window, $timeout, cryptoApiService) {

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

    $scope.openChart = function (currencyName) {
        $scope.showChart = true;
        $scope.loadChartData(currencyName);
    }; 

    //command : refresh data
    $scope.refreshData = function () {
        $scope.loadData();
    };

    $scope.changeChartType = function (chartType) {
        console.log(chartType);
    };

    $scope.loadData();


   

    //-----------------highchart---------------------
    groupingUnits = [[
        'day',                         // unit name
        [1]                             // allowed multiples
    ]],

    $scope.chartConfig1 = {
        title: {
            text: ''
        },
        series: [],
        useHighStocks: true,
        loading: true,
        options: {
            chart: {
                type: 'line',
                zoomType: 'x',
            },
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

    $scope.loadChartData = function (currencyName) {

        $scope.chartConfig1.loading = true;
        cryptoApiService.getPoloniexChartData(currencyName).then(function (response) {    
            
            lineData = [];
            volume = [];
            candelData = [];
            for (var i = 0; i < response.data.length; i++) {

                lineData.push([response.data[i].date * 1000, response.data[i].close]);
                volume.push([response.data[i].date * 1000, response.data[i].volume]);
                candelData.push([response.data[i].date * 1000, response.data[i].open, response.data[i].high, response.data[i].low, response.data[i].close]);
            }

            $scope.chartConfig1.series = [];
            $scope.chartConfig1.series.push({
                id: currencyName,
                name: currencyName,
                data: candelData,
                type: 'candlestick',
                dataGrouping: {
                    units: groupingUnits
                }
            });

            $scope.chartConfig1.series.push({
                name: 'volume',
                data: volume,
                type: 'column',
                yAxis: 1,
                dataGrouping: {
                    units: groupingUnits
                }
            });

            $scope.chartConfig1.loading = false;

        }, function (error) {
            $log.error(error.message);
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