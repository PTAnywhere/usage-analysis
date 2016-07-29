angular.module('ptAnywhere.dashboard.stateDiagram')
    .directive('slider', [function() {
        var container;

        function createSlider(element, onSlide, onStop) {
            container = $(element.find('div')[0]);
            container.slider({range: "min", slide: onSlide, stop: onStop});
        }

        function getValue() {
            return container.slider('value');
        }

        function updateLimits(newMax, $scope) {
            // The order is importante: if min changes and the slider is there, it will get the new value
            var oldSliderVal = getValue();
            container.slider('option', 'min', (newMax === 0)? 0: 1);
            container.slider('option', 'max', newMax);

            if (oldSliderVal === 0 || newMax < oldSliderVal) {
                container.slider('value', (newMax>=3)? 3: newMax);
                // Trigger the event (not done automatically when we change the value programmatically)
                $scope.onChange({value: getValue()});
            }
        }

        return {
            restrict: 'C',
            template: '<div></div>',
            scope: {
                onSlide: '&',
                onChange: '&',
                sliderMax: '='
            },
            link: function($scope, $element, $attrs) {
                createSlider($element, function(event, ui) {
                    $scope.onSlide({value: ui.value});
                },
                function(event, ui) {
                    $scope.onChange({value: ui.value});
                });
                updateLimits($scope.sliderMax, $scope);

                $scope.$watch('sliderMax', function(newMax, oldMax) {
                    updateLimits(newMax, $scope);
                });
            }
        };
    }]);