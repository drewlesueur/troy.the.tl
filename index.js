(function() {
  var div, getEl, img;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
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
    var ContactFormView, HomeModel, HomePresenter, HomeView, HorizontalSliderView, ImageDisplayerView, ImagePanelView, ManyImagesView, SlideShowView, app;
    SlideShowView = (function() {
      __extends(SlideShowView, Backbone.View);
      function SlideShowView() {
        this.init = __bind(this.init, this);;
        this.start = __bind(this.start, this);;
        this.pause = __bind(this.pause, this);;
        this.tick = __bind(this.tick, this);;
        this.show = __bind(this.show, this);;
        this.hide = __bind(this.hide, this);;
        this.incIndex = __bind(this.incIndex, this);;
        this.decIndex = __bind(this.decIndex, this);;        this.el = div("");
        this.el.addClass("slide-show-yea");
        this.width = 960;
        this.height = 460;
        this.timer = "";
        this.interval = 6000;
        this.fadeSpeed = 4000;
        this.el.css({
          position: "relative"
        });
        this.indexCount = 0;
        this.index = 0;
        this.hidden = false;
      }
      SlideShowView.prototype.addPicture = function(url) {
        var image;
        image = $(document.createElement("img"));
        image.load(function() {
          return image.attr("data-loaded", "true");
        });
        image.attr('src', url);
        image.attr('data-index', this.indexCount);
        image.css({
          width: "" + this.width + "px"
        });
        this.el.append(image);
        image.css({
          position: 'absolute',
          top: 0,
          left: 0,
          display: "none"
        });
        return this.indexCount++;
      };
      SlideShowView.prototype.nextPicture = function() {
        this.el.find("img:visible").fadeOut(this.fadeSpeed);
        this.el.find("[data-index=" + this.index + "]").fadeIn(this.fadeSpeed);
        return this.incIndex();
      };
      SlideShowView.prototype.prevPicture = function() {
        this.el.find("img:visible").fadeOut(this.fadeSpeed);
        this.el.find("[data-index=" + this.index + "]").fadeIn(this.fadeSpeed);
        return this.decIndex();
      };
      SlideShowView.prototype.decIndex = function() {
        this.index--;
        if (this.index <= 0) {
          return this.index = this.indexCount;
        }
      };
      SlideShowView.prototype.incIndex = function() {
        this.index++;
        if (this.index >= this.indexCount) {
          return this.index = 0;
        }
      };
      SlideShowView.prototype.hide = function() {
        clearTimeout(this.timeout);
        this.el.hide();
        return this.hidden = true;
      };
      SlideShowView.prototype.show = function() {
        this.el.show();
        return this.hidden = false;
      };
      SlideShowView.prototype.tick = function() {
        var img1;
        img1 = this.el.find("[data-index=" + this.index + "]");
        if (this.index === 0 || img1.attr("data-loaded") === "true") {
          this.nextPicture();
          return this.timeout = setTimeout(this.tick, this.interval);
        } else {
          1;
          return this.timeout = setTimeout(this.tick, this.interval);
        }
      };
      SlideShowView.prototype.pause = function() {
        return clearTimeout(this.timeout);
      };
      SlideShowView.prototype.start = function() {
        clearTimeout(this.timeout);
        return this.timeout = setTimeout(this.tick, this.interval);
      };
      SlideShowView.prototype.init = function() {
        return this.tick();
      };
      return SlideShowView;
    })();
    window.stater = function(states) {
      var ret, stateId;
      stateId = 0;
      ret = function() {
        var ret1;
        ret1 = states[stateId];
        stateId++;
        if (stateId === states.length) {
          stateId = 0;
        }
        return ret1;
      };
      return ret;
    };
    ImageDisplayerView = (function() {
      __extends(ImageDisplayerView, Backbone.View);
      function ImageDisplayerView(parent) {
        this.showImage = __bind(this.showImage, this);;
        this.updateLoader = __bind(this.updateLoader, this);;        this.el = parent || div("");
        this.images = {};
        this.currentImage = $(this.make("img"));
        this.loading = div("Loading...");
        this.loading.css({
          margin: "50px"
        });
        this.loadingStater = stater(["Loading", "Loading.", "Loading..", "Loading..."]);
        this.loading.css({
          color: "white",
          position: "absolute",
          top: 0,
          left: 0,
          "display": "none"
        });
        this.el.append(this.loading);
        this.loadingTimer = setInterval(this.updateLoader, 250);
      }
      ImageDisplayerView.prototype.updateLoader = function() {
        return this.loading.html(this.loadingStater());
      };
      ImageDisplayerView.prototype.showImage = function(url) {
        var image;
        this.loading.show();
        this.el.find('img:visible').fadeOut();
        if (url in this.images) {
          this.images[url].el.fadeIn();
          return;
        }
        image = {
          url: url,
          el: $(this.make("img")),
          loaded: false
        };
        image.el.css({
          position: "absolute",
          top: 0,
          left: 0,
          display: "none"
        });
        this.el.append(image.el);
        image.el.attr("src", image.url);
        return image.el.load(__bind(function() {
          this.el.find('img:visible').fadeOut();
          image.loaded = true;
          image.el.fadeIn();
          this.currentImage = image.el;
          return this.loading.hide();
        }, this));
      };
      return ImageDisplayerView;
    })();
    ContactFormView = (function() {
      __extends(ContactFormView, Backbone.View);
      function ContactFormView() {
        this.blur = __bind(this.blur, this);;        ContactFormView.__super__.constructor.apply(this, arguments);
        this.el = $("#contact-form");
        this.textarea = this.el.find('textarea');
        this.textarea.bind('focus', __bind(function(event) {
          return this.textarea.animate({
            width: "300px",
            height: "100px"
          }, 200);
        }, this));
        this.el.bind("blur", __bind(function(event) {
          return this.textarea.animate({
            width: "100px",
            height: "20px"
          }, 200);
        }, this));
        this.el.bind("submit", __bind(function(event) {
          event.preventDefault();
          this.trigger("submitContactForm", {
            email: this.el.find("#email").val(),
            message: this.el.find('#message').val()
          });
          return false;
        }, this));
      }
      ContactFormView.prototype.blur = function() {
        return this.el.blur();
      };
      return ContactFormView;
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
        this.triggerClick = __bind(this.triggerClick, this);;        ImagePanelView.__super__.constructor.apply(this, arguments);
        this.el = div("");
        _.bindAll(this);
      }
      ImagePanelView.prototype.addImage = function(url, css, meta) {
        var img1;
        if (k.s(url, -2) === "db") {
          return;
        }
        img1 = $(document.createElement("img"));
        img1.attr("src", url);
        img1.addClass("thumbnail-image");
        img1.css(css);
        meta.img = img1;
        this.el.append(img1);
        img1.bind("click", __bind(function(event) {
          this.triggerClick(meta);
          this.el.find("img").css({
            opacity: 0.5
          });
          this.el.find('[data-active=true]').removeAttr('data-active');
          img1.attr("data-active", 'true');
          return img1.css({
            "opacity": 1
          });
        }, this));
        img1.bind("mouseover", __bind(function(event) {
          return img1.css({
            "opacity": 1
          });
        }, this));
        return img1.bind({
          "mouseout": __bind(function(event) {
            if (img1.attr("data-active") !== 'true') {
              return img1.css({
                "opacity": 0.5
              });
            }
          }, this)
        });
      };
      ImagePanelView.prototype.triggerClick = function(meta) {
        return this.trigger("click", meta);
      };
      return ImagePanelView;
    })();
    HorizontalSliderView = (function() {
      __extends(HorizontalSliderView, Backbone.View);
      function HorizontalSliderView(width, height) {
        this.width = width != null ? width : 300;
        this.height = height != null ? height : 300;
        this.currentPanelEl = __bind(this.currentPanelEl, this);;
        HorizontalSliderView.__super__.constructor.apply(this, arguments);
        _.bindAll(this);
        this.el = div("");
        this.el.addClass("horizontal-slider-view");
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
        this.currentPanel = 0;
        return this;
      }
      HorizontalSliderView.prototype.currentPanelEl = function() {
        var ret;
        ret = this.el.find("[data-index='" + this.currentPanel + "']");
        return ret;
      };
      HorizontalSliderView.prototype.goto = function(index) {
        var translateX;
        this.currentPanel = index;
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
        panelWrapper.addClass("panel");
        panelWrapper.attr("data-index", this.panelCount - 1);
        panelWrapper.addClass("panel");
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
        this.showViewer = __bind(this.showViewer, this);;
        this.hideViewer = __bind(this.hideViewer, this);;
        this.displayFirstImage = __bind(this.displayFirstImage, this);;
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
        $('#thumbs').append(this.thumbsView.el);
        this.imageDisplayer = new ImageDisplayerView($('#viewer'));
        this.contactFormView = new ContactFormView;
        return this.contactFormView.bind("submitContactForm", __bind(function(formInfo) {
          return $.ajax({
            type: "GET",
            url: "http://troybrinkerhoff.com/new2/contact.php",
            data: formInfo,
            dataType: "jsonp",
            success: __bind(function(data) {
              if (data === 1) {
                alert("Thank you");
                return this.contactFormView.blur();
              } else {
                return alert("Error while sending contact form");
              }
            }, this)
          });
        }, this));
      };
      HomeView.prototype.triggerMainLogoClick = function() {
        return this.trigger("homeclick");
      };
      HomeView.prototype.setImage = function(url) {
        return this.imageDisplayer.showImage(url);
      };
      HomeView.prototype.clearNavLinks = function() {
        return this.el.find("#links").empty();
      };
      HomeView.prototype.addNavLink = function(linkName, linkAddress, type) {
        var a;
        if (linkAddress == null) {
          linkAddress = '#';
        }
        a = $("<a class='nav' href='" + linkAddress + "'>" + linkName + "</a>");
        this.el.find("#links").append(a);
        if (type === "normal") {
          return;
        }
        return a.bind("click", __bind(function(event) {
          event.preventDefault();
          return this.triggerLinkClick(linkName);
        }, this));
      };
      HomeView.prototype.triggerLinkClick = function(linkName) {
        return this.trigger("link", linkName);
      };
      HomeView.prototype.displayFirstImage = function() {
        return this.thumbsView.currentPanelEl().find("img:first").click();
      };
      HomeView.prototype.addImage = function(urls) {};
      HomeView.prototype.slideThumbnails = function(outOrIn) {
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
      HomeView.prototype.slideBanner = function(upOrDown) {
        var slideAmt, top, translate;
        slideAmt = 550;
        if (upOrDown === "up") {
          translate = "-" + slideAmt + "px";
          top = 0;
        } else {
          translate = 0;
          top = "" + slideAmt + "px";
        }
        if (z.browser.webkit) {
          return z("#banner").anim({
            "translateY": translate
          });
        } else {
          return $("#banner").animate({
            "top": top
          });
        }
      };
      HomeView.prototype.hideViewer = function() {
        return $('#viewer').hide();
      };
      HomeView.prototype.showViewer = function() {
        return $('#viewer').show();
      };
      return HomeView;
    })();
    ManyImagesView = (function() {
      __extends(ManyImagesView, Backbone.View);
      function ManyImagesView() {
        this.loadSpecific = __bind(this.loadSpecific, this);;
        this.addImage = __bind(this.addImage, this);;        ManyImagesView.__super__.constructor.apply(this, arguments);
        this.images = [];
      }
      ManyImagesView.prototype.addImage = function(url) {
        var image;
        image = {
          loaded: false,
          url: url,
          el: $(this.make("img")),
          onload: function() {}
        };
        this.images.push(image);
        return image.el.load(__bind(function() {
          image.loaded = true;
          this.index++;
          return this.loadSpecific;
        }, this));
      };
      ManyImagesView.prototype.kickOffLoading = function() {};
      ManyImagesView.prototype.loadSpecific = function() {
        var image;
        image = this.images[this.index];
        return image.el.attr("src", image.url);
      };
      return ManyImagesView;
    })();
    HomePresenter = (function() {
      function HomePresenter() {
        this.handleGalleriesChange = __bind(this.handleGalleriesChange, this);;
        this.handleImagePanelImageClicked = __bind(this.handleImagePanelImageClicked, this);;
        this.handleLinkClick = __bind(this.handleLinkClick, this);;        _.bindAll(this);
        this.slideShow = new SlideShowView;
        $('#home-wrapper').append(this.slideShow.el);
        this.model = new HomeModel;
        this.view = new HomeView;
        this.imgCss = {
          width: "43px",
          height: "43px",
          opacity: "0.5"
        };
        this.model.bind("change:galleries", this.handleGalleriesChange);
        this.view.bind("link", this.handleLinkClick);
        this.model.loadGalleries();
        this.view.bind("homeclick", __bind(function() {
          this.view.hideViewer();
          this.slideShow.show();
          this.slideShow.start();
          this.view.galleryState = "";
          this.view.slideThumbnails("in");
          return this.view.slideBanner("down");
        }, this));
      }
      HomePresenter.prototype.handleLinkClick = function(linkName) {
        var gallery_name;
        if (this.slideShow.hidden === false) {
          this.slideShow.hide();
          this.view.showViewer();
        }
        if (linkName === this.view.galleryState) {
          return;
        }
        this.view.galleryState = linkName;
        this.view.slideThumbnails("out");
        this.view.slideBanner("up");
        gallery_name = "gallery_" + linkName.toLowerCase();
        this.view.thumbsView.goto(this.linkPanelMap[linkName]);
        return this.view.displayFirstImage();
      };
      HomePresenter.prototype.handleImagePanelImageClicked = function(meta) {
        return this.view.setImage(meta.image);
      };
      HomePresenter.prototype.handleGalleriesChange = function(event) {
        var gallery, galleryIndex, image, imagePanel, index, info, linkName, meta, thumb, _i, _len, _len2, _ref, _ref2, _ref3;
        _ref = k.s(this.model.get("galleries").gallery_test.images, 0, 3);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          image = _ref[_i];
          this.slideShow.addPicture(image);
        }
        this.slideShow.init();
        this.view.clearNavLinks();
        this.linkPanelMap = {};
        galleryIndex = 0;
        _ref2 = this.model.get("galleries");
        for (gallery in _ref2) {
          info = _ref2[gallery];
          linkName = k.capitalize(k(gallery).s("gallery_".length));
          this.view.addNavLink(linkName, "#");
          imagePanel = new ImagePanelView;
          imagePanel.linkName = linkName;
          imagePanel.bind("click", __bind(function(meta) {
            return this.handleImagePanelImageClicked(meta);
          }, this));
          _ref3 = info.images;
          for (index = 0, _len2 = _ref3.length; index < _len2; index++) {
            image = _ref3[index];
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
          galleryIndex++;
        }
        return this.view.addNavLink("Online Viewing", "http://troybrinkerhoff.com/onlineviewing/", "normal");
      };
      return HomePresenter;
    })();
    return app = new HomePresenter;
  });
}).call(this);
