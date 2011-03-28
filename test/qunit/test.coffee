$(document).ready () ->
  
  module("Slideshow")
  
  test "The title should be 'Troy Brinkerhoff'", () ->
    equal "Troy Brinkerhoff", document.title, "the title is what it should be"

  test "Should see Online Viewing", () ->
    equal 1, $('[href="http://troybrinkerhoff.com/onlineviewing/"]').length


  test "There should be arrows on the main slideshow", () ->
    equal $('.left-slide-show-arrow').length, 1, "The left arrow"
    equal $('.right-slide-show-arrow').length, 1,  "The right arrow"
    equal 1,1

  asyncTest "a right arrow should appear if I hover over the right side of the slideshow", ->
    equal $('.right-slide-show-arrow').css("display"), "none"
    app.slideShow.handleRightSideMouseMove()
    equal $('.right-slide-show-arrow').css("display"), "block"
    _.wait 500, ->
      app.slideShow.handleNonRightSideMouseMove()
      _.wait 500, ->
        equal $('.right-slide-show-arrow').css("display"), "none"
        start()


  asyncTest "a left arrow should appear if I hover over the left side of the slideshow", ->
    equal $('.left-slide-show-arrow').css("display"), "none"
    app.slideShow.handleLeftSideMouseMove()
    equal $('.left-slide-show-arrow').css("display"), "block"
    _.wait 500, ->
      app.slideShow.handleNonLeftSideMouseMove()
      _.wait 500, ->
        equal $('.left-slide-show-arrow').css("display"), "none"
        start()

  test "panel should scroll when hovering over the bottom", ->
    equal app.thumbsView.slideState, false
    app.thumbsView.handleBottomHover()
    equal app.thumbsView.slideState, true
    app.thumbsView.handleNotBottomHover()
    equal app.thumbsView.slideState, false




  asyncTest "Clicking the left slideshow arrow should change the images", ->
    app.slideShow.index = 0
    leftArrow = app.slideShow.el.find(".left-slide-show-arrow")
    leftArrow.click()
    equal app.slideShow.index, 2
    leftArrow.click()
    equal app.slideShow.index, 1
    leftArrow.click()
    equal app.slideShow.index, 0
    start()

  asyncTest "Clicking right slideshow arrow should change the images", ->
    app.slideShow.index = 0
    rightArrow = app.slideShow.el.find(".right-slide-show-arrow")
    rightArrow.click()
    equal app.slideShow.index, 1
    rightArrow.click()
    equal app.slideShow.index, 2
    rightArrow.click()
    equal app.slideShow.index, 0
    start()

  test "The background should be a gray", ->
    equal $('body').css("background-color"), "rgb(196, 196, 196)"

  _.mixin
    wait: (time, func)->
      setTimeout func, time

  test "I should see the banner as an image", ->
    equal $('#banner-img[src="http://troybrinkerhoff.com/files/banner.png"]').length, 1
      

