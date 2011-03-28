(function() {
  $(document).ready(function() {
    module("Slideshow");
    asyncTest("The title should be 'Troy Brinkerhoff'", function() {
      document.location.href = "#home";
      return _.wait(200, function() {
        equal("Troy Brinkerhoff", document.title, "the title is what it should be");
        return start();
      });
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
    asyncTest("panel should scroll when hovering over the bottom", function() {
      document.location.href = "#galleries/portrait";
      return _.wait(200, function() {
        var thumbsView, topp;
        thumbsView = app.view.thumbsView;
        equal(thumbsView.slidingState, false);
        thumbsView.handleMouseExtremeBottom();
        equal(thumbsView.slidingState, "up");
        console.log(thumbsView.currentPanelEl);
        topp = thumbsView.currentPanelEl.position().top;
        return _.wait(100, function() {
          equal(thumbsView.currentPanelEl.position().top < topp, 1);
          thumbsView.handleMouseNotExtremeBottom();
          topp = thumbsView.currentPanelEl.position().top;
          equal(thumbsView.slidingState, false);
          return _.wait(100, function() {
            equal(thumbsView.currentPanelEl.position().top, topp);
            return start();
          });
        });
      });
    });
    asyncTest("panel should scroll when hovering over the top", function() {
      document.location.href = "#galleries/portrait";
      return _.wait(200, function() {
        var thumbsView, topp;
        thumbsView = app.view.thumbsView;
        equal(thumbsView.slidingState, false);
        thumbsView.handleMouseExtremeTop();
        equal(thumbsView.slidingState, "down");
        console.log(thumbsView.currentPanelEl);
        topp = thumbsView.currentPanelEl.position().top;
        return _.wait(100, function() {
          equal(thumbsView.currentPanelEl.position().top > topp, 1);
          thumbsView.handleMouseNotExtremeTop();
          topp = thumbsView.currentPanelEl.position().top;
          equal(thumbsView.slidingState, false);
          return _.wait(100, function() {
            equal(thumbsView.currentPanelEl.position().top, topp);
            return start();
          });
        });
      });
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
    return test("I should see the banner as an image", function() {
      return equal($('#banner-img[src="http://troybrinkerhoff.com/files/banner.png"]').length, 1);
    });
  });
}).call(this);
