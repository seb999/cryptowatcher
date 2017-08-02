myApp.controller('homeController', function ($scope, $log, $http, $window, $timeout, $uibModal, cryptoApiService) {
    $scope.loaderVisibility = true;
    $scope.newCurrencyList = [];
    var currencyList = [];
    var currencyListBTC = [];
    var currencyListETH = [];
    var currencyListXMR = [];
    var currencyListUSD = [];

    $scope.showGrid0 = true;
    $scope.showGrid1 = false;
    $scope.showGrid2 = false;
    $scope.showGrid3 = false;

    var gridColumn = [
        { field: 'name', cellTemplate: '<div ng-binding ng-scope" style="margin-left:5px"><img src="{{grid.appScope.getTemplateUI(COL_FIELD)}}" alt=""/>{{ COL_FIELD }}</div>'},
        { headerName: "Last", field: "last", width: 110},
        { headerName: "LowestAsk", field: "lowestAsk", width: 110 },
        { headerName: "HighestBid", field: "highestBid", width: 110 },
        { headerName: "PercentChange", field: "percentChange", width: 110 },
        { headerName: "BaseVolume", field: "baseVolume", width: 110 },
        { headerName: "QuoteVolume", field: "quoteVolume" },
        { headerName: "High24hr", field: "high24hr" },
        { headerName: "Low24hr", field: "low24hr" },
        { field: 'rsi', cellTemplate: '<div ng-binding ng-scope" style="margin-left:5px"><span ng-show="!grid.appScope.isLoadingRsi">{{ COL_FIELD }}</span><img src="{{grid.appScope.getRsiTemplateUI(COL_FIELD)}}" alt="" width= "30" ng-show="grid.appScope.isLoadingRsi"/></div>' },
        { headerName: " ", field: 'name', cellTemplate: '<div ng-binding ng-scope" style="margin-left:5px"><span class="btn-label"><span class="btn-label" style="color:dodgerblue;cursor:pointer" uib-tooltip="Chart" ng-click="grid.appScope.openChart(COL_FIELD)"><i class="glyphicon glyphicon-stats"></i></span></div > ', width:40 },
    ];

    //Command : reshape the grid 
    $scope.tabSelected = function (gridId) {
        if (gridId === 0) $scope.showGrid0 = true;
        if (gridId === 1) $scope.showGrid1 = true;
        if (gridId === 2) $scope.showGrid2 = true;
        if (gridId === 3) $scope.showGrid3 = true;
           
        $scope.gridOptionsUSD.columnDefs = gridColumn;
        $scope.gridOptionsETH.columnDefs = gridColumn;
        $scope.gridOptionsBTC.columnDefs = gridColumn;
        $scope.gridOptionsXMR.columnDefs = gridColumn;
       
        
        //$timeout(function () {
        //    $scope.gridBTC.core.handleWindowResize();
        //    $scope.gridETH.core.handleWindowResize();
        //    $scope.gridXMR.core.handleWindowResize();
        //    $scope.gridUSD.core.handleWindowResize();
        //}, 1000);
    }

    $scope.gridOptionsBTC = {
        data: null,
        columnDefs: gridColumn,
        onRegisterApi: function (gridBTC) {
            $scope.gridBTC = gridBTC;     
        }
    };

    $scope.gridOptionsETH = {
        data: null,
        columnDefs: gridColumn,
        //onRegisterApi: function (gridETH) {
        //    $scope.gridETH = gridETH;
        //}
    };

    $scope.gridOptionsXMR = {
        data: null,
        columnDefs: gridColumn,
        onRegisterApi: function (gridXMR) {
            $scope.gridXMR = gridXMR;
        }
    };

    $scope.gridOptionsUSD = {
        data: null,
        columnDefs: gridColumn,
        onRegisterApi: function (gridUSD) {
            $scope.gridUSD = gridUSD;
        }
    };

    $scope.getTemplateUI = function (value) {
        if (value.substring(0, 3) === 'BTC') { return "images/bitcoin.png" };
        if (value.substring(0, 3) === 'XMR') { return "images/monero.png" };
        if (value.substring(0, 3) === 'ETH') { return "images/eth.png" };
        if (value.substring(0, 3) === 'USD') { return "images/usdt.png" };
        return "";
    };

    $scope.getRsiTemplateUI = function (valueRsi) {
        if (valueRsi === 0) {
            $scope.isLoadingRsi = true;
            return "images/loader.gif"
        };
        $scope.isLoadingRsi = false;
        return "";
    }; 

    //check if there are new currency and display 1 week an alert message
    // cryptoApiService.getNewCurrencyList().then(function (response) {
    //     $scope.newCurrencyList = response.data;
    //     }, function (error) { $log.error(error.message);});

    $scope.loadData = function (currencyType) {
        $scope.loaderVisibility = true;
        //First pass we load all curency without the RSI indicator
        cryptoApiService.getPoloniexData("").then(function (response) {
            $scope.loaderVisibility = false;
            currencyList = response.data;
            for (var i = 0; i < currencyList.length; i++) {
                if (currencyList[i].name.substring(0, 3) === "ETH") currencyListETH.push(currencyList[i]);
                if (currencyList[i].name.substring(0, 3) === "BTC") currencyListBTC.push(currencyList[i]);
                if (currencyList[i].name.substring(0, 3) === "XMR") currencyListXMR.push(currencyList[i]);
                if (currencyList[i].name.substring(0, 3) === "USD") currencyListUSD.push(currencyList[i]);
            };
            $scope.gridOptionsETH = { data: currencyListETH };
            $scope.gridOptionsBTC = { data: currencyListBTC };
            $scope.gridOptionsXMR = { data: currencyListXMR };
            $scope.gridOptionsUSD = { data: currencyListUSD };

            //$scope.loadDataWithRsi();
        }, function (error) { $log.error(error.message); });
    };
    $scope.loadData();

    //Second pass to load the RSI behind the scene as it take 20 second
    $scope.loadDataWithRsi = function () {
        cryptoApiService.getPoloniexData("USD").then(function (response) {
            $scope.gridOptionsUSD = { data: response.data };
        }, function (error) { $log.error(error.message); });

        cryptoApiService.getPoloniexData("ETH").then(function (response) {
           $scope.gridOptionsETH = { data: response.data };
        }, function (error) { $log.error(error.message); });

        cryptoApiService.getPoloniexData("BTC").then(function (response) {
           $scope.gridOptionsBTC = { data: response.data };
        }, function (error) { $log.error(error.message); });

        cryptoApiService.getPoloniexData("XMR").then(function (response) {
           $scope.gridOptionsXMR = { data: response.data };
        }, function (error) { $log.error(error.message); });
    };

    //Command : open chart
    $scope.openChart = function (currencyName) {
        if (currencyName.substring(0, 3) === 'BTC') { currencyList = currencyListBTC };
        if (currencyName.substring(0, 3) === 'XMR') { currencyList = currencyListXMR };
        if (currencyName.substring(0, 3) === 'ETH') { currencyList = currencyListETH };
        if (currencyName.substring(0, 3) === 'USD') { currencyList = currencyListUSD };
        $scope.chartType = 'line';
        //$scope.loadChartData();

        var modalInstance = $uibModal.open({
            templateUrl: 'App/View/Home/homeChartView.html?bust=' + Math.random().toString(36).slice(2),
            controller: 'homeChartViewModel',
            backdrop: 'static',
            size: 'lg',
            cache: false,
            resolve: {
                currencyName: function () {
                    return currencyName;
                },
                currencyList: function () {
                    return currencyList;
                }
            }
        });
        modalInstance.result.then(function () {
            loadActivityList(activityIndex);
        });
    }; 

    //command : refresh data
    $scope.refreshData = function () {
        $scope.loadData();
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