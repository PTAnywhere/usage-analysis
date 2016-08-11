angular.module('ptAnywhere.dashboard.stateDiagram')
    .directive('slider', [function() {
        var slider;

        function updateLimits(newMax) {
            if (newMax > 1) {  // Because min and max cannot have the same value
                var previousValue = slider.noUiSlider.get();
                slider.noUiSlider.updateOptions({
                    range: {
                        'min': 1,
                        'max': newMax
                    }
                });
                // "By default, the sliders values remain unchanged."
                if (previousValue > newMax) {
                    slider.noUiSlider.set(newMax);
                }
                slider.removeAttribute('disabled');
            } else {
                slider.setAttribute('disabled', true);
            }
        }

        return {
            restrict: 'C',
            require: 'ngModel',
            scope: {
                rangeMax: '=',
                onSlide: '&'
            },
            link: function($scope, $element, $attrs, ngModelCtrl) {
                slider = $element[0];

                noUiSlider.create(slider, {
                    start: 0,
                    connect: 'lower',
                    step: 1,
                    range: {
                        'min': 0,
                        'max': 1
                    },
                    format: {
                        // No formatting (not event between string and int), just integers
                        to: function(value) {
                            return value;
                        },
                        from: function(value) {
                            return value;
                        }
                    }
                });
                slider.removeAttribute('disabled');


                $scope.$watch('rangeMax', function(newMax, oldMax) {
                    updateLimits(newMax);
                });

                slider.noUiSlider.on('slide', function(values){
                    // Apparently during the slide event the "step" option is ignored.
                    $scope.onSlide({ value: Math.round(values[0]) });
                });

                // Data changed outside of AngularJS
                slider.noUiSlider.on('change', function(values){
                    // Also tell AngularJS that it needs to update the UI
                    $scope.$apply(function() {
                        // Set the data within AngularJS
                        ngModelCtrl.$setViewValue(values[0]);
                    });
                });

                // When data changes inside AngularJS
                // Notify the third party directive of the change
                ngModelCtrl.$render = function() {
                    slider.noUiSlider.set(ngModelCtrl.$viewValue);
                };
            }
        };
    }]);