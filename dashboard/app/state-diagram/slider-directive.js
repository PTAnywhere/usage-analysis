angular.module('ptAnywhere.dashboard.stateDiagram')
    .directive('slider', [function() {
        var slider;

        function getEventValue(value) {
            return { value: Math.floor(value) };
        }

        function updateLimits(newMax, $scope) {
            if (newMax > 1) {  // Because min and max cannot have the same value
                var oldSliderVal = Math.floor( slider.noUiSlider.get()[0] );

                slider.noUiSlider.updateOptions({
                    range: {
                        'min': 1,
                        'max': newMax
                    }
                });

                if (oldSliderVal === 0 || newMax < oldSliderVal) {
                    slider.noUiSlider.set((newMax>=3)? 3: newMax);
                }

                slider.removeAttribute('disabled');
            } else {
                slider.setAttribute('disabled', true);
            }
        }

        return {
            restrict: 'C',
            scope: {
                onSlide: '&',
                onChange: '&',
                sliderMax: '='
            },
            link: function($scope, $element, $attrs) {
                slider = $element[0];

                noUiSlider.create(slider, {
                    start: 0,
                    connect: 'lower',
                    step: 1,
                    range: {
                        'min': 0,
                        'max': 1
                    }
                });

                slider.noUiSlider.on('slide', function(values){
                    $scope.onSlide(getEventValue(values[0]));
                });

                slider.noUiSlider.on('set', function(values){
                    $scope.onChange(getEventValue(values[0]));
                });

                updateLimits($scope.sliderMax, $scope);

                $scope.$watch('sliderMax', function(newMax, oldMax) {
                    updateLimits(newMax, $scope);
                });
            }
        };
    }]);