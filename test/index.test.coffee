vows = require 'vows'
assert = require 'assert'
zombie = require 'zombie'


browser = new zombie.Browser({debug: false})
browser.runScripts = true




myVows = vows.describe('Basic Page stuff').addBatch
  'Browser Dom Tests' :
    topic: () ->
      browser.visit 'http://troy.the.tl', (err) => 
        console.log browser.text("title") 

        setTimeout (() => @callback null, err, browser), 1000
    'I see the title': (space, err, browser, status ) ->
      assert.equal browser.text("title"), "Troy Brinkerhoff"
    'There should be a slide show': (s, err, browser) ->
      assert.ok browser.querySelector('#slide-show')   
    'I should see left and right arrows for the main slideshow' : (s, err, browser) ->
      assert.ok browser.querySelector ".left-slide-show-arrow"
      assert.ok browser.querySelector ".right-slide-show-arrow"
    'I should be able to see the online viewing link' : (s, err, browser) ->
      
      #assert.ok browser.querySelector 'a[href="http://troybrinkerhoff.com/onlineviewing/"]'


myVows.run()
