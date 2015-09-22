(function(){
    'use strict';

    Polymer({
        is: 'elastic-slider',
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

        observers: [
            'updatePagi(activeSlide)'
        ],

        updatePagi: function(itemNum) {
            if (!this.slider) return; // This triggers on init

            this.toSlide(itemNum - 1);
        },

        clickToSlide: function(e) {
            let val = e.model.item;
            let index;

            // Determine next slide index
            if (typeof val === 'number') {
                index = val - 1;
            } else if (val === 'Prev'){
                index = this.slider.getProp('activeSlideIndex') - 1;

                this.slider.setProp('animationDirection', 'Prev');
            } else {
                index = this.slider.getProp('activeSlideIndex') + 1;

                this.slider.setProp('animationDirection', 'Next');
            }

            index = this._getTargetIndex(index);

            this.toSlide(index);
        },

        toSlide: function(index) {
            let self = this;

            this.disablePagi = true;
            // Go to slide, once done, set active

            this.slider.toSlide({
                index: index,
                animation: this.animation,
                startAnimationCallback: function(){
                    self.activeSlide = index + 1;
                },
                endAnimationCallback: function(){
                    self.disablePagi = false;
                }
            });

            // Reset autoPlay interval
            if (this.autoPlayDuration > 0) {
                this.stopAutoPlay();
                this.startAutoPlay();
            }
        },

        ready: function() {
            let sliderOptions = {
                activeSlide: this.activeSlide,
                animation: this.animation
            };

            // Get range array of slides for pagination
            this.autoPlayInterval = null;
            this.pagiArr = [];
            this.totalSlides = this.querySelector('.ElasticSlider-container').children.length;
            this.arrowArr = ['Prev', 'Next'];
            this.disablePagi = false;

            // Init slider
            this.pagiArr = this._pagiFactory(this.totalSlides);
            this.slider = new ElasticSlider(this, sliderOptions);

            if (this.autoPlayDuration > 0) {
                this.startAutoPlay();
            }
        },

        startAutoPlay: function() {
            let self = this;

            // If autoPlay is set
            this.autoPlayInterval = window.setInterval(function() {
                let index = self._getTargetIndex(
                    self.slider.getProp('activeSlideIndex') + 1
                );

                // Set direction
                self.slider.setProp('animationDirection', 'Next');

                self.toSlide(index);

            }, this.autoPlayDuration)
        },

        stopAutoPlay: function() {
            window.clearInterval(this.autoPlayInterval);
        },

        _pagiFactory: function(num) {
            var arr = [];

            for (let i = 0; i < num; i++) {
                arr.push({
                    index: i,
                    isActive: (self.activeSlide - 1) === i,
                    type: 'pagi'
                });
            }

            return arr;
        },

        _getTargetIndex: function(num) {
            if (num < 0) {
                num = this.totalSlides - 1;
            } else if (num > this.totalSlides - 1) {
                num = 0;
            }

            return num;
        }
    });

})();
