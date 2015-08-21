// ============================================================================
// ElasticSlider
// Description still needed.
// Version: "0.0.1"
// Jamy Golden (http://css-plus.com/)
// https://github.com/JamyGolden/ElasticSlider
// License: MIT
// ============================================================================
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

    // ====================================================================
    // Public methods
    // ====================================================================
    // May be useful in future. No events to remove.
    destroy() {
        this.elementList.containerEl.removeChild(this.elementList.cloneEl);
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
            this._animationFunctionHash[animateType](this, index + 1)
        } else {
            this._endSlide(index);
        }
    }

    _endSlide() {
        this._setActiveSlide();

        // Remove clone
        this.elementList.containerEl.removeChild(this.elementList.cloneEl);
        this.elementList.cloneEl = null;
    }

    animationInit(cb) {
        if (typeof cb === 'function') {
            // Make sure the function runs in context of the class
            cb = cb.bind(this);
            cb();
        }
    }

    animationStart(cb) {
        var self = this;

        // Defer
        window.setTimeout(function() {
            if (typeof cb === 'function') {
                // Make sure the method runs in context of the class
                cb = cb.bind(self);
                cb();
            }
        }, 0);
    }

    animationEnd(duration, cb) {
        var self = this;

        window.setTimeout(function() {
            if (typeof cb === 'function') {
                // Make sure the method runs in context of the class
                cb = cb.bind(this);
                cb(index);
            }

            self._endSlide();
        }, duration || 100);
    }

    addAnimationFunction(name, func) {
        this._animationFunctionHash[name] = func.bind(this);
    }

    getElement(elName) {
        return this.elementList[elName];
    }

    // ====================================================================
    // Private methods
    // ====================================================================
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
        this.addAnimationFunction('fade', function()  {
            this.animationInit(function() {
                this.elementList.cloneEl.classList.add(`${this.NAMESPACE}-item--animateFadeStart`);
            });

            this.animationStart(function() {
                this.elementList.cloneEl.classList.add(`${this.NAMESPACE}-item--animateFadeEnd`);
            });

            this.animationEnd(200);
        });

        this.addAnimationFunction('slide', function(self) {
            this.animationInit(function() {
                this.elementList.cloneEl.classList.add(`${this.NAMESPACE}-item--animateSlideStart`);
            });

            this.animationStart(function() {
                this.elementList.cloneEl.classList.add(`${this.NAMESPACE}-item--animateSlideEnd`);
            });

            this.animationEnd(1000);
        });
    }
}
