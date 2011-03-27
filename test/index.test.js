(function() {
  var assert, browser, myVows, vows, zombie;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  vows = require('vows');
  assert = require('assert');
  zombie = require('zombie');
  browser = new zombie.Browser({
    debug: false
  });
  browser.runScripts = true;
  myVows = vows.describe('Basic Page stuff').addBatch({
    'Browser Dom Tests': {
      topic: function() {
        return browser.visit('http://troy.the.tl', __bind(function(err) {
          console.log(browser.text("title"));
          return setTimeout((__bind(function() {
            return this.callback(null, err, browser);
          }, this)), 1000);
        }, this));
      },
      'I see the title': function(space, err, browser, status) {
        return assert.equal(browser.text("title"), "Troy Brinkerhoff");
      },
      'There should be a slide show': function(s, err, browser) {
        return assert.ok(browser.querySelector('#slide-show'));
      },
      'I should see left and right arrows for the main slideshow': function(s, err, browser) {
        assert.ok(browser.querySelector(".left-slide-show-arrow"));
        return assert.ok(browser.querySelector(".right-slide-show-arrow"));
      },
      'I should be able to see the online viewing link': function(s, err, browser) {}
    }
  });
  myVows.run();
}).call(this);
