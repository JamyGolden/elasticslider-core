'use strict';

class ElasticSlider {
    constructor(el, options) {

        // Public properties
        // ====================================================================
        this.NAMESPACE = 'ElasticSlider';
        this.options = this._filterOptions(options);
        this.CLASS_NAME_LIST = {
            'container': `${this.NAMESPACE}-container`,
            'item': `${this.NAMESPACE}-item`,
            'itemActive': `${this.NAMESPACE}-item--isActive`,
            'itemClone': `${this.NAMESPACE}-item--clone`,
        }
        this._properties = new Map();

        // Class requirement pass check
        // ====================================================================
        this._checkClassRequirements(el);

        // Private properties
        // ====================================================================
        this._animationFunctionHash = {};
        this._slideCount = null;
        this._initialAnimationDelay = 50; // ms in which animation begins
        this._startAnimationUserCallback = () => {};
        this._endAnimationUserCallback = () => {};

        // Create animations
        // ====================================================================
        this._createAnimationFunctions();

        // Elements
        // ====================================================================
        this.elementList = {};
        this.elementList.slider = el;
        this.elementList.containerEl = this.elementList.slider.querySelector(`.${this.CLASS_NAME_LIST.container}`);
        this.elementList.slideArr = this.elementList.containerEl.children;
        this.elementList.slideActiveEl = this.elementList.slideArr[this.options.activeSlide - 1];
        this.elementList.cloneEl = null;
        this._slideCount = this.elementList.slideArr.length;

        // Run methods
        // ====================================================================
        this.setProp('activeSlideIndex', this.options.activeSlide - 1);
        this.setProp('nextActiveSlideIndex', this.options.activeSlide);
        this.setProp('isAnimating', false);

        // DOM manipulation
        // ====================================================================
        this.elementList.slider.classList.add(this.NAMESPACE);

        for (let i = 0; i < this.elementList.slideArr.length; i++) {
            let itemEl = this.elementList.slideArr[i]

            itemEl.classList.add(this.CLASS_NAME_LIST.item);
        }

        this._setActiveSlide(this.getProp('activeSlideIndex'));

        this._addCustomAnimationFunctions();
    }

    // ========================================================================
    // Public methods
    // ========================================================================
    // May be useful in future. No events to remove.
    destroy() {
        for (let k in this.CLASS_NAME_LIST) {
            // Only remove sub-module classes that begin with "item"
            // The other items aren't added via the core plugin, so don't
            // remove them.
            if (k.indexOf('item') !== 0) continue;

            let elementList = this.elementList.slider.querySelectorAll(`.${this.CLASS_NAME_LIST[k]}`);

            if (elementList.length) {
                // Loop through elements and remove classes
                for (let i = 0; i < elementList.length; i++) {
                    let element = elementList[i];
                    element.classList.remove(`${this.CLASS_NAME_LIST[k]}`);
                }
            }
        }

        this.elementList.slider.classList.remove(this.NAMESPACE);
    }

    toSlide(params = {}) {
        let {
            index,
            animation,
            startAnimationCallback,
            endAnimationCallback
        } = params;

        // Fallback
        // Allow for `params` to be a number.
        if (this._typeTest('number', params)) {
            params = { index: params };
            index = params.index;
        }
        else if (!this._typeTest('object', params)) {
            console.error('ElasticSlider.toSlide: params is expected to be an object. Eg. {index: 5}');
        }

        // `animation` fallback
        if (!this._typeTest('string', animation)) {
            animation = this.options.animation;
        }

        // Don't animate to the same slide
        // Don't animate while animating
        if (
            index === this.getProp('activeSlideIndex')
            || this.getProp('isAnimating') === true
        ) {
            return;
        };

        // Handle invalid index values
        if (!this._typeTest('number', index) || index > this._slideCount - 1) {
            index = 0;
        } else if (index < 0) {
            index = this._slideCount - 1;
        };

        // pause
        this._toggleActiveVideo(this.elementList.slideActiveEl.querySelectorAll('iframe'), false);

        this._createTransitionEl(index);
        this.setProp('nextActiveSlideIndex', index);
        this.setProp('isAnimating', true);

        // Set callback animations
        if (this._typeTest('function', startAnimationCallback)) {
            this._startAnimationUserCallback = startAnimationCallback;
        }

        if (this._typeTest('function', endAnimationCallback)) {
            this._endAnimationUserCallback = endAnimationCallback;
        }

        if (this._typeTest('string', animation)) {
            this._startAnimationUserCallback();
            this._animationFunctionHash[animation](this, index + 1)
        } else {
            this._endSlide(index);
        }
    }

    animationInit(cb) {
        if (this._typeTest('function', cb)) {
            // Run the method in context of the class
            cb = cb.bind(this);
            cb();
        }
    }

    animationStart(cb) {
        let self = this;

        // Defer
        window.setTimeout(() => {
            if (this._typeTest('function', cb)) {
                // Run the method in context of the class
                cb = cb.bind(self);
                cb();
            }
        }, this._initialAnimationDelay);
    }

    animationEnd(duration = 100, cb) {
        let self = this;
        let totalDuration = (duration) + this._initialAnimationDelay;

        window.setTimeout(() => {
            if (this._typeTest('function', cb)) {
                // Run the method in context of the class
                cb = cb.bind(self);
                cb();
            }

            self._endSlide();
        }, totalDuration);
    }

    addAnimationFunction(name, func) {
        if (this._typeTest('string', name) && this._typeTest('function', func)) {
            this._animationFunctionHash[name] = func.bind(this);
        } else {
            console.error('ElasticSlider.addAnimationFunction: Parameters must be name<String>, func<Function>');
        }
    }

    getElement(elName) {
        return this.elementList[elName];
    }

    getProp(propName) {
        return this._properties.get(propName);
    }

    setProp(propName, val) {
        this._properties.set(propName, val);
    }

    removeProp(propName, val) {
        this._properties.delete(propName);
    }

    // ========================================================================
    // Private methods
    // ========================================================================
    _filterOptions(o = {}) {
        if (!this._typeTest('number', o.activeSlide)) o.activeSlide = 1;
        if (!this._typeTest('string', o.animation)) o.animation = 'slide';

        return o;
    }

    _checkClassRequirements(el) {
        let requiredElementsArr = [
            this.CLASS_NAME_LIST.container
        ];

        requiredElementsArr.forEach((item) => {
            let element = el.querySelector(`.${item}`);

            if (!element) {
                throw `Required element .${item} missing. Please use an ElasticSlider UI plugin or read the documentation.`;
            }
        });
    }

    _endSlide() {
        this._setActiveSlide();
        this.setProp('isAnimating', false);

        // Remove clone
        this.elementList.containerEl.removeChild(this.elementList.cloneEl);
        this.elementList.cloneEl = null;

        // `toSlide` callback
        this._endAnimationUserCallback();

        // Play any videos
        this._toggleActiveVideo(this.elementList.slideActiveEl.querySelectorAll('iframe'), true);

        // Reset callbacks
        this._startAnimationUserCallback = () => {};
        this._endAnimationUserCallback = () => {};
    }

    _setActiveSlide(index = this.getProp('nextActiveSlideIndex')) {
        // Remove the active class name from all elements
        for (let i = 0; i < this.elementList.slideArr.length; i++) {
            let slide = this.elementList.slideArr[i];

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

    // Animations. These are the default animations. Any extra animations
    // should be added via the external add method
    _createAnimationFunctions() {
        this.addAnimationFunction('fade', () =>  {
            this.animationInit(() => {
                this.elementList.cloneEl.classList.add(`${this.NAMESPACE}-item--animateFadeInit`);
            });

            this.animationStart(() => {
                this.elementList.cloneEl.classList.add(`${this.NAMESPACE}-item--animateFadeStart`);
            });

            this.animationEnd(600);
        });

        this.addAnimationFunction('slide', () => {
            let direction = null; // Determines which direction to slide
            let animationDirection = this.getProp('animationDirection');
            let nextActiveSlideIndex = this.getProp('nextActiveSlideIndex')
            let activeSlideIndex = this.getProp('activeSlideIndex')

            // If an explicit direction has been set
            if (animationDirection) {
                direction = animationDirection;
            }
            // Otherwise greater index means next
            else if (nextActiveSlideIndex > activeSlideIndex) {
                direction = 'next';
            }
            else {
                direction = 'prev';
            };

            // Capitalise direction for class cammel case
            direction = direction.substring(0, 1).toUpperCase() + direction.substring(1);

            this.animationInit(() => {
                this.elementList.cloneEl.classList.add(
                    `${this.NAMESPACE}-item--animate${direction}SlideInit`
                );
                this.elementList.slideActiveEl.classList.add(
                    `${this.NAMESPACE}-item--animateActive${direction}SlideInit`
                );
            });

            this.animationStart(() => {
                this.elementList.cloneEl.classList.add(
                    `${this.NAMESPACE}-item--animate${direction}SlideStart`
                );
                this.elementList.slideActiveEl.classList.add(
                    `${this.NAMESPACE}-item--animateActive${direction}SlideStart`
                );
            });

            this.animationEnd(1000, () => {
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

    // Allows for animations functions to be inserted from an external source
    _addCustomAnimationFunctions() {
        let customAnimationMap = window.elasticSliderAnimationMap;

        if (this._typeTest('object', customAnimationMap)) {
            for (let name in customAnimationMap) {
                this.addAnimationFunction(name, customAnimationMap[name]);
            }
        }
    }

    _typeTest(type, item) {
        let pass = false;

        switch (type) {
            case 'object':
                if (
                    typeof item === 'object' &&
                    item !== null &&
                    typeof item.length === 'undefined'
                ) {
                    pass = true;
                }
                break;

            case 'array':
                if (
                    typeof item === 'object' &&
                    item !== null &&
                    typeof item.length === 'number'
                ) {
                    pass = true;
                }
                break;

            case 'function':
                if (typeof item === 'function') {
                    pass = true;
                }
                break;

            case 'string':
                if (typeof item === 'string') {
                    pass = true;
                }
                break;

            case 'boolean':
                if (typeof item === 'boolean') {
                    pass = true;
                }
                break;

            case 'number':
                if (typeof item === 'number' && !isNaN(item)) {
                    pass = true;
                }
                break;
        }

        return pass;
    }

    // Play/pause youtube videos
    _toggleActiveVideo(elArr, enableBool) {
        var func = enableBool === true ? 'playVideo' : 'pauseVideo';

        // If elements have been passed through
        if (elArr.length) {
            // Run a play/pause on all videos in the slide
            for (var i = 0; i < elArr.length; i++) {
                if (elArr[i].src.indexOf('enablejsapi=true') !== -1) {
                    // Send the play/pause command
                    elArr[i].contentWindow.postMessage(
                        '{"event":"command","func":"' + func + '","args":""}', '*'
                    );
                }
            }
        }
    }
}

// Enable module support
if (typeof module === 'object' && module.exports) {
    module.exports = ElasticSlider;
} else {
    let obj = this || window;

    obj.ElasticSlider = ElasticSlider;
}
