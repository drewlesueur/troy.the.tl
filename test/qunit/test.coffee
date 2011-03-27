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

    


