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

            enableAutoSlide: {
                type: Boolean
            }
        },

        toSlide: function(e, detail, sender) {
            let val = e.model.item;

            if (typeof val === 'number') {
                this.slider.startSlide(val, 'fade');
            } else {
                this.slider.startSlide(val);
            }
        },
        ready: function() {
            // Get range array of slides for pagination
            this.pagiArr = _range(this.querySelector('.ElasticSlider-container').children.length);

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
