myApp.controller('homeController', function ($scope, $log, $http, $window, $timeout, $uibModal, cryptoApiService) {
  
    $scope.loaderVisibility = true;
    $scope.newCurrencyList = [];
    $scope.activeTab = 0;

    var currencyList = [];
    var currencyListBTC = [];
    var currencyListETH = [];
    var currencyListXMR = [];
    var currencyListUSD = [];

    $scope.showGrid0 = true;
    $scope.showGrid1 = false;
    $scope.showGrid2 = false;
    $scope.showGrid3 = false;

    // dynamically added tabs
    $scope.currencyTabs = [];
    $scope.removeTab = removeTab;
    $scope.addTab = addTab;

    // utils
    $scope.loadData = loadData;
    $scope.loadDataWithRsi = loadDataWithRsi;
    $scope.searchNewCurrency = searchNewCurrency;
    $scope.refreshData = refreshData;
    $scope.getTableLogo = getTableLogo;
    $scope.getTableRsi = getTableRsi;
    $scope.get24hChange = get24hChange;
    $scope.get24hColor = get24hColor;

    // event handler
    $scope.tabSelected = tabSelected;
    
    // Life start here!!!
    $scope.searchNewCurrency();
    $scope.loadData();

    // ##################################################################

    var gridColumn = [
        { headerName: " ", field: 'name', enableFiltering: false, headerCellTemplate: '<div></div>', cellTemplate: '<div ng-binding ng-scope" style="margin-left:5px"><span class="btn-label"><span class="btn-label" style="color:dodgerblue;cursor:pointer" uib-tooltip="Chart" uib-tooltip-placement="left" tooltip-append-to-body = "true" ng-click="grid.appScope.addTab(COL_FIELD)"><i class="glyphicon glyphicon-stats"></i></span></div > ', width: 40 },
        { headerName: "Name", field: 'name', displayName: "name", cellTemplate: '<div ng-binding ng-scope" style="margin-left:5px"><img ng-src="{{grid.appScope.getTableLogo(COL_FIELD)}}" alt=""/>{{ COL_FIELD }}</div>', width: 200},
        { headerName: "Last", field: "last", width: 110, enableFiltering: false },
        { headerName: "LowestAsk", field: "lowestAsk", enableFiltering: false },
        { headerName: "HighestBid", field: "highestBid", enableFiltering: false},  
        { headerName: "BaseVolume", field: "baseVolume", enableFiltering: false },
        { headerName: "QuoteVolume", field: "quoteVolume", enableFiltering: false },
        { headerName: "High24hr", field: "high24hr", enableFiltering: false },
        { headerName: "Low24hr", field: "low24hr", enableFiltering: false },
        { headerName: "PercentChange", field: "percentChange", displayName: "% change (24h)", enableFiltering: false, cellTemplate: '<div ng-binding ng-scope" style="margin-left:5px; color:{{grid.appScope.get24hColor(COL_FIELD)}}"><span>{{grid.appScope.get24hChange(COL_FIELD)}} %</span></div>'},
        { headerName: "Rsi", field: 'rsi', enableFiltering: false, cellTemplate: '<div ng-binding ng-scope" style="margin-left:5px"><span ng-show="!grid.appScope.isLoadingRsi">{{ COL_FIELD }}</span><img ng-src="{{grid.appScope.getTableRsi(COL_FIELD)}}" alt="" width= "30" ng-show="grid.appScope.isLoadingRsi"/></div>', width: 60},
    ];

    $scope.world = function() { return 'images/bitcoin.png'; };

    //Command : reshape the grid 
    function tabSelected(gridId) {
        gridId === 0 ? $scope.showGrid0 = true : $scope.showGrid0 = false;
        gridId === 1 ? $scope.showGrid1 = true : $scope.showGrid1 = false;
        gridId === 2 ? $scope.showGrid2 = true : $scope.showGrid2 = false;
        gridId === 3 ? $scope.showGrid3 = true : $scope.showGrid3 = false;         
        $scope.gridOptionsUSD.columnDefs = gridColumn;
        $scope.gridOptionsETH.columnDefs = gridColumn;
        $scope.gridOptionsBTC.columnDefs = gridColumn;
        $scope.gridOptionsXMR.columnDefs = gridColumn;
    }

    $scope.gridOptionsBTC = {
        data: null,
        columnDefs: gridColumn,
        enableFiltering: true,
    };

    $scope.gridOptionsETH = {
        data: null,
        columnDefs: gridColumn,
    };

    $scope.gridOptionsXMR = {
        data: null,
        columnDefs: gridColumn,
    };

    $scope.gridOptionsUSD = {
        data: null,
        columnDefs: gridColumn,
    };

    function getTableLogo(value) {
        if (value.substring(0, 3) === 'BTC') { return "images/bitcoin.png" };
        if (value.substring(0, 3) === 'XMR') { return "images/monero.png" };
        if (value.substring(0, 3) === 'ETH') { return "images/eth.png" };
        if (value.substring(0, 3) === 'USD') { return "images/usdt.png" };
        return "";
    };

    function getTableRsi(valueRsi) {
        if (valueRsi === 0) {
            $scope.isLoadingRsi = true;
            return "images/loader.gif"
        };
        $scope.isLoadingRsi = false;
        return "";
    }; 

    function get24hChange(value) {
        return (value * 100).toFixed(2);
    }

    function get24hColor(value) {
        if (value > 0) return "green";
        if (value < 0) return "red";
        if (value === 0) return "black";
    }

    //check if there are new currency and display 1 week an alert message
    function searchNewCurrency(currencyType) {
        cryptoApiService.getNewCurrencyList().then(function (response) {
            $scope.newCurrencyList = response.data;
            }, function (error) { $log.error(error.message);});
    }

    function loadData(currencyType) {
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
            $scope.gridOptionsETH = { data: currencyListETH, columnDefs: gridColumn };
            $scope.gridOptionsBTC = { data: currencyListBTC, columnDefs: gridColumn };
            $scope.gridOptionsXMR = { data: currencyListXMR };
            $scope.gridOptionsUSD = { data: currencyListUSD };

            $scope.loadDataWithRsi();
        }, function (error) { $log.error(error.message); });
    };
    
    //Second pass to load the RSI behind the scene as it take 20 second
    function loadDataWithRsi() {
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


    /* DYNAMIC TAB RELATED FUNCTIONS  */
    /* Remove tab from list of dynamic tabs */
    function removeTab(index) {
        $log.warn("Removing tab index " + index);
        $scope.currencyTabs.splice(index, 1);

        $timeout(function () {
            $scope.activeTab = 0;
            tabSelected(0);
        }, 350);
    };

    /* Upon user click add new tab
    TODO: don't add new tab if tab already exists*/
    function addTab(currencyName) {
        $scope.currencyTabs.push({ name: currencyName, logo: $scope.currencyLogo });

        $timeout(function () {
            $scope.activeTab = $scope.currencyTabs.length + 3;
        }, 350);
    }; 

    /* DYNAMIC TAB RELATED FUNCTIONS  */
    function refreshData() {
        $scope.loadData();
    };

});