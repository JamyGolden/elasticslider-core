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
                return function() {
                    self.elementList.slideArr[index];
                }
            }
        }
    }

    destroy() {

    }

    startSlide(index, animateType) {
        // Handle odd index values
        if (index === 'next') index = this.slideActiveIndex + 1;
        if (index === 'prev') index = this.slideActiveIndex - 1;
this._createTransitionEl(index)
        if (typeof index === 'undefined' || index > this._slideCount) {
            index = 0;
        } else if (index < 0) {
            index = this._slideCount;
        };

        if (animateType) {
            this.animateHash[animateType](this, index)(function(){
                this.endSlide(index);
            })
        } else {
            this.endSlide(index);
        }

        // window.setTimeout(function(){
        // }, 2000);

        // this.animateTo();
        // this.slidePromise = new Promise(function(resolve, reject) {
        //     // do a thing, possibly async, then…
        //     // if (true) {
        //     //     resolve("Stuff worked!");
        //     // }
        //     // else {
        //     //     reject(Error("It broke"));
        //     // }
        // });
        //
        // this.slidePromise.then(function(){
        //     console.log('resolved!')
        // })
    }

    endSlide(index) {
        this._setActiveSlide(index);

        console.log(this.slidePromise)
    }

    _setActiveSlide(index) {
        for (var i = 0; i < this.elementList.slideArr.length; i++) {
            var slide = this.elementList.slideArr[i];

            slide.classList.remove('ElasticSlider-item--isActive');
        }

        this.elementList.slideArr[index].classList.add('ElasticSlider-item--isActive');
        this.slideActiveIndex = index;
    }

    _animateFade() {

    }

    _createTransitionEl(index) {
        if (this.elementList.cloneEl) {
            this.elementList.containerEl.removeChild(this.elementList.cloneEl);
        }
        this.elementList.cloneEl = this.elementList.slideArr[index].cloneNode(true);

        this.elementList.containerEl.insertBefore(this.elementList.cloneEl, this.elementList.slideArr[0]);
    }
}
