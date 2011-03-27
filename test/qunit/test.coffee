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


