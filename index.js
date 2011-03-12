(function() {
  var div, getEl, img;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
    var HomeModel, HomePresenter, HomeView, HorizontalSliderView, ImagePanelView, SlideShowView, app;
    console.log("ready");
    SlideShowView = (function() {
      __extends(SlideShowView, Backbone.View);
      function SlideShowView() {
        this.el = div("");
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
    HomeModel = (function() {
      __extends(HomeModel, Backbone.Model);
      function HomeModel() {
        this.loadGalleries = __bind(this.loadGalleries, this);;
        this.loadGalleriesSuccess = __bind(this.loadGalleriesSuccess, this);;        HomeModel.__super__.constructor.apply(this, arguments);
        _.bindAll(this);
        this.set({
          test: "another thing"
        });
      }
      HomeModel.prototype.url = 'http://troybrinkerhoff.com/new2/galleries.php';
      HomeModel.prototype.loadGalleriesSuccess = function(data) {
        console.log(data);
        return this.set({
          "galleries": data
        });
      };
      HomeModel.prototype.loadGalleries = function() {
        return $.ajax({
          type: "GET",
          url: "http://troybrinkerhoff.com/new2/galleries.php",
          dataType: "jsonp",
          success: this.loadGalleriesSuccess
        });
      };
      return HomeModel;
    })();
    ImagePanelView = (function() {
      __extends(ImagePanelView, Backbone.View);
      function ImagePanelView() {
        ImagePanelView.__super__.constructor.apply(this, arguments);
        this.el = div("");
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
      __extends(HorizontalSliderView, Backbone.View);
      function HorizontalSliderView(width, height) {
        this.width = width != null ? width : 300;
        this.height = height != null ? height : 300;
        HorizontalSliderView.__super__.constructor.apply(this, arguments);
        _.bindAll(this);
        this.el = div("");
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
        $(this.el).append(this.slideWrapper);
        this.panelCount = 0;
        return this;
      }
      HorizontalSliderView.prototype.goto = function(index) {
        var translateX;
        if (z.browser.webkit) {
          translateX = -1 * (index * this.width);
          return z(this.slideWrapper[0]).anim({
            "translateX": translateX + "px"
          });
        } else {
          return $(this.slideWrapper).animate({
            "left": (-1 * (index * this.width)) + "px"
          });
        }
      };
      HorizontalSliderView.prototype.addPanel = function(panelView) {
        var count, panelEl, panelWrapper;
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
          left: (this.panelCount - 1) * this.width
        });
        panelWrapper.append(panelEl);
        panelWrapper.bind("click", __bind(function(event) {
          return this.panelWrapperClick(count - 1);
        }, this));
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
        this.triggerLinkClick = __bind(this.triggerLinkClick, this);;
        this.triggerMainLogoClick = __bind(this.triggerMainLogoClick, this);;        HomeView.__super__.constructor.apply(this, arguments);
      }
      __extends(HomeView, Backbone.View);
      HomeView.prototype.initialize = function() {
        HomeView.__super__.initialize.apply(this, arguments);
        _.bindAll(this);
        this.thumbsWidth = 200;
        this.el = $('#home-wrapper');
        this.state = "home";
        this.thumbGroupings = [];
        $('#main-logo').click(this.triggerMainLogoClick);
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
        var a;
        a = $("<a class='nav' href='#'>" + linkName + "</a>");
        a.bind("click", __bind(function(event) {
          event.preventDefault();
          return this.triggerLinkClick(linkName);
        }, this));
        return this.el.find("#links").append(a);
      };
      HomeView.prototype.triggerLinkClick = function(linkName) {
        return this.trigger("link", linkName);
      };
      HomeView.prototype.loadViewerImage = function(url) {
        return $("#viewer-img").attr("src", url);
      };
      HomeView.prototype.addImage = function(urls) {
        return;
      };
      HomeView.prototype.slideThumbnails = function(outOrIn) {
        var right, translate;
        console.log("sliding thumbnails " + outOrIn);
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
      HomeView.prototype.slideBanner = function(upOrDown) {
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
    HomePresenter = (function() {
      function HomePresenter() {
        this.handleGalleriesChange = __bind(this.handleGalleriesChange, this);;
        this.handleLinkClick = __bind(this.handleLinkClick, this);;        _.bindAll(this);
        this.model = new HomeModel;
        this.view = new HomeView;
        this.imgCss = {
          width: "43px",
          height: "43px"
        };
        this.model.bind("change:galleries", this.handleGalleriesChange);
        this.view.bind("link", this.handleLinkClick);
        this.model.loadGalleries();
      }
      HomePresenter.prototype.handleLinkClick = function(linkName) {
        var gallery_name;
        if (linkName === this.view.galleryState) {
          return;
        }
        this.view.galleryState = linkName;
        this.view.slideThumbnails("out");
        this.view.slideBanner("down");
        gallery_name = "gallery_" + linkName.toLowerCase();
        this.view.thumbsView.goto(this.linkPanelMap[linkName]);
        return this.view.bind("homeclick", __bind(function() {
          this.view.galleryState = "";
          this.view.slideThumbnails("in");
          return this.view.slideBanner("up");
        }, this));
      };
      HomePresenter.prototype.handleGalleriesChange = function(event) {
        var gallery, galleryIndex, image, imagePanel, index, info, linkName, meta, thumb, _len, _ref, _ref2, _results;
        this.view.clearNavLinks();
        this.linkPanelMap = {};
        galleryIndex = 0;
        _ref = this.model.get("galleries");
        _results = [];
        for (gallery in _ref) {
          info = _ref[gallery];
          linkName = k.capitalize(k(gallery).s("gallery_".length));
          console.log(linkName);
          this.view.addNavLink(linkName, "#");
          imagePanel = new ImagePanelView;
          imagePanel.linkName = linkName;
          imagePanel.bind("click", __bind(function(meta) {
            return this.view.setImage(meta.image);
          }, this));
          _ref2 = info.images;
          for (index = 0, _len = _ref2.length; index < _len; index++) {
            image = _ref2[index];
            thumb = info.thumbs[index];
            meta = {
              image: image,
              thumb: thumb,
              linkName: linkName
            };
            imagePanel.addImage(thumb, this.imgCss, meta);
          }
          this.view.thumbsView.addPanel(imagePanel);
          this.linkPanelMap[linkName] = galleryIndex;
          _results.push(galleryIndex++);
        }
        return _results;
      };
      return HomePresenter;
    })();
    return app = new HomePresenter;
  });
}).call(this);
