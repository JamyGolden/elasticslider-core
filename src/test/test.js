window.onload = function() {
    var sliderEl = document.querySelector('.slider');
    var defaultOptions = {
        activeSlide: 2
    };
    var elasticSlider = new ElasticSlider(sliderEl, defaultOptions);
    var totalSlideCount = document.querySelector('.ElasticSlider-container').children.length;

    QUnit.test('slider options test', function(assert) {
        var activeIndex = elasticSlider.getProp('activeSlideIndex');

        assert.equal(activeIndex, defaultOptions.activeSlide - 1, 'Passed!');
    });

    QUnit.test('first to last slide test', function( assert ) {
        assert.expect(1);

        var done = assert.async();
        var index = 0;

        elasticSlider.toSlide({
            index: -1,
            endAnimationCallback: function() {
                var activeIndex = elasticSlider.getProp('activeSlideIndex');

                assert.equal(activeIndex, totalSlideCount - 1, 'First slide to last slide successful!');
                done();
            }
        });
    });

    QUnit.test('last to first slide test', function( assert ) {
        assert.expect(1);

        var done = assert.async();

        elasticSlider.toSlide({
            index: totalSlideCount,
            endAnimationCallback: function() {
                var activeIndex = elasticSlider.getProp('activeSlideIndex');

                assert.equal(activeIndex, 0, 'Last slide to first slide successful!');
                done();
            }
        });
    });

    QUnit.test('slide to slide 2', function( assert ) {
        assert.expect(1);

        var done = assert.async();
        var index = 2;

        elasticSlider.toSlide({
            index: index,
            endAnimationCallback: function() {
                var activeIndex = elasticSlider.getProp('activeSlideIndex');

                assert.equal(activeIndex, index, 'Slide to index `' + index + '` successful!');
                done();
            }
        });
    });

    QUnit.test('slide to slide 3', function( assert ) {
        assert.expect(1);

        var done = assert.async();
        var index = 3;

        elasticSlider.toSlide({
            index: index,
            endAnimationCallback: function() {
                var activeIndex = elasticSlider.getProp('activeSlideIndex');

                assert.equal(activeIndex, index, 'Slide to index `' + index + '` successful!');
                done();
            }
        });
    });

};
