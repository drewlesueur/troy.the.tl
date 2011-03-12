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
    console.log "ready"

    #trying the Model View Presenter pattern

    class SlideShowView extends Backbone.View
      constructor: () ->
        @el = div ""
        @width = 960
        @height = 460
        @timer = ""
        @interval = 4
        @el.css position: "relative"
      addPicture: (url) ->
        image = $ document.createElement "img"
        image.attr 'src', url
        @el.append image
        @el.css
          position: 'absolute'
          top: 0
          left: 0
      nextPicture: () ->
      prevPicture: () ->
      pause: () ->
      start: () ->

    Backbone.emulateHTTP = true

    class HomeModel extends Backbone.Model
      constructor: () ->
        super
        _.bindAll this
        @set test: "another thing"
      url: 'http://troybrinkerhoff.com/new2/galleries.php'

      loadGalleriesSuccess: (data) =>
        console.log data
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
        img = $ document.createElement "img"
        img.attr "src", url
        img.css css
        @el.append img
        img.bind "click", @triggerClick
      triggerClick : () ->
        @trigger "click", @meta


    class HorizontalSliderView extends Backbone.View
      constructor: (@width=300, @height=300) ->
        super
        _.bindAll this
        @el = div ""
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
        return this
      goto: (index) ->
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
      triggerMainLogoClick: () =>
        @trigger "homeclick"
      setImage: (url) ->
        $("#viewer-img").attr "src", url
      clearNavLinks: () ->
        @el.find("#links").empty()
      addNavLink: (linkName, linkAddress) ->
        a = $ "<a class='nav' href='#'>#{linkName}</a>"
        a.bind "click", (event) =>
          event.preventDefault();
          @triggerLinkClick linkName
        @el.find("#links").append a
      triggerLinkClick: (linkName) =>
        @trigger "link", linkName
        
      loadViewerImage: (url) ->
        $("#viewer-img").attr "src", url
      addImage: (urls) ->
        return
      slideThumbnails: (outOrIn) ->
        console.log "sliding thumbnails #{outOrIn}"
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
        if upOrDown is "down"
          translate = "50px"
          bottom = 0
        else
          translate = 0
          bottom = "50px"
        if z.browser.webkit
          z("#banner").anim "translateY" : translate
        else
          $("#banner").animate "bottom" : bottom


    class HomePresenter
      constructor: () ->
        _.bindAll this
        #slideshow = k.new SlideShowView
        #p(slideshow).addPicture "http://troybrinkerhoff.com/gallery_couples/images/13.jpg"
        #$(document.body).append slideshow.el
        @model = new HomeModel
        @view = new HomeView
        @imgCss =
          width: "43px"
          height: "43px"
        @model.bind "change:galleries", @handleGalleriesChange
            
        
        @view.bind "link", @handleLinkClick
          
        @model.loadGalleries()


      handleLinkClick: (linkName) =>
        if linkName is @view.galleryState
          return
        @view.galleryState = linkName
        @view.slideThumbnails "out"
        @view.slideBanner "down"
        gallery_name = "gallery_" + linkName.toLowerCase() 
        @view.thumbsView.goto @linkPanelMap[linkName]

        @view.bind "homeclick", () =>
          @view.galleryState =  ""
          @view.slideThumbnails "in"
          @view.slideBanner "up"

      handleGalleriesChange: (event ) =>
        @view.clearNavLinks()
        @linkPanelMap = {}
        galleryIndex = 0
        for gallery, info of @model.get "galleries"
          linkName = k.capitalize(k(gallery).s("gallery_".length))
          console.log linkName
          @view.addNavLink linkName, "#"
          imagePanel = new ImagePanelView
          imagePanel.linkName = linkName
          imagePanel.bind "click", (meta) =>
            @view.setImage meta.image
          for image, index in info.images
            thumb = info.thumbs[index]
            meta = image: image, thumb: thumb, linkName: linkName
            imagePanel.addImage thumb, @imgCss, meta 
          @view.thumbsView.addPanel imagePanel
          @linkPanelMap[linkName] = galleryIndex
          galleryIndex++

    app = new HomePresenter

      


