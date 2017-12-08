myApp.directive('chart', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div></div>',
        scope: {
            title: '@',
            data: '=',
            indicators: '=',
            ismacdvisible: '=',
            macdheight: '=',
            volumeheight: '=',
            loading: '=',
            enablenavigator: '=',
            enablerangeselector: '=',
        },
        link: function (scope, element, attrs) {
            var char;
           
            var process = function () {
                var defaultOptions = {
                    chart: { renderTo: element[0] },
                };
                var chartOption = {
                    chart: {
                        zoomType: 'x',
                        spacingTop: 15,
                        spacingBottom: 15,
                        spacingLeft: 15,
                        spacingRight: 15,
                    },
                    loading: true,
                    tooltip: {
                        enabledIndicators: true,
                       
                    },
                    title: {
                        text: scope.title
                    },
                    navigator: {
                        enabled: scope.enablenavigator
                    },
                    rangeSelector: {
                        enabled: scope.enablerangeselector
                    },
                    scrollbar: {
                        enabled: false
                    },
                    colors: ['#00A1E2', '#6769B5', '#3BC3A3', '#93959B', '#2D8F78', '#C3842F', '#005EA4'],
                    
                    indicators: scope.indicators,
                    xAxis: {
                        crosshair: true,
                        type: 'datetime',
                        title: {
                            text: 'Date'
                        },
                        minTickInterval: 5,
                        minorTickInterval: 1
                    },
                    yAxis: [{
                        crosshair: true,
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: '',
                        },
                        height: '68%',
                        lineWidth: 2,
                    }, {
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: 'Volume'
                        },
                        top: '70%',
                        height: scope.volumeheight,
                        offset: 0,
                        lineWidth: 2
                        }, {
                        labels: {
                            align: 'right',
                            x: -3
                        },
                        title: {
                            text: 'macd'
                        },
                        top: '85%',
                        height: scope.macdheight,
                        offset: 0,
                        lineWidth: 2,
                        visible: scope.ismacdvisible
                        }],
                    legend: {
                        enabled: true
                    },
                    series: scope.data
                };

                var config = angular.merge(defaultOptions, chartOption);
                char = new Highcharts.StockChart(config);
            };
            process();
            scope.$watch("data", function (loading) {
                process();
            });
            scope.$watch("title", function (loading) {
                process();
            });
            scope.$watch("indicators", function (loading) {
                process();
            });
            scope.$watch("ismacdvisible", function (loading) {
                process();
            });
            scope.$watch("macdheight", function (loading) {
                process();
            });
            
            scope.$watch("enableRangeSelector", function (loading) {
                
                process();
               
            });
            scope.$watch("loading", function (loading) {
                if (!char) {
                    return;
                }
                if (loading) {
                    char.showLoading();
                } else {
                    char.hideLoading();
                }
            });
        }
    };
});