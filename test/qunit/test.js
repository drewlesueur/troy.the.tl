(function() {
  $(document).ready(function() {
    module("Slideshow");
    test("The title should be 'Troy Brinkerhoff'", function() {
      return equal("Troy Brinkerhoff", document.title, "the title is what it should be");
    });
    test("Should see Online Viewing", function() {
      return equal(1, $('[href="http://troybrinkerhoff.com/onlineviewing/"]').length);
    });
    return test("There should be arrows on the main slideshow", function() {
      equal($('.left-slide-show-arrow').length, 1, "The left arrow");
      equal($('.right-slide-show-arrow').length, 1, "The right arrow");
      return equal(1, 1);
    });
  });
}).call(this);
