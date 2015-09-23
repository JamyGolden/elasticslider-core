(function(){
    'use strict';

    Polymer({
        is: 'elastic-slider-pagi-item',
        properties: {
            model: {
                type: Object,
                value: function() {
                    return {}
                },
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
            }
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
