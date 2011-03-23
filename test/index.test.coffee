vows = require 'vows'
assert = require 'assert'
zombie = require 'zombie'


browser = new zombie.Browser({debug: false})
browser.runScripts = true


test = (b) ->
  console.log b.text("title") + "YEA"


myVows = vows.describe('Basic Page stuff').addBatch
  'Browser Dom Tests' :
    topic: () ->
      browser.visit 'http://troy.the.tl', (err) => 
        console.log browser.text("title") 
        @callback null, err, browser
    'We should see the title': (space, err, browser, status ) ->
      assert.equal browser.text("title"), "Troy Brinkerhoff"


myVows.run()
