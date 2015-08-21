'use strict'

class ElasticSlider {
    constructor(el, options) {
        this.slider = el;
        this.options = options;
        this.slidePromise = null;
        this.elementList = {};
        this.elementList.containerEl = this.slider.querySelector(`.ElasticSlider-container`);
        this.elementList.slideArr = this.elementList.containerEl.children;
        this.elementList.slideActiveEl = this.elementList.slideArr[options.activeSlide - 1];
        this.slideActiveIndex = options.activeSlide - 1;
        this._slideCount = this.elementList.slideArr.length;
        this.elementList.cloneEl = null;

        // Add classes
        // ====================================================================
        this.slider.classList.add('ElasticSlider');

        for (var i = 0; i < this.elementList.slideArr.length; i++) {
            var itemEl = this.elementList.slideArr[i]

            itemEl.classList.add('ElasticSlider-item');
        }

        this._setActiveSlide(this.slideActiveIndex);

        this.animateHash = {
            fade: function(self, index, cb) {
                // return function(this, index, cb) {
                    self.elementList.slideArr[index];
                    self.slideActiveIndex = index;
                    self.elementList.cloneEl.classList.add('ElasticSlider-item--animateFadeStart');

                    // Defer to force css transition onto start class
                    window.setTimeout(function() {
                        self.elementList.cloneEl.classList.add('ElasticSlider-item--animateFadeEnd');
                    }, 0);

                    window.setTimeout(function() {
                        if (typeof cb === 'function') cb(self, index);
                    }, 100)
            }
        }
    }

    destroy() {

    }

    startSlide(index, animateType) {
        // Index gets moved up one due to clone element
        this._createTransitionEl(index);

        // Handle odd index values
        if (index === 'next') index = this.slideActiveIndex + 1;
        if (index === 'prev') index = this.slideActiveIndex - 1;

        if (typeof index === 'undefined' || index > this._slideCount) {
            index = 0;
        } else if (index < 0) {
            index = this._slideCount;
        };

        if (animateType) {
            this.animateHash[animateType](this, index + 1, function(self, index){
                self.endSlide(index);
            })
        } else {
            this.endSlide(index);
        }
    }

    endSlide(index) {
        this._setActiveSlide(index);

        // Remove clone
        this.elementList.containerEl.removeChild(this.elementList.cloneEl);
        this.elementList.cloneEl = null;
    }

    _setActiveSlide(index) {
        for (var i = 0; i < this.elementList.slideArr.length; i++) {
            var slide = this.elementList.slideArr[i];

            slide.classList.remove('ElasticSlider-item--isActive');
        }

        this.elementList.slideArr[index].classList.add('ElasticSlider-item--isActive');
        this.slideActiveIndex = index;
    }
    
    _createTransitionEl(index) {
        if (this.elementList.cloneEl) {
            this.elementList.containerEl.removeChild(this.elementList.cloneEl);
        }
        this.elementList.cloneEl = this.elementList.slideArr[index].cloneNode(true);
        this.elementList.cloneEl.classList.add('ElasticSlider-item--clone')

        this.elementList.containerEl.insertBefore(this.elementList.cloneEl, this.elementList.slideArr[0]);
    }
}
