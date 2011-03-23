(function() {
  var assert, browser, myVows, test, vows, zombie;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  vows = require('vows');
  assert = require('assert');
  zombie = require('zombie');
  browser = new zombie.Browser({
    debug: false
  });
  browser.runScripts = true;
  test = function(b) {
    return console.log(b.text("title") + "YEA");
  };
  myVows = vows.describe('Basic Page stuff').addBatch({
    'Browser Dom Tests': {
      topic: function() {
        return browser.visit('http://troy.the.tl', __bind(function(err) {
          console.log(browser.text("title"));
          return this.callback(null, err, browser);
        }, this));
      },
      'We should see the title': function(space, err, browser, status) {
        return assert.equal(browser.text("title"), "Troy Brinkerhoff");
      }
    }
  });
  myVows.run();
}).call(this);
