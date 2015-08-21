'use strict'

class ElasticSlider {
    constructor(el, options) {
        // Public properties
        // ====================================================================
        this.NAMESPACE = 'ElasticSlider';
        this.CLASS_NAME_LIST = {
            'container': `${this.NAMESPACE}-container`,
            'item': `${this.NAMESPACE}-item`,
            'itemActive': `${this.NAMESPACE}-item--isActive`,
            'itemClone': `${this.NAMESPACE}-item--clone`,
        }
        this.options = options;
        this.slideActiveIndex = options.activeSlide - 1;
        this.nextSlideActiveIndex = null;

        // Private properties
        // ====================================================================
        this._animationFunctionHash = {};
        this._slideCount = null;

        // Create animations
        // ====================================================================
        this._createAnimationFunctions();

        // Elements
        // ====================================================================
        this.elementList = {};
        this.elementList.slider = el;
        this.elementList.containerEl = this.elementList.slider.querySelector(`.${this.CLASS_NAME_LIST.container}`);
        this.elementList.slideArr = this.elementList.containerEl.children;
        this.elementList.slideActiveEl = this.elementList.slideArr[options.activeSlide - 1];
        this.elementList.cloneEl = null;
        this._slideCount = this.elementList.slideArr.length;

        // DOM manipulation
        // ====================================================================
        this.elementList.slider.classList.add(this.NAMESPACE);

        for (var i = 0; i < this.elementList.slideArr.length; i++) {
            var itemEl = this.elementList.slideArr[i]

            itemEl.classList.add(this.CLASS_NAME_LIST.item);
        }

        this._setActiveSlide(this.slideActiveIndex);
    }

    destroy() {

    }

    startSlide(index, animateType) {
        // Can't animate to the same slide
        if (index === this.slideActiveIndex) return;

        this._createTransitionEl(index);

        // Handle odd index values
        if (index === 'next') index = this.nextSlideActiveIndex + 1;
        if (index === 'prev') index = this.nextSlideActiveIndex - 1;

        if (typeof index === 'undefined' || index > this._slideCount) {
            index = 0;
        } else if (index < 0) {
            index = this._slideCount;
        };

        this.nextSlideActiveIndex = index;

        if (animateType) {
            this._animationFunctionHash[animateType](this, index + 1, function(self, index){
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

    animationInit(cb) {
        if (typeof cb === 'function') cb();
    }

    animationStart(cb) {
        // Defer
        window.setTimeout(function() {
            if (typeof cb === 'function') cb();
        }, 0);
    }

    animationEnd(duration, cb) {
        var self = this;
        var index = self.nextSlideActiveIndex;

        window.setTimeout(function() {
            if (typeof cb === 'function') cb(self, index);

            self.endSlide(index);
        }, duration || 100);
    }

    addAnimationFunction(name, func) {
        this._animationFunctionHash[name] = func;
    }

    getElement(elName) {
        return this.elementList[elName];
    }

    _setActiveSlide(index) {
        // Use slide pased in or the next slide
        if (!index) index = this.nextSlideActiveIndex;

        // Remove the active class name from all elements
        for (var i = 0; i < this.elementList.slideArr.length; i++) {
            var slide = this.elementList.slideArr[i];

            slide.classList.remove(this.CLASS_NAME_LIST.itemActive);
        }

        this.elementList.slideArr[index].classList.add(this.CLASS_NAME_LIST.itemActive);

        // Set active index and remove target item active index
        this.slideActiveIndex = index;
        this.nextSlideActiveIndex = null;
    }

    _createTransitionEl(index) {
        if (this.elementList.cloneEl) {
            this.elementList.containerEl.removeChild(this.elementList.cloneEl);
        }

        // Create el
        this.elementList.cloneEl = this.elementList.slideArr[index].cloneNode(true);
        this.elementList.cloneEl.classList.add(this.CLASS_NAME_LIST.itemClone)

        // Add to dom
        this.elementList.containerEl.appendChild(this.elementList.cloneEl);
    }

    _createAnimationFunctions() {
        this.addAnimationFunction('fade', function(self, index, cb) {
            self.animationInit(function() {
                self.elementList.cloneEl.classList.add('ElasticSlider-item--animateFadeStart');
            });

            self.animationStart(function() {
                self.elementList.cloneEl.classList.add('ElasticSlider-item--animateFadeEnd');
            });

            self.animationEnd(200);
        });

        this.addAnimationFunction('slide', function(self, index, cb) {
            self.animationInit(function() {
                self.elementList.cloneEl.classList.add('ElasticSlider-item--animateSlideStart');
            });

            self.animationStart(function() {
                self.elementList.cloneEl.classList.add('ElasticSlider-item--animateSlideEnd');
            });

            self.animationEnd(1000);
        });
    }
}
