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

    #trying the Model View Presenter pattern

    class SlideShowView extends Backbone.View
      constructor: () ->
        @el = div ""
        @el.addClass "slide-show-yea"
        @width = 960
        @height = 460
        @timer = ""
        @interval = 6000
        @fadeSpeed = 4000
        @el.css position: "relative"
        @indexCount = 0
        @index = 0
        @hidden = false
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
      
      nextPicture: () ->
        @el.find("img:visible").fadeOut(@fadeSpeed)
        @el.find("[data-index=#{@index}]").fadeIn(@fadeSpeed)
        @incIndex()
      prevPicture: () ->
        @el.find("img:visible").fadeOut(@fadeSpeed)
        @el.find("[data-index=#{@index}]").fadeIn(@fadeSpeed)
        @decIndex()
      decIndex: () =>
        @index--
        if @index <= 0
          @index = @indexCount
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
          "background-color": "rgb(70,70,70)"
          position: "absolute"
          top: 0
          overflow: "hidden"
        @slideWrapper = div ""
        @slideWrapper.css position: "absolute"
        $(@el).append @slideWrapper
        @panelCount = 0
        @currentPanel = 0
        return this
      currentPanelEl: () =>
        ret =  @el.find("[data-index='#{@currentPanel}']")
        return ret

      goto: (index) ->
        @currentPanel = index
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
        $('#main-logo').click @triggerMainLogoClick
          
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


      triggerMainLogoClick: () =>
        @trigger "homeclick"
      setImage: (url) ->
        @imageDisplayer.showImage url
      clearNavLinks: () ->
        @el.find("#links").empty()
      addNavLink: (linkName, linkAddress='#', type) ->
        a = $ "<a class='nav' href='#{linkAddress}'>#{linkName}</a>"
        @el.find("#links").append a
        if type is "normal"
          return
        a.bind "click", (event) =>
          event.preventDefault();
          @triggerLinkClick linkName
      triggerLinkClick: (linkName) =>
        @trigger "link", linkName
      displayFirstImage: () =>
        @thumbsView.currentPanelEl().find("img:first").click()
        
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
        slideAmt = 550
        if upOrDown is "up"
          translate = "-#{slideAmt}px"
          top = 0
        else
          translate = 0
          top = "#{slideAmt}px"
        if z.browser.webkit
          z("#banner").anim "translateY" : translate
        else
          $("#banner").animate "top" : top
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
        
        
        
        



    class HomePresenter
      constructor: () ->
        _.bindAll this

        @slideShow = new SlideShowView
        $('#home-wrapper').append @slideShow.el
        @model = new HomeModel
        @view = new HomeView
        @imgCss =
          width: "43px"
          height: "43px"
          opacity: "0.5"
        @model.bind "change:galleries", @handleGalleriesChange
        @view.bind "link", @handleLinkClick
        @model.loadGalleries()
        @view.bind "homeclick", () =>
          @view.hideViewer()
          @slideShow.show()
          @slideShow.start()
          @view.galleryState =  ""
          @view.slideThumbnails "in"
          @view.slideBanner "down"
      handleLinkClick: (linkName) =>
        if @slideShow.hidden == false
          @slideShow.hide()
          @view.showViewer()
        if linkName is @view.galleryState
          return
        @view.galleryState = linkName
        @view.slideThumbnails "out"
        @view.slideBanner "up"
        gallery_name = "gallery_" + linkName.toLowerCase() 
        @view.thumbsView.goto @linkPanelMap[linkName]
        @view.displayFirstImage() 

      handleImagePanelImageClicked: (meta) =>
        @view.setImage meta.image
      handleGalleriesChange: (event ) =>
        for image in k.s @model.get("galleries").gallery_test.images, 0,3
          @slideShow.addPicture image
        @slideShow.init()
        @view.clearNavLinks()
        @linkPanelMap = {}
        galleryIndex = 0
        for gallery, info of @model.get "galleries"
          linkName = k.capitalize(k(gallery).s("gallery_".length))
          @view.addNavLink linkName, "#"
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
        @view.addNavLink "Online Viewing", "http://troybrinkerhoff.com/onlineviewing/", "normal"


    app = new HomePresenter

      


