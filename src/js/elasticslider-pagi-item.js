// ============================================================================
// ElasticSlider Pagination Item
// Polymer element used within ElasticSlider
// Version: "0.0.1"
// Jamy Golden (http://css-plus.com/)
// https://github.com/JamyGolden/ElasticSlider
// License: MIT
// ============================================================================

(function(){
    'use strict';

    Polymer({
        is: 'elastic-slider-pagi-item',
        properties: {
            model: {
                type: Object,
                value: function() {
                    return {}
                }
            },
            activeSlide: {
                type: Number,
                notify: true,
                value: 0,
            },
            isDisabled: {
                type: Boolean,
                value: function() {
                    return false;
                },
                observer: 'test'
            }
        },
        test: function(a) {
            console.log(a)
        },
        setActive: function () {
            if (this.isDisabled === false) {
                this.activeSlide = this.model.index + 1;
            }
        },
        getClassList: function(activeSlide) {
            var classList = 'ElasticSlider-pagiItem';

            if (this.model.index === (activeSlide - 1)) classList += ' ElasticSlider-pagiItem--isActive';

            return classList;
        },
    });
})();
