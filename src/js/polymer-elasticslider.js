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

            autoPlayDuration: {
                type: Number,
                value: 0
            },

            animation: {
                type: String,
                value: 'slide'
            }
        },

        toSlide: function(e) {
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

            // Reset autoPlay interval
            if (this.autoPlayDuration > 0) {
                this.stopAutoPlay();
                this.startAutoPlay();
            }
        },

        ready: function() {
            // Get range array of slides for pagination
            this.autoPlayInterval = null;
            this.pagiArr = _range(this.querySelector('.ElasticSlider-container').children.length);
            this.arrowArr = ['Prev', 'Next'];
            // Init slider
            let sliderOptions = {
                activeSlide: this.activeSlide
            };

            this.slider = new ElasticSlider(this, sliderOptions);

            if (this.autoPlayDuration > 0) {
                this.startAutoPlay();
            }
        },

        startAutoPlay: function() {
            var self = this;
            // If autoPlay is set
            this.autoPlayInterval = window.setInterval(function() {
                var index = self.slider.getProp('activeSlideIndex') +1;

                self.slider.setProp('animationDirection', 'Next');
                self.slider.toSlide(index, self.animation);
            }, this.autoPlayDuration)
        },

        stopAutoPlay: function() {
            window.clearInterval(this.autoPlayInterval);
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
