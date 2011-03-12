(function() {
  var div, getEl, img;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  _.mixin({
    s: function(val, start, end) {
      var need_to_join, ret;
      need_to_join = false;
      ret = [];
      if (_.isString(val)) {
        val = val.split("");
        need_to_join = true;
      }
      if (start >= 0) {} else {
        start = val.length + start;
      }
      if (_.isUndefined(end)) {
        ret = val.slice(start);
      } else {
        if (end < 0) {
          end = val.length + end;
        } else {
          end = end + start;
        }
        ret = val.slice(start, end);
      }
      if (need_to_join) {
        return ret.join("");
      } else {
        return ret;
      }
    }
  });
  div = function(str) {
    return $("<div>" + str + "</div>");
  };
  img = function(str) {
    return $("<img src='blank.gif'>");
  };
  getEl = function(obj) {
    if (_.isString(obj)) {
      return $(obj);
    } else if (obj instanceof jQuery || obj instanceof Zepto || _.isElement(obj)) {
      return obj;
    } else {
      return obj && obj.el;
    }
  };
  if (!window.console) {
    window.console = {};
  }
  if (!window.console.log) {
    window.console.log = function() {};
  }
  $(document).ready(function() {
    var Home, HomeView, HorizontalSliderView, ImagePanelView, SlideShowView, home;
    console.log("ready");
    SlideShowView = (function() {
      __extends(SlideShowView, Backbone.View);
      function SlideShowView() {
        this.width = 960;
        this.height = 460;
        this.timer = "";
        this.interval = 4;
        this.el.css({
          position: "relative"
        });
      }
      SlideShowView.prototype.addPicture = function(url) {
        var image;
        image = $(document.createElement("img"));
        image.attr('src', url);
        this.el.append(image);
        return this.el.css({
          position: 'absolute',
          top: 0,
          left: 0
        });
      };
      SlideShowView.prototype.nextPicture = function() {};
      SlideShowView.prototype.prevPicture = function() {};
      SlideShowView.prototype.pause = function() {};
      SlideShowView.prototype.start = function() {};
      return SlideShowView;
    })();
    Backbone.emulateHTTP = true;
    Home = (function() {
      __extends(Home, Backbone.Model);
      function Home() {
        Home.__super__.constructor.apply(this, arguments);
        _.bindAll(this);
        this.set({
          test: "another thing"
        });
      }
      Home.prototype.url = 'http://troybrinkerhoff.com/new2/galleries.php';
      Home.prototype.loadGalleriesSuccess = function(data) {
        console.log(this);
        console.log('test');
        console.log(this.attributes);
        return this.set({
          "galleries": data
        });
      };
      Home.prototype.loadGalleries = function() {
        return $.ajax({
          type: "GET",
          url: "http://troybrinkerhoff.com/new2/galleries.php",
          dataType: "jsonp",
          success: this.loadGalleriesSuccess
        });
      };
      return Home;
    })();
    ImagePanelView = (function() {
      __extends(ImagePanelView, Backbone.View);
      function ImagePanelView() {
        ImagePanelView.__super__.constructor.apply(this, arguments);
        _.bindAll(this);
      }
      ImagePanelView.prototype.addImage = function(url, css, meta) {
        img = $(document.createElement("img"));
        img.attr("src", url);
        img.css(css);
        this.el.append(img);
        return img.bind("click", this.triggerClick);
      };
      ImagePanelView.prototype.triggerClick = function() {
        return this.trigger("click", this.meta);
      };
      return ImagePanelView;
    })();
    HorizontalSliderView = (function() {
      __extends(HorizontalSliderView, Backbone.Model);
      function HorizontalSliderView(width, height) {
        this.width = width != null ? width : 300;
        this.height = height != null ? height : 500;
        HorizontalSliderView.__super__.constructor.apply(this, arguments);
        this.el.css({
          width: "" + this.width + "px",
          height: "" + this.height + "px",
          "background-color": "rgb(70,70,70)",
          position: "absolute",
          top: 0,
          overflow: "hidden"
        });
        this.slideWrapper = div("");
        this.slideWrapper.css({
          position: "absolute"
        });
        this.el.append(this.slideWrapper);
        this.panelCount = 0;
        _.bindAll(this);
        return this;
      }
      HorizontalSliderView.prototype.goto = function(index) {
        var translateX;
        if (z.browser.webkit) {
          translateX = -1 * (index * e.width);
          return z(this.slideWrapper[0]).anim({
            "translateX": translateX + "px"
          });
        } else {
          return $(this.slideWrapper).animate({
            "left": (-1 * (index * e.width)) + "px"
          });
        }
      };
      HorizontalSliderView.prototype.addPanel = function(panelView) {
        var count, panelEl, panelWrapper, thisSlider;
        this.panelCount++;
        count = this.panelCount;
        if (!panelView) {
          panelView = $("<div>");
        }
        panelEl = getEl(panelView);
        panelWrapper = $("<div>");
        panelWrapper.css({
          width: "" + this.width + "px",
          height: "" + this.height + "px",
          position: "absolute",
          top: "0",
          left: (e.panelCount - 1) * e.width
        });
        panelWrapper.append(panelEl);
        thisSlider = this;
        panelWrapper.bind("click", function(event) {
          return thisSlider.panelWrapperClick(count - 1);
        });
        $(this.slideWrapper).css({
          "width": (this.panelCount * this.width) + "px"
        });
        return this.slideWrapper.append(getEl(panelWrapper));
      };
      HorizontalSliderView.prototype.panelWrapperClick = function(count) {
        return this.trigger("click", count);
      };
      return HorizontalSliderView;
    })();
    HomeView = (function() {
      function HomeView() {
        HomeView.__super__.constructor.apply(this, arguments);
      }
      __extends(HomeView, Backbone.View);
      HomeView.prototype.initialize = function(e) {
        HomeView.__super__.initialize.apply(this, arguments);
        _.bindAll(this);
        this.thumbsWidth = 200;
        this.el = $('#home-wrapper');
        this.state = "home";
        this.thumbGroupings = [];
        this.thumbsView = new HorizontalSliderView(this.thumbsWidth, 640);
        return $('#thumbs').append(this.thumbsView.el);
      };
      HomeView.prototype.triggerMainLogoClick = function() {
        return this.trigger("homeclick");
      };
      HomeView.prototype.setImage = function(url) {
        return $("#viewer-img").attr("src", url);
      };
      HomeView.prototype.clearNavLinks = function() {
        return this.el.find("#links").empty();
      };
      HomeView.prototype.addNavLink = function(linkName, linkAddress) {
        var a, that;
        a = $("<a class='nav' href='#'>" + linkName + "</a>");
        that = this;
        a.bind("click", function(event) {
          event.preventDefault();
          return that.triggerLinkClick(linkName);
        });
        return e.el.find("#links").append(a);
      };
      HomeView.prototype.triggerLinkClick = function(linkName) {
        return this.trigger("link", linkName);
      };
      HomeView.prototype.loadViewerImage = function(e, url) {
        return $("#viewer-img").attr("src", url);
      };
      HomeView.prototype.addImage = function(urls) {
        return;
      };
      HomeView.prototype.slideThumbnails = function(e, outOrIn) {
        var right, translate;
        if (outOrIn === "out") {
          translate = "-" + this.thumbsWidth + "px";
          right = 0;
        } else {
          translate = 0;
          right = "-" + this.thumbsWidth + "px";
        }
        if (z.browser.webkit) {
          return z("#thumbs").anim({
            "translateX": translate
          });
        } else {
          return $('#thumbs').animate({
            right: right
          });
        }
      };
      HomeView.prototype.slideBanner = function(e, upOrDown) {
        var bottom, translate;
        if (upOrDown === "down") {
          translate = "50px";
          bottom = 0;
        } else {
          translate = 0;
          bottom = "50px";
        }
        if (z.browser.webkit) {
          return z("#banner").anim({
            "translateY": translate
          });
        } else {
          return $("#banner").animate({
            "bottom": bottom
          });
        }
      };
      return HomeView;
    })();
    home = new Home({
      test: "something"
    });
    console.log(home);
    return home.loadGalleries();
  });
}).call(this);
