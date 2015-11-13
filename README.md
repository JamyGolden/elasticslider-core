# ElasticSlider
A carousel for developers.

## Features
- Easily configurable
- Easily use the animation API to create a custom animations
- Optimised and built for modern applications
- Not bundled with bloat view logic, that is left to the framework implementation.
- [Angular](https://github.com/JamyGolden/Angular-ElasticSlider/) and [Polymer](https://github.com/JamyGolden/Polymer-ElasticSlider/) versions are supported

## Support
\>=IE10 and modern browsers.

## Options
### `activeSlide`
<Number> Sets the default active slide. This option defaults to the first slide.

### `animation`
<String> This accepts a string which references an animation type.
By default there are two options: `"slide"` and `"fade"`.
Extra animation functions can be added via plugins or via the animation API.
This option defaults to `"slide"`.

## Usage
#### HTML
    <div class="slider">
        <div>Slide one</div>
        <div>Slide two</div>
        <div>Slide three</div>
    </div>

#### Javascript
    var domElement = document.querySelector('.slider');
    var elasticSlider = new ElasticSlider(domElement);

ElasticSlider automatically turns child elements of `domElement` into slides.

## Class naming convention
CSS [BEM methodology](http://nicolasgallagher.com/about-html-semantics-front-end-architecture/) has been used.
The following classes are added automatically.

- `.ElasticSlider`: Module name
- `.ElasticSlider-container`: The child element of `ElasticSlider` and container of carousel items
- `.ElasticSlider-item`: Carousel items
- `.ElasticSlider-item--isActive`: Active carousel item
- `.ElasticSlider-item--clone`: Clone carousel item used for animation.

## rendered HTML

    <div class="ElasticSlider">
        <div class="ElasticSlider-container">
            <div class="ElasticSlider-item ElasticSlider-item--isActive"></div>
            <div class="ElasticSlider-item"></div>
            <div class="ElasticSlider-item"></div>
        </div>
    </div>


## Public methods
### destroy
Destroy reverts the elements back to the way they were before ElasticSlider was instantiated.

### toSlide
To slide sets the slide animation in motion.
#### params

    {
        index: Number,
        animation: String,
        startAnimationCallback: Function,
        endAnimationCallback: Function
    }


`index`: Number. The index of the next slide.
`animation`: String. _optional_ - The animation effect to be used.
`startAnimationCallback`: Function. _optional_ - Callback that is run just before the animation starts.
`endAnimationCallback`: Function. _optional_ - Callback that is run just as the animation ends.

### setProp
Set property.
`elasticSlider.setProp('key', 'value')`

### getProp
Get property.
`elasticSlider.getProp('key')`

### removeProp
Remove property.
`elasticSlider.removeProp('key')`

### animationInit
*Only used when creating a carousel slide transition animation.*
This function is run before the animation starts and is used to add classes and set up the animation. This function creates a cloned element of the target slide element which is used for animation manipulation.
#### params
Accepts a `Function` callback.

### animationStart
*Only used when creating a carousel slide transition animation.*
This method would be used to apply the HTML classes to the old slide as well as the cloned slide to perform the animation.
#### params
Accepts a `Function` callback.

### animationEnd
*Only used when creating a carousel slide transition animation.*
This function triggers a timeout. Once the timeout runs, the next slide is moved behind the cloned element. The old slide is hidden off "HTML canvas" and the "cloned element" is removed to reveal the static "real slide".

#### params
Accepts a millisecond `Number` which is used in a timeout. This timeout should correspond with the time it takes for the animationStart to complete.

## Animation
The only slide on the ElasticSlider HTML "canvas" is the active slide. The other slides are hidden off HTML "canvas".
When an animation is in progress, a "clone" element of the next slide is added for animation manipulation.

Below is an example of adding a very simple "fade" animation.

### CSS
    .ElasticSlider-item--animateCustomFadeInit {
        top: 0;
        left: 0;
        opacity: 0;
        transition: opacity 0.5s ease;
    }

    .ElasticSlider-item--animateCustomFadeStart {
        opacity: 1;
    }

### Javascript
The following should be set onto the window object before ElasticSlider is instantiated. ElasticSlider reads and extends the object into it's own animation object.

The `elasticSliderAnimationMap` value functions, as well as the `animationInit`, `animationStart` and `animationEnd` are bound via `bind` to the ElasticSlider class, therefore the `this` keyword refers to the ElasticSlider instantiation.

    window.elasticSliderAnimationMap = {
        'customFade': function() {
            this.animationInit(function() {
                this.elementList.cloneEl.classList.add('ElasticSlider-item--animateCustomFadeInit');
            });

            this.animationStart(function() {
                this.elementList.cloneEl.classList.add('ElasticSlider-item--animateCustomFadeStart');
            });

            this.animationEnd(500);
        }
    }

## Properties
Default properties that can be get and set via `getProp` and `setProp`.

### `isAnimating`
`Boolean` that indicates whether an animation is in progress or not.

### `activeSlideIndex`
`Number` indicating which slide is active.

### `nextActiveSlideIndex`
Setting this value affects which slide appears next. This value is for setting, not getting.
