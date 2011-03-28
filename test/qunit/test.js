(function() {
  $(document).ready(function() {
    module("Slideshow");
    test("The title should be 'Troy Brinkerhoff'", function() {
      return equal("Troy Brinkerhoff", document.title, "the title is what it should be");
    });
    test("Should see Online Viewing", function() {
      return equal(1, $('[href="http://troybrinkerhoff.com/onlineviewing/"]').length);
    });
    test("There should be arrows on the main slideshow", function() {
      equal($('.left-slide-show-arrow').length, 1, "The left arrow");
      equal($('.right-slide-show-arrow').length, 1, "The right arrow");
      return equal(1, 1);
    });
    asyncTest("a right arrow should appear if I hover over the right side of the slideshow", function() {
      equal($('.right-slide-show-arrow').css("display"), "none");
      app.slideShow.handleRightSideMouseMove();
      equal($('.right-slide-show-arrow').css("display"), "block");
      return _.wait(500, function() {
        app.slideShow.handleNonRightSideMouseMove();
        return _.wait(500, function() {
          equal($('.right-slide-show-arrow').css("display"), "none");
          return start();
        });
      });
    });
    asyncTest("a left arrow should appear if I hover over the left side of the slideshow", function() {
      equal($('.left-slide-show-arrow').css("display"), "none");
      app.slideShow.handleLeftSideMouseMove();
      equal($('.left-slide-show-arrow').css("display"), "block");
      return _.wait(500, function() {
        app.slideShow.handleNonLeftSideMouseMove();
        return _.wait(500, function() {
          equal($('.left-slide-show-arrow').css("display"), "none");
          return start();
        });
      });
    });
    test("panel should scroll when hovering over the bottom", function() {
      equal(app.thumbsView.slideState, false);
      app.thumbsView.handleBottomHover();
      equal(app.thumbsView.slideState, true);
      app.thumbsView.handleNotBottomHover();
      return equal(app.thumbsView.slideState, false);
    });
    asyncTest("Clicking the left slideshow arrow should change the images", function() {
      var leftArrow;
      app.slideShow.index = 0;
      leftArrow = app.slideShow.el.find(".left-slide-show-arrow");
      leftArrow.click();
      equal(app.slideShow.index, 2);
      leftArrow.click();
      equal(app.slideShow.index, 1);
      leftArrow.click();
      equal(app.slideShow.index, 0);
      return start();
    });
    asyncTest("Clicking right slideshow arrow should change the images", function() {
      var rightArrow;
      app.slideShow.index = 0;
      rightArrow = app.slideShow.el.find(".right-slide-show-arrow");
      rightArrow.click();
      equal(app.slideShow.index, 1);
      rightArrow.click();
      equal(app.slideShow.index, 2);
      rightArrow.click();
      equal(app.slideShow.index, 0);
      return start();
    });
    test("The background should be a gray", function() {
      return equal($('body').css("background-color"), "rgb(196, 196, 196)");
    });
    _.mixin({
      wait: function(time, func) {
        return setTimeout(func, time);
      }
    });
    return test("I should see the banner as an image", function() {
      return equal($('#banner-img[src="http://troybrinkerhoff.com/files/banner.png"]').length, 1);
    });
  });
}).call(this);
