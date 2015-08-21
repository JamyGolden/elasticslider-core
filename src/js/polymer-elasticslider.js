// ============================================================================
// ElasticSlider
// Description still needed.
// Version: "0.0.1"
// Jamy Golden (http://css-plus.com/)
// https://github.com/JamyGolden/ElasticSlider
// License: MIT
// ============================================================================

(function(){
    'use strict';

    Polymer({
        is: "elastic-slider",
        properties: {
            activeSlide: {
                type: Number,
                value: 1
            },
            enableArrows: {
                type: Boolean
            },

            enablePagination: {
                type: Boolean
            },

            animation: {
                type: String,
                value: 'slide'
            }
        },

        toSlide: function(e, detail, sender) {
            let val = e.model.item;
            let index = null;

            // Determine next slide index
            if (typeof val === 'number') {
                index = val;
            } else if (val === 'Prev'){
                index = this.slider.getProp('activeSlideIndex') -1;

                this.slider.setProp('animationDirection', 'Prev');
            } else {
                index = this.slider.getProp('activeSlideIndex') +1;

                this.slider.setProp('animationDirection', 'Next');
            }

            this.slider.toSlide(index, this.animation);
        },

        ready: function() {
            // Get range array of slides for pagination
            this.pagiArr = _range(this.querySelector('.ElasticSlider-container').children.length);
            this.arrowArr = ['Prev', 'Next'];
            // Init slider
            let sliderOptions = {
                activeSlide: this.activeSlide
            };

            this.slider = new ElasticSlider(this, sliderOptions);
        }
    });

    function _range(num) {
        let arr = [];

        for (let i = 0; i < num; i++) {
            arr[i] = i;
        }

        return arr;
    }
})();
