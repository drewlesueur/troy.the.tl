(function() {
  var div, getEl, img,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  _.mixin({
    wait: function(time, func) {
      return setTimeout(func, time);
    },
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

  if (!window.console) window.console = {};

  if (!window.console.log) window.console.log = function() {};

  $(document).ready(function() {
    var ContactFormView, HomeModel, HomePresenter, HomeRoutes, HomeView, HorizontalSliderView, ImageDisplayerView, ImagePanelView, ManyImagesView, SlideShowView, app, routes;
    (function(jQuery) {
      var $;
      $ = jQuery;
      return $.fn.mouseextremes = function(percent) {
        var el;
        if (percent == null) percent = 10;
        el = $(this);
        return el.mousemove(function(e) {
          var fromBottom, fromLeft, fromRight, fromTop, height, width, x, y;
          x = e.pageX - el.offset().left;
          y = e.pageY - el.offset().top;
          width = el.width();
          height = el.height();
          fromRight = (width - x) / width * 100;
          fromLeft = x / width * 100;
          fromTop = y / height * 100;
          fromBottom = (height - y) / height * 100;
          false && console.log("          top " + fromTop + "          bottom " + fromBottom + "          left " + fromLeft + "          right " + fromRight + "          ");
          if (fromTop <= percent) {
            el.trigger("mouseextremetop");
          } else {
            el.trigger("mousenotextremetop");
          }
          if (fromBottom <= percent) {
            el.trigger("mouseextremebottom");
          } else {
            el.trigger("mousenotextremebottom");
          }
          if (fromLeft <= percent) {
            el.trigger("mouseextremeleft");
          } else {
            el.trigger("mousenotextremeleft");
          }
          if (fromRight <= percent) {
            el.trigger("mouseexremeright");
          } else {
            el.trigger("mousenotextremeright");
          }
          return el.mouseleave(function() {
            el.trigger("mousenotextremetop");
            el.trigger("mousenotextremebottom");
            el.trigger("mousenotextremeleft");
            return el.trigger("mousenotextremeright");
          });
        });
      };
    })(jQuery);
    SlideShowView = (function(_super) {

      __extends(SlideShowView, _super);

      function SlideShowView() {
        this.init = __bind(this.init, this);
        this.start = __bind(this.start, this);
        this.pause = __bind(this.pause, this);
        this.tick = __bind(this.tick, this);
        this.show = __bind(this.show, this);
        this.hide = __bind(this.hide, this);
        this.incIndex = __bind(this.incIndex, this);
        this.decIndex = __bind(this.decIndex, this);
        this.prevPicture = __bind(this.prevPicture, this);
        this.nextPicture = __bind(this.nextPicture, this);
        this.handleRightSideMouseMove = __bind(this.handleRightSideMouseMove, this);
        this.handleNonRightSideMouseMove = __bind(this.handleNonRightSideMouseMove, this);
        this.handleLeftSideMouseMove = __bind(this.handleLeftSideMouseMove, this);
        this.handleNonLeftSideMouseMove = __bind(this.handleNonLeftSideMouseMove, this);
        var _this = this;
        this.el = div("");
        this.el.addClass("slide-show-yea");
        this.width = options.slideShowWidth;
        this.height = options.slideShowHeight;
        this.timer = "";
        this.interval = options.slideShowInterval * 1000;
        this.fadeSpeed = options.slideShowFadeSpeed * 1000;
        this.el.css({
          position: "relative"
        });
        this.indexCount = 0;
        this.index = 0;
        this.hidden = false;
        this.el.append(this.make("div", {
          "className": "arrow          left-slide-show-arrow"
        }, "\u25C4"));
        this.el.append(this.make("div", {
          "className": "arrow right-slide-show-arrow"
        }, "\u25BA"));
        this.el.find('.right-slide-show-arrow').click(function() {
          _this.pause();
          return _this.nextPicture();
        });
        this.el.find('.left-slide-show-arrow').click(function() {
          _this.pause();
          return _this.prevPicture();
        });
        this.rightArrowVisible = false;
        this.rightArrowFading = false;
        this.leftArrowVisible = false;
        this.leftArrowFading = false;
        $("body").mousemove(function(e) {
          if ($(e.target).is("body") || $(e.target).is("#wrapper")) {
            _this.handleNonLeftSideMouseMove();
            return _this.handleNonRightSideMouseMove();
          }
        });
        this.el.mouseleave(function() {
          _this.handleNonLeftSideMouseMove();
          return _this.handleNonRightSideMouseMove();
        });
        this.el.mousemove(function(e) {
          var x, y;
          x = e.pageX - _this.el.offset().left;
          y = e.pageY - _this.el.offset().top;
          if (_this.el.width() - x < options.arrowRange) {
            _this.handleRightSideMouseMove();
          } else {
            _this.handleNonRightSideMouseMove();
          }
          if (x < options.arrowRange) {
            return _this.handleLeftSideMouseMove();
          } else {
            return _this.handleNonLeftSideMouseMove();
          }
        });
      }

      SlideShowView.prototype.handleNonLeftSideMouseMove = function() {
        var _this = this;
        if (this.leftArrowFading || !this.leftArrowVisible) return;
        this.leftArrowFading = true;
        return this.el.find('.left-slide-show-arrow').fadeOut(function() {
          _this.leftArrowFading = false;
          return _this.leftArrowVisible = false;
        });
      };

      SlideShowView.prototype.handleLeftSideMouseMove = function() {
        var _this = this;
        if (this.leftArrowFading || this.leftArrowVisible) return;
        this.leftArrowFading = true;
        return this.el.find('.left-slide-show-arrow').fadeIn(function() {
          _this.leftArrowFading = false;
          return _this.leftArrowVisible = true;
        });
      };

      SlideShowView.prototype.handleNonRightSideMouseMove = function() {
        var _this = this;
        if (this.rightArrowFading || !this.rightArrowVisible) return;
        this.rightArrowFading = true;
        return this.el.find('.right-slide-show-arrow').fadeOut(function() {
          _this.rightArrowFading = false;
          return _this.rightArrowVisible = false;
        });
      };

      SlideShowView.prototype.handleRightSideMouseMove = function() {
        var _this = this;
        if (this.rightArrowFading || this.rightArrowVisible) return;
        this.rightArrowFading = true;
        return this.el.find('.right-slide-show-arrow').fadeIn(function() {
          _this.rightArrowFading = false;
          return _this.rightArrowVisible = true;
        });
      };

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
        if (this.index < 0) return this.index = this.indexCount - 1;
      };

      SlideShowView.prototype.incIndex = function() {
        this.index++;
        if (this.index >= this.indexCount) return this.index = 0;
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

    })(Backbone.View);
    window.stater = function(states) {
      var ret, stateId;
      stateId = 0;
      ret = function() {
        var ret1;
        ret1 = states[stateId];
        stateId++;
        if (stateId === states.length) stateId = 0;
        return ret1;
      };
      return ret;
    };
    ImageDisplayerView = (function(_super) {

      __extends(ImageDisplayerView, _super);

      function ImageDisplayerView(parent) {
        this.showImage = __bind(this.showImage, this);
        this.updateLoader = __bind(this.updateLoader, this);        this.el = parent || div("");
        this.images = {};
        this.currentImage = $(this.make("img"));
        this.loading = div("Loading...");
        this.loading.css({
          margin: "50px"
        });
        this.loadingStater = stater(options.loadingText);
        this.loading.css({
          color: "white",
          position: "absolute",
          top: 0,
          left: 0,
          "display": "none"
        });
        this.el.append(this.loading);
        this.loadingTimer = setInterval(this.updateLoader, options.loadingSpeed * 1000);
      }

      ImageDisplayerView.prototype.updateLoader = function() {
        return this.loading.html(this.loadingStater());
      };

      ImageDisplayerView.prototype.showImage = function(url) {
        var image,
          _this = this;
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
        return image.el.load(function() {
          _this.el.find('img:visible').fadeOut();
          image.loaded = true;
          image.el.fadeIn();
          _this.currentImage = image.el;
          return _this.loading.hide();
        });
      };

      return ImageDisplayerView;

    })(Backbone.View);
    ContactFormView = (function(_super) {

      __extends(ContactFormView, _super);

      function ContactFormView() {
        this.hide = __bind(this.hide, this);
        this.show = __bind(this.show, this);
        this.blur = __bind(this.blur, this);
        var _this = this;
        ContactFormView.__super__.constructor.apply(this, arguments);
        this.el = $("#contact-form");
        this.textarea = this.el.find('textarea');
        this.el.bind("submit", function(event) {
          event.preventDefault();
          _this.trigger("submitContactForm", {
            email: _this.el.find("#email").val(),
            message: "Name: " + (_this.el.find('#name').val()) + "\nEmail: " + (_this.el.find('#email').val()) + "\nPhone: " + (_this.el.find('#phone').val()) + "\nDate: " + (_this.el.find('#date').val()) + "\nLocation: " + (_this.el.find('#location').val()) + "\nMessage:\n" + (_this.el.find('#message').val())
          });
          return false;
        });
      }

      ContactFormView.prototype.blur = function() {
        return this.el.blur();
      };

      ContactFormView.prototype.show = function() {
        return this.el.show();
      };

      ContactFormView.prototype.hide = function() {
        return this.el.hide();
      };

      return ContactFormView;

    })(Backbone.View);
    Backbone.emulateHTTP = true;
    HomeModel = (function(_super) {

      __extends(HomeModel, _super);

      function HomeModel() {
        this.loadGalleries = __bind(this.loadGalleries, this);
        this.loadGalleriesSuccess = __bind(this.loadGalleriesSuccess, this);        HomeModel.__super__.constructor.apply(this, arguments);
        _.bindAll(this);
        this.set({
          test: "another thing"
        });
      }

      HomeModel.prototype.url = 'http://troybrinkerhoff.com/new2/galleries.php';

      HomeModel.prototype.loadGalleriesSuccess = function(data) {
        var i, key, newData, value;
        if (environment === "test") {
          for (key in data) {
            value = data[key];
            value.images = _.s(value.images, 0, 3);
            value.thumbs = _.s(value.thumbs, 0, 3);
            data[key] = value;
          }
        }
        if (false && environment !== "test") {
          console.log(data);
          newData = {};
          i = 0;
          for (key in data) {
            value = data[key];
            i++;
            value.images = _.s(value.images, 0, 3);
            value.thumbs = _.s(value.thumbs, 0, 3);
            newData[key] = value;
            if (i === 3) break;
          }
          console.log(JSON.stringify(newData));
        }
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

    })(Backbone.Model);
    ImagePanelView = (function(_super) {

      __extends(ImagePanelView, _super);

      function ImagePanelView() {
        this.triggerClick = __bind(this.triggerClick, this);        ImagePanelView.__super__.constructor.apply(this, arguments);
        this.el = div("");
        _.bindAll(this);
      }

      ImagePanelView.prototype.addImage = function(url, css, meta) {
        var img1,
          _this = this;
        if (k.s(url, -2) === "db") return;
        img1 = $(document.createElement("img"));
        img1.attr("src", url);
        img1.addClass("thumbnail-image");
        img1.css(css);
        meta.img = img1;
        this.el.append(img1);
        img1.bind("click", function(event) {
          _this.triggerClick(meta);
          _this.el.find("img").css({
            opacity: 0.5
          });
          _this.el.find('[data-active=true]').removeAttr('data-active');
          img1.attr("data-active", 'true');
          return img1.css({
            "opacity": 1
          });
        });
        img1.bind("mouseover", function(event) {
          return img1.css({
            "opacity": 1
          });
        });
        return img1.bind({
          "mouseout": function(event) {
            if (img1.attr("data-active") !== 'true') {
              return img1.css({
                "opacity": 0.5
              });
            }
          }
        });
      };

      ImagePanelView.prototype.triggerClick = function(meta) {
        return this.trigger("click", meta);
      };

      return ImagePanelView;

    })(Backbone.View);
    HorizontalSliderView = (function(_super) {

      __extends(HorizontalSliderView, _super);

      function HorizontalSliderView(width, height) {
        this.width = width != null ? width : 300;
        this.height = height != null ? height : 300;
        this.slideDownSmall = __bind(this.slideDownSmall, this);
        this.slideUpSmall = __bind(this.slideUpSmall, this);
        this.handleMouseExtremeBottom = __bind(this.handleMouseExtremeBottom, this);
        this.handleMouseNotExtremeBottom = __bind(this.handleMouseNotExtremeBottom, this);
        this.handleMouseExtremeTop = __bind(this.handleMouseExtremeTop, this);
        this.handleMouseNotExtremeTop = __bind(this.handleMouseNotExtremeTop, this);
        HorizontalSliderView.__super__.constructor.apply(this, arguments);
        _.bindAll(this);
        this.el = div("");
        this.el.addClass("horizontal-slider-view");
        this.el.css({
          width: "" + this.width + "px",
          height: "" + this.height + "px",
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
        this.slidingState = false;
        this.slidingInterval = null;
        this.el.mouseextremes(options.scrollPercent);
        this.el.bind("mouseextremebottom", this.handleMouseExtremeBottom);
        this.el.bind("mousenotextremebottom", this.handleMouseNotExtremeBottom);
        this.el.bind("mouseextremetop", this.handleMouseExtremeTop);
        this.el.bind("mousenotextremetop", this.handleMouseNotExtremeTop);
        return this;
      }

      HorizontalSliderView.prototype.handleMouseNotExtremeTop = function() {
        if (this.slidingState === "up") return;
        this.slidingState = false;
        return clearInterval(this.slidingInterval);
      };

      HorizontalSliderView.prototype.handleMouseExtremeTop = function() {
        if (this.slidingState !== false) return;
        this.slidingState = "down";
        clearInterval(this.slidingInterval);
        return this.slidingInterval = setInterval(this.slideDownSmall, options.thumbnailScrollSpeed);
      };

      HorizontalSliderView.prototype.handleMouseNotExtremeBottom = function() {
        if (this.slidingState === "down") return;
        this.slidingState = false;
        return clearInterval(this.slidingInterval);
      };

      HorizontalSliderView.prototype.handleMouseExtremeBottom = function() {
        if (this.slidingState !== false) return;
        this.slidingState = "up";
        clearInterval(this.slidingInterval);
        return this.slidingInterval = setInterval(this.slideUpSmall, options.thumbnailScrollSpeed);
      };

      HorizontalSliderView.prototype.slideUpSmall = function() {
        var numberOfImages, numberOfRows;
        numberOfImages = this.currentPanelEl.find("img").length;
        numberOfRows = Math.ceil(numberOfImages / 3);
        if (-this.currentPanelEl.position().top > ((numberOfRows * 48) + 43)) {
          return;
        }
        return this.currentPanelEl.css("top", this.currentPanelEl.position().top - 2 + "px");
      };

      HorizontalSliderView.prototype.slideDownSmall = function() {
        if (this.currentPanelEl.position().top >= 0) return;
        return this.currentPanelEl.css("top", this.currentPanelEl.position().top + 2 + "px");
      };

      HorizontalSliderView.prototype.goto = function(index) {
        var translateX;
        this.currentPanel = index;
        this.currentPanelEl = this.el.find("[data-index='" + this.currentPanel + "']");
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
        var count, panelEl, panelWrapper,
          _this = this;
        this.panelCount++;
        count = this.panelCount;
        if (!panelView) panelView = $("<div>");
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
        panelWrapper.bind("click", function(event) {
          return _this.panelWrapperClick(count - 1);
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

    })(Backbone.View);
    HomeView = (function(_super) {

      __extends(HomeView, _super);

      function HomeView() {
        this.showViewer = __bind(this.showViewer, this);
        this.hideViewer = __bind(this.hideViewer, this);
        this.displayFirstImage = __bind(this.displayFirstImage, this);
        this.linkAreaMouseOut = __bind(this.linkAreaMouseOut, this);
        this.linkAreaMouseOver = __bind(this.linkAreaMouseOver, this);
        HomeView.__super__.constructor.apply(this, arguments);
      }

      HomeView.prototype.initialize = function() {
        var _this = this;
        HomeView.__super__.initialize.apply(this, arguments);
        _.bindAll(this);
        this.thumbsWidth = options.thumbnailBarWidth;
        this.el = $('#home-wrapper');
        this.state = "home";
        this.thumbGroupings = [];
        this.thumbsView = new HorizontalSliderView(this.thumbsWidth, options.thumbnailBarHeight);
        $('#thumbs').append(this.thumbsView.el);
        this.imageDisplayer = new ImageDisplayerView($('#viewer'));
        $('area').mouseover(function(e) {
          return _this.linkAreaMouseOver($(e.target).attr('alt'));
        });
        $('area').mouseout(function(e) {
          return _this.linkAreaMouseOut($(e.target).attr('alt'));
        });
        $("#banner").css("top", "" + options.bannerStartPosition + "px");
        $("#slide-show").css("margin-top", options.slideShowTopMargin);
        this.contactFormView = new ContactFormView;
        return this.contactFormView.bind("submitContactForm", function(formInfo) {
          return $.ajax({
            type: "GET",
            url: "http://troybrinkerhoff.com/new2/contact.php",
            data: formInfo,
            dataType: "jsonp",
            success: function(data) {
              if (data === 1) {
                alert("Thank you");
                return _this.contactFormView.blur();
              } else {
                return alert("Error while sending contact form");
              }
            }
          });
        });
      };

      HomeView.prototype.linkAreaMouseOver = function(name) {
        return;
        return $(".bullet." + name).show();
      };

      HomeView.prototype.linkAreaMouseOut = function(name) {
        return;
        return $(".bullet." + name).hide();
      };

      HomeView.prototype.setImage = function(url) {
        return this.imageDisplayer.showImage(url);
      };

      HomeView.prototype.displayFirstImage = function() {
        return this.thumbsView.currentPanelEl.find("img:first").click();
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
        var slideAmt, theTop, translate;
        slideAmt = options.bannerEndPosition - options.bannerStartPosition;
        if (upOrDown === "up") {
          translate = 0;
          theTop = options.bannerStartPosition + "px";
        } else {
          translate = "" + slideAmt + "px";
          theTop = options.bannerEndPosition + "px";
        }
        if (z.browser.webkit) {
          return z("#banner").anim({
            "translateY": translate
          });
        } else {
          return $("#banner").animate({
            "top": theTop
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

    })(Backbone.View);
    ManyImagesView = (function(_super) {

      __extends(ManyImagesView, _super);

      function ManyImagesView() {
        this.loadSpecific = __bind(this.loadSpecific, this);
        this.addImage = __bind(this.addImage, this);        ManyImagesView.__super__.constructor.apply(this, arguments);
        this.images = [];
      }

      ManyImagesView.prototype.addImage = function(url) {
        var image,
          _this = this;
        image = {
          loaded: false,
          url: url,
          el: $(this.make("img")),
          onload: function() {}
        };
        this.images.push(image);
        return image.el.load(function() {
          image.loaded = true;
          _this.index++;
          return _this.loadSpecific;
        });
      };

      ManyImagesView.prototype.kickOffLoading = function() {};

      ManyImagesView.prototype.loadSpecific = function() {
        var image;
        image = this.images[this.index];
        return image.el.attr("src", image.url);
      };

      return ManyImagesView;

    })(Backbone.View);
    HomeRoutes = (function(_super) {

      __extends(HomeRoutes, _super);

      function HomeRoutes() {
        this.home = __bind(this.home, this);
        this.gallery = __bind(this.gallery, this);
        this.contact = __bind(this.contact, this);
        HomeRoutes.__super__.constructor.apply(this, arguments);
      }

      HomeRoutes.prototype.routes = {
        "galleries/:gallery": "gallery",
        "home": "home",
        "contact": "contact"
      };

      HomeRoutes.prototype.contact = function() {
        return app.handleContactClick();
      };

      HomeRoutes.prototype.gallery = function(galleryName) {
        return app.handleLinkClick(galleryName);
      };

      HomeRoutes.prototype.home = function() {
        return app.handleHomeClick();
      };

      return HomeRoutes;

    })(Backbone.Controller);
    HomePresenter = (function() {

      function HomePresenter() {
        this.handleGalleriesChange = __bind(this.handleGalleriesChange, this);
        this.handleImagePanelImageClicked = __bind(this.handleImagePanelImageClicked, this);
        this.handleLinkClick = __bind(this.handleLinkClick, this);
        this.handleContactClick = __bind(this.handleContactClick, this);        _.bindAll(this);
        this.slideShow = new SlideShowView;
        this.slideShow.el.attr("id", "slide-show");
        $('#home-wrapper').append(this.slideShow.el);
        this.model = new HomeModel;
        this.view = new HomeView;
        this.imgCss = {
          width: "43px",
          height: "43px",
          opacity: "0.5"
        };
        this.model.bind("change:galleries", this.handleGalleriesChange);
        this.model.loadGalleries();
      }

      HomePresenter.prototype.handleHomeClick = function() {
        this.view.hideViewer();
        this.slideShow.show();
        this.slideShow.start();
        this.view.galleryState = "";
        this.view.slideThumbnails("in");
        this.view.slideBanner("up");
        return this.view.contactFormView.hide();
      };

      HomePresenter.prototype.handleContactClick = function() {
        this.slideShow.hide();
        this.view.hideViewer();
        this.view.contactFormView.show();
        this.view.galleryState = "";
        this.view.slideThumbnails("in");
        return this.view.slideBanner("down");
      };

      HomePresenter.prototype.handleLinkClick = function(linkName) {
        var gallery_name;
        this.view.showViewer();
        linkName = k.capitalize(linkName);
        if (this.slideShow.hidden === false) {
          this.slideShow.hide();
          this.view.showViewer();
        }
        if (linkName === this.view.galleryState) return;
        this.view.contactFormView.hide();
        this.view.galleryState = linkName;
        this.view.slideThumbnails("out");
        this.view.slideBanner("down");
        gallery_name = "gallery_" + linkName.toLowerCase();
        this.view.thumbsView.goto(this.linkPanelMap[linkName]);
        return this.view.displayFirstImage();
      };

      HomePresenter.prototype.handleImagePanelImageClicked = function(meta) {
        return this.view.setImage(meta.image);
      };

      HomePresenter.prototype.handleGalleriesChange = function(event) {
        var gallery, galleryIndex, image, imagePanel, index, info, linkName, meta, thumb, _i, _len, _len2, _ref, _ref2, _ref3,
          _this = this;
        _ref = k.s(this.model.get("galleries").gallery_slideshow.images, 0);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          image = _ref[_i];
          this.slideShow.addPicture(image);
        }
        this.slideShow.init();
        this.linkPanelMap = {};
        galleryIndex = 0;
        _ref2 = this.model.get("galleries");
        for (gallery in _ref2) {
          info = _ref2[gallery];
          linkName = k.capitalize(k(gallery).s("gallery_".length));
          imagePanel = new ImagePanelView;
          imagePanel.linkName = linkName;
          imagePanel.bind("click", function(meta) {
            return _this.handleImagePanelImageClicked(meta);
          });
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
        return Backbone.history.start();
      };

      return HomePresenter;

    })();
    window.app = new HomePresenter;
    app = window.app;
    return routes = new HomeRoutes;
  });

}).call(this);
