myApp.directive('chart', function () {
    return {
        restrict: 'E',
        replace: true,
        template: '<div></div>',
        scope: {
            title: '@',
            data: '=',
            indicators: '=',
            loading: '='
        },
        link: function (scope, element, attrs) {
            var char;
            var process = function () {
                var defaultOptions = {
                    chart: { renderTo: element[0] },
                };

                var chartOption = {
                    chart: {
                        zoomType: 'x'
                    },
                    loading: true,
                    tooltip: {
                        enabledIndicators: true
                    },
                    title: {
                        text: scope.title
                    },
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
                    indicators: scope.indicators,
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