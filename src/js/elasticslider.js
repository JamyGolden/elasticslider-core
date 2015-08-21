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
        this.properties = {};
        this.setProp('activeSlideIndex', options.activeSlide - 1);
        this.setProp('nextActiveSlideIndex', null);
        this.setProp('isAnimating', false);

        // Private properties
        // ====================================================================
        this._animationFunctionHash = {};
        this._slideCount = null;
        this._initialAnimationDelay = 50; // ms in which animation begins

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

        this._setActiveSlide(this.getProp('activeSlideIndex'));
    }

    // ====================================================================
    // Public methods
    // ====================================================================
    // May be useful in future. No events to remove.
    destroy() {
        this.elementList.containerEl.removeChild(this.elementList.cloneEl);
    }

    toSlide(index, animateType) {
        // Don't animate to the same slide
        // Don't animate while animating
        if (
            index === this.getProp('activeSlideIndex')
            || this.getProp('isAnimating') === true
        ) {
            return;
        };

        // Handle invalid index values
        if (typeof index !== 'number' || index > this._slideCount - 1) {
            index = 0;
        } else if (index < 0) {
            index = this._slideCount - 1;
        };

        this._createTransitionEl(index);
        this.setProp('nextActiveSlideIndex', index);
        this.setProp('isAnimating', true);

        if (animateType) {
            this._animationFunctionHash[animateType](this, index + 1)
        } else {
            this._endSlide(index);
        }
    }

    animationInit(cb) {
        if (typeof cb === 'function') {
            // Run the method in context of the class
            cb = cb.bind(this);
            cb();
        }
    }

    animationStart(cb) {
        var self = this;

        // Defer
        window.setTimeout(function() {
            if (typeof cb === 'function') {
                // Run the method in context of the class
                cb = cb.bind(self);
                cb();
            }
        }, this._initialAnimationDelay);
    }

    animationEnd(duration, cb) {
        var self = this;
        var totalDuration = (duration || 100) + this._initialAnimationDelay;

        window.setTimeout(function() {
            if (typeof cb === 'function') {
                // Run the method in context of the class
                cb = cb.bind(self);
                cb();
            }

            self._endSlide();
        }, totalDuration);
    }

    addAnimationFunction(name, func) {
        this._animationFunctionHash[name] = func.bind(this);
    }

    getElement(elName) {
        return this.elementList[elName];
    }

    getProp(propName) {
        return this.properties[propName];
    }

    setProp(propName, val) {
        this.properties[propName] = val;
    }

    removeProp(propName, val) {
        delete this.properties[propName];
    }

    // ====================================================================
    // Private methods
    // ====================================================================

    _endSlide() {
        this._setActiveSlide();
        this.setProp('isAnimating', false);

        // Remove clone
        this.elementList.containerEl.removeChild(this.elementList.cloneEl);
        this.elementList.cloneEl = null;
    }

    _setActiveSlide(index) {
        // Use slide pased in or the next slide
        if (!index) index = this.getProp('nextActiveSlideIndex');

        // Remove the active class name from all elements
        for (var i = 0; i < this.elementList.slideArr.length; i++) {
            var slide = this.elementList.slideArr[i];

            slide.classList.remove(this.CLASS_NAME_LIST.itemActive);
        }

        this.elementList.slideActiveEl = this.elementList.slideArr[index];
        this.elementList.slideActiveEl.classList.add(this.CLASS_NAME_LIST.itemActive);
        // Set active index and remove target item active index
        this.setProp('activeSlideIndex', index);
        this.setProp('nextActiveSlideIndex', null);
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
                this.elementList.cloneEl.classList.add(`${this.NAMESPACE}-item--animateFadeInit`);
            });

            this.animationStart(function() {
                this.elementList.cloneEl.classList.add(`${this.NAMESPACE}-item--animateFadeStart`);
            });

            this.animationEnd(600);
        });

        this.addAnimationFunction('slide', function() {
            var direction = null; // Determines which direction to slide
            var animationDirection = this.getProp('animationDirection');

            // If an explicit direction has been set
            if (animationDirection) {
                direction = animationDirection;
            }
            // Otherwise greater index means next
            else if (this.getProp('nextActiveSlideIndex') > this.getProp('activeSlideIndex')) {
                direction = 'Next';
            }
            else {
                direction = 'Prev';
            };


            this.animationInit(function() {
                this.elementList.cloneEl.classList.add(
                    `${this.NAMESPACE}-item--animate${direction}SlideInit`
                );
                this.elementList.slideActiveEl.classList.add(
                    `${this.NAMESPACE}-item--animateActive${direction}SlideInit`
                );
            });

            this.animationStart(function() {
                this.elementList.cloneEl.classList.add(
                    `${this.NAMESPACE}-item--animate${direction}SlideStart`
                );
                this.elementList.slideActiveEl.classList.add(
                    `${this.NAMESPACE}-item--animateActive${direction}SlideStart`
                );
            });

            this.animationEnd(1000, function(){
                this.elementList.slideActiveEl.classList.remove(
                    `${this.NAMESPACE}-item--animateActive${direction}SlideInit`
                );
                this.elementList.slideActiveEl.classList.remove(
                    `${this.NAMESPACE}-item--animateActive${direction}SlideStart`
                );

                // Don't allow this to be cached permanently
                this.removeProp('animationDirection');
            });
        });
    }
}
