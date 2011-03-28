  _.mixin 
    s: (val, start, end) ->
      need_to_join = false
      ret = []
      if _.isString val
        val = val.split ""
        need_to_join = true
      
      if start >= 0
      else
        start = val.length + start
      
      if _.isUndefined(end)
        ret = val.slice start
      else
        if end < 0
          end = val.length + end
        else
          end = end + start
        ret = val.slice start, end

      if need_to_join
        ret.join ""
      else
        ret

  div = (str) ->
    return $ "<div>#{str}</div>"

  img = (str) ->
    return $ "<img src='blank.gif'>"
  getEl = (obj) ->
    if _.isString obj
      return $ obj
    else if obj instanceof jQuery or obj instanceof Zepto or _.isElement obj
      return obj
    else 
      return obj && obj.el
      
  #problem. instantiating should NOT append to the dom or the object
  if !window.console
    window.console = {}
  if !window.console.log
    window.console.log = () ->
  $(document).ready () ->
    
    #jQuery plugin for moving to the extremities of an element
    do (jQuery) ->
      $ = jQuery
      $.fn.mouseextremes = (percent=10) ->

        el = $ this
        el.mousemove (e) ->
          x = e.pageX - el.offset().left
          y = e.pageY - el.offset().top

          width = el.width()
          height = el.height()

          fromRight = (width - x) / width * 100
          fromLeft = x / width * 100

          fromTop = y / height * 100
          fromBottom = (height - y) / height * 100 # or 100 - fromTop
           
          false and console.log "
          top #{fromTop}
          bottom #{fromBottom}
          left #{fromLeft}
          right #{fromRight}
          "
          if fromTop <= percent
            el.trigger("mouseextremetop", ["top"])
          else
            el.trigger "mousenotextremetop", ["top"]

          if fromBottom <= percent
            el.trigger "mouseextremebottom"
          else
            el.trigger "mousenotextremebottom"

          if fromLeft <= percent
            el.trigger "mouseextremeleft"
          else
            el.trigger "mousenotextremeleft"

          if fromRight <= percent
            el.trigger "mouseexremeright"
          else
            el.trigger "mousenotextremeright"

          el.mouseleave ->
            el.trigger "mousenotextremetop"
            el.trigger "mousenotextremebottom"
            el.trigger "mousenotextremeleft"
            el.trigger "mousenotextremeright"



    #trying the Model View Presenter pattern

    class SlideShowView extends Backbone.View
      constructor: () ->
        @el = div ""
        @el.addClass "slide-show-yea"
        @width = 960
        @height = 460
        @timer = ""
        @interval = 6000
        @fadeSpeed = 1000
        @el.css position: "relative"
        @indexCount = 0
        @index = 0
        @hidden = false
        @el.append @make "div", {"className": "arrow
          left-slide-show-arrow"}, "\u25C4"
        @el.append @make "div", {"className":
          "arrow right-slide-show-arrow"}, "\u25BA"
        @el.find('.right-slide-show-arrow').click =>
          @pause()
          @nextPicture()

        @el.find('.left-slide-show-arrow').click =>
          @pause()
          @prevPicture()
        @rightArrowVisible = false
        @rightArrowFading = false
        @leftArrowVisible = false
        @leftArrowFading = false

        @el.mouseleave =>
          @handleNonLeftSideMouseMove()
          @handleNonRightSideMouseMove()

        @el.mousemove (e) =>
          x = e.pageX - @el.offset().left
          y = e.pageY - @el.offset().top
          if @el.width() - x < 100
            @handleRightSideMouseMove()
          else
            @handleNonRightSideMouseMove()
          if x < 100
            @handleLeftSideMouseMove()
          else
            @handleNonLeftSideMouseMove()


      handleNonLeftSideMouseMove: =>
        if @leftArrowFading or not(@leftArrowVisible) then return
        @leftArrowFading = true
        @el.find('.left-slide-show-arrow').fadeOut =>
          @leftArrowFading = false
          @leftArrowVisible = false
      handleLeftSideMouseMove: () =>
        if @leftArrowFading or @leftArrowVisible then return
        @leftArrowFading = true
        @el.find('.left-slide-show-arrow').fadeIn =>
          @leftArrowFading = false
          @leftArrowVisible = true

      handleNonRightSideMouseMove: =>
        if @rightArrowFading or not(@rightArrowVisible) then return
        @rightArrowFading = true
        @el.find('.right-slide-show-arrow').fadeOut =>
          @rightArrowFading = false
          @rightArrowVisible = false
      handleRightSideMouseMove: () =>
        if @rightArrowFading or @rightArrowVisible then return
        @rightArrowFading = true
        @el.find('.right-slide-show-arrow').fadeIn =>
          @rightArrowFading = false
          @rightArrowVisible = true
        
      addPicture: (url) ->
        image = $ document.createElement "img"
        image.load () ->
          image.attr "data-loaded", "true"
        image.attr 'src', url
        image.attr 'data-index', @indexCount
        image.css
          width: "#{@width}px"
        @el.append image
        image.css
          position: 'absolute'
          top: 0
          left: 0
          display: "none"
        @indexCount++
      
      nextPicture: () =>
        @el.find("img:visible").fadeOut(@fadeSpeed)
        @el.find("[data-index=#{@index}]").fadeIn(@fadeSpeed)
        @incIndex()
      prevPicture: () =>
        @el.find("img:visible").fadeOut(@fadeSpeed)
        @el.find("[data-index=#{@index}]").fadeIn(@fadeSpeed)
        @decIndex()
      decIndex: () =>
        @index--
        if @index < 0
          @index = @indexCount - 1
      incIndex: () =>
        @index++
        if @index >= @indexCount
          @index = 0
      hide: () =>
        clearTimeout @timeout
        @el.hide()
        @hidden = true
      show: () =>
        @el.show()
        @hidden = false
      tick: () =>
        img1 = @el.find("[data-index=#{@index}]")
        if @index == 0 or img1.attr("data-loaded") is "true"
          @nextPicture()
          @timeout = setTimeout @tick, @interval
        else
          1
          @timeout = setTimeout @tick, @interval
            
        
      pause: () =>
        clearTimeout @timeout
      start: () =>
        clearTimeout @timeout
        @timeout = setTimeout @tick, @interval
      init: () =>
        @tick()
        
        
    window.stater = (states) ->
      stateId = 0
      ret = () ->
        ret1 = states[stateId] 
        stateId++
        if stateId == states.length then stateId = 0
        return ret1
      return ret


    class ImageDisplayerView extends Backbone.View
      constructor: (parent) ->
        @el = parent || div ""
        @images = {}
        @currentImage = $ @make "img"
        @loading = div "Loading..."
        @loading.css margin: "50px"

        @loadingStater = stater ["Loading", "Loading.", "Loading..", "Loading..."]
        @loading.css color: "white", position: "absolute", top: 0, left: 0, "display": "none"
        @el.append @loading
        @loadingTimer = setInterval @updateLoader, 250, 
      updateLoader: () =>
        @loading.html @loadingStater()
      showImage: (url) =>
        @loading.show()

        @el.find('img:visible').fadeOut()
        if url of @images
          @images[url].el.fadeIn()
          return

        image = 
          url: url
          el: $ @make "img"
          loaded: false
        image.el.css position: "absolute", top: 0, left: 0, display: "none"
        @el.append image.el
        image.el.attr "src", image.url
        image.el.load () =>
          @el.find('img:visible').fadeOut()
          image.loaded = true
          image.el.fadeIn()
          @currentImage = image.el
          @loading.hide()




    class ContactFormView extends Backbone.View
      constructor: () ->
        super
        
        @el = $ "#contact-form"
        @textarea = @el.find('textarea')
        @textarea.bind 'focus', (event) =>
          @textarea.animate({width: "300px", height: "100px"}, 200)
        @el.bind "blur", (event) =>
          @textarea.animate({width: "100px", height: "20px"}, 200)
        @el.bind "submit", (event) =>
          event.preventDefault()
          @trigger "submitContactForm", email: @el.find("#email").val(), message: @el.find('#message').val()
          return false
      blur: () =>
        @el.blur()
            



    Backbone.emulateHTTP = true

    class HomeModel extends Backbone.Model
      constructor: () ->
        super
        _.bindAll this
        @set test: "another thing"
      url: 'http://troybrinkerhoff.com/new2/galleries.php'

      loadGalleriesSuccess: (data) =>
        if environment is "test"
          for key, value of data
            value.images = _.s value.images, 0, 3
            value.thumbs = _.s value.thumbs, 0, 3
            data[key] = value
    
        if false and environment isnt "test"
          console.log data
          newData = {}
          i = 0
          for key, value of data
            i++
            value.images = _.s(value.images, 0, 3) 
            value.thumbs = _.s value.thumbs, 0, 3
            newData[key] = value
            if i is 3
              break
          console.log JSON.stringify newData
        @set "galleries": data 
        
      loadGalleries: () =>
        $.ajax
          type: "GET"
          url: "http://troybrinkerhoff.com/new2/galleries.php"
          dataType: "jsonp"
          success: @loadGalleriesSuccess

    
    class ImagePanelView extends Backbone.View
      constructor: () ->
        super
        @el = div ""
        _.bindAll this

      addImage: (url, css, meta) ->
        if k.s(url, -2) == "db"
          return
        img1 = $ document.createElement "img"
        img1.attr "src", url
        img1.addClass "thumbnail-image"
        img1.css css
        meta.img = img1
        @el.append img1
        img1.bind "click", (event) =>
          @triggerClick meta
          @el.find("img").css opacity: 0.5
          @el.find('[data-active=true]').removeAttr 'data-active'
          img1.attr("data-active", 'true')
          img1.css
            "opacity": 1

        img1.bind "mouseover", (event) =>
          img1.css 
            "opacity": 1

        img1.bind "mouseout": (event) =>
          if img1.attr("data-active") isnt 'true'
            img1.css "opacity": 0.5


      triggerClick : (meta) =>
        @trigger "click", meta


    class HorizontalSliderView extends Backbone.View
      constructor: (@width=300, @height=300) ->
        super
        _.bindAll this
        @el = div ""
        @el.addClass "horizontal-slider-view"
        @el.css
          width: "#{@width}px"
          height: "#{@height}px"
          position: "absolute"
          top: 0
          overflow: "hidden"
        @slideWrapper = div ""
        @slideWrapper.css position: "absolute"
        $(@el).append @slideWrapper
        @panelCount = 0
        @currentPanel = 0
        @slidingState = false # could be "up" or "down"
        @slidingInterval = null
        @el.mouseextremes()
        @el.bind "mouseextremebottom", @handleMouseExtremeBottom 
        @el.bind "mousenotextremebottom", @handleMouseNotExtremeBottom 


        return this
      handleMouseNotExtremeBottom: =>
        @slidingState = false
        clearInterval @slidingInterval


      handleMouseExtremeBottom: () =>
        if @slidingState isnt false then return
        @slidingState = "up"
        clearInterval @slidingInterval
        @slidingInterval = setInterval @slideUpSmall, 10

      slideUpSmall: () =>
        @currentPanelEl.css "top", @currentPanelEl.position().top - 1 + "px"

      goto: (index) ->
        @currentPanel = index
        # could have also used a hash to find it instead of a dom lookup
        @currentPanelEl = @el.find("[data-index='#{@currentPanel}']")
        if z.browser.webkit
          translateX =  (-1 * (index * @width)) 
          z(@slideWrapper[0]).anim "translateX" : translateX + "px"
        else
          $(@slideWrapper).animate "left" : (-1 * (index * @width)) + "px"
        
      addPanel: (panelView) ->
        @panelCount++
        count = @panelCount # so count has its own scope
        if not panelView
          panelView = $ "<div>"
        panelEl = getEl panelView
        panelWrapper = $ "<div>"
        panelWrapper.addClass "panel"
        panelWrapper.attr "data-index", @panelCount - 1
        panelWrapper.addClass "panel"
        panelWrapper.css 
          width: "#{@width}px"
          height: "#{@height}px"
          position: "absolute"
          top : "0"
          left: (@panelCount - 1) * @width 
        panelWrapper.append panelEl
        panelWrapper.bind "click", (event) =>
          @panelWrapperClick(count - 1)

        $(@slideWrapper).css "width": (@panelCount * @width) + "px"
        @slideWrapper.append getEl panelWrapper 
      panelWrapperClick: (count) ->
        @trigger "click", count
          

    class HomeView extends Backbone.View
      initialize: () ->
        super
        _.bindAll this
        @thumbsWidth = 200
        @el = $('#home-wrapper')
        @state = "home"
        @thumbGroupings = []
        @thumbsView = new HorizontalSliderView @thumbsWidth, 640
        $('#thumbs').append @thumbsView.el
        @imageDisplayer = new ImageDisplayerView $('#viewer')
        @contactFormView = new ContactFormView
        #move the callback function out of the view
        @contactFormView.bind "submitContactForm", (formInfo) =>
          $.ajax
            type: "GET"
            url: "http://troybrinkerhoff.com/new2/contact.php"
            data: formInfo
            dataType: "jsonp"
            success: (data) =>
              if data is 1
                alert "Thank you"
                @contactFormView.blur()
              else
                alert "Error while sending contact form"


      setImage: (url) ->
        @imageDisplayer.showImage url
      displayFirstImage: () =>
        @thumbsView.currentPanelEl.find("img:first").click()
        
      addImage: (urls) ->
        return
      slideThumbnails: (outOrIn) ->
        if outOrIn == "out"
          translate = "-#{@thumbsWidth}px"
          right = 0
        else
          translate = 0
          right = "-#{@thumbsWidth}px"
        if z.browser.webkit
          z("#thumbs").anim({"translateX": translate})
        else
          $('#thumbs').animate({right: right})
      slideBanner: (upOrDown) ->
        slideAmt = 50
        if upOrDown is "up"
          translate = 0 #"-#{slideAmt}px"
          bottom = "#{slideAmt}px"
        else
          translate = "#{slideAmt}px"
          bottom = 0
        if z.browser.webkit
          z("#banner").anim "translateY" : translate
        else
          $("#banner").animate "bottom" : bottom
      hideViewer: () =>
        $('#viewer').hide()

      showViewer: () =>
        $('#viewer').show()

    class ManyImagesView extends Backbone.View
      # not used
      constructor: () ->
        super

        @images = []
      addImage: (url) =>
        image =
          loaded: false
          url: url
          el: $ @make "img"
          onload: () ->
        @images.push image
        image.el.load () =>
          image.loaded = true
          @index++
          @loadSpecific
      kickOffLoading: () ->
      loadSpecific: () =>
        image = @images[@index]
        image.el.attr "src", image.url
        
        
        
    class HomeRoutes extends Backbone.Controller
      routes:
        "galleries/:gallery" : "gallery"
        "home" : "home"

      gallery: (galleryName) =>
        app.handleLinkClick galleryName
      home: () =>
        app.handleHomeClick()

    class HomePresenter
      constructor: () ->
        _.bindAll this

        @slideShow = new SlideShowView
        @slideShow.el.attr "id", "slide-show"
        $('#home-wrapper').append @slideShow.el
        @model = new HomeModel
        @view = new HomeView
        @imgCss =
          width: "43px"
          height: "43px"
          opacity: "0.5"
        @model.bind "change:galleries", @handleGalleriesChange
        @model.loadGalleries()
      handleHomeClick: () ->
          @view.hideViewer()
          @slideShow.show()
          @slideShow.start()
          @view.galleryState =  ""
          @view.slideThumbnails "in"

      handleLinkClick: (linkName) =>
        linkName = k.capitalize linkName
        if @slideShow.hidden == false
          @slideShow.hide()
          @view.showViewer()
        if linkName is @view.galleryState
          return
        @view.galleryState = linkName
        @view.slideThumbnails "out"
        gallery_name = "gallery_" + linkName.toLowerCase() 
        @view.thumbsView.goto @linkPanelMap[linkName]
        @view.displayFirstImage() 

      handleImagePanelImageClicked: (meta) =>
        @view.setImage meta.image
      handleGalleriesChange: (event ) =>
        for image in k.s @model.get("galleries").gallery_slideshow.images, 0
          @slideShow.addPicture image
        @slideShow.init()
        @linkPanelMap = {}
        galleryIndex = 0
        for gallery, info of @model.get "galleries"
          linkName = k.capitalize(k(gallery).s("gallery_".length))
          imagePanel = new ImagePanelView
          imagePanel.linkName = linkName
          imagePanel.bind "click", (meta) => 
            @handleImagePanelImageClicked(meta)
          for image, index in info.images
            thumb = info.thumbs[index]
            meta = image: image, thumb: thumb, linkName: linkName
            imagePanel.addImage thumb, @imgCss, meta 
          @view.thumbsView.addPanel imagePanel
          @linkPanelMap[linkName] = galleryIndex
          galleryIndex++
        Backbone.history.start()


    window.app = new HomePresenter
    app = window.app
    routes = new HomeRoutes

      


