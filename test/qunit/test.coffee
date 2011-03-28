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

  asyncTest "The banner should go to the bottom when clicking on a gallery link", ->
    $('#main-logo').click()
    clickLink = ->
      $('.nav').first().click()
      _.wait 1000, ->
        console.log $('#banner').css('bottom')
        if $('#banner').css("bottom") == "0"
          equal $('#banner').css("bottom"), 0
        else
          equal $('#banner').css("-webkit-transform"), "matrix(1, 0, 0, 1, 0, 50)"
        
        start()
    clickLink()

  test "I should see the banner as an image", ->
    equal $('#banner-img[src="banner.png"]').length, 1
      
