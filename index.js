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
  if (!window.console) {
    window.console = {};
  }
  if (!window.console.log) {
    window.console.log = function() {};
  }
  $(document).ready(function() {
    var ContactFormView, HomeModel, HomePresenter, HomeRoutes, HomeView, HorizontalSliderView, ImageDisplayerView, ImagePanelView, ManyImagesView, SlideShowView, app, routes;
    (function(jQuery) {
      var $;
      $ = jQuery;
      return $.fn.mouseextremes = function(percent) {
        var el;
        if (percent == null) {
          percent = 10;
        }
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
        this.decIndex = __bind(this.decIndex, this);;
        this.prevPicture = __bind(this.prevPicture, this);;
        this.nextPicture = __bind(this.nextPicture, this);;
        this.handleRightSideMouseMove = __bind(this.handleRightSideMouseMove, this);;
        this.handleNonRightSideMouseMove = __bind(this.handleNonRightSideMouseMove, this);;
        this.handleLeftSideMouseMove = __bind(this.handleLeftSideMouseMove, this);;
        this.handleNonLeftSideMouseMove = __bind(this.handleNonLeftSideMouseMove, this);;        this.el = div("");
        this.el.addClass("slide-show-yea");
        this.width = 960;
        this.height = 460;
        this.timer = "";
        this.interval = 6000;
        this.fadeSpeed = 1000;
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
        this.el.find('.right-slide-show-arrow').click(__bind(function() {
          this.pause();
          return this.nextPicture();
        }, this));
        this.el.find('.left-slide-show-arrow').click(__bind(function() {
          this.pause();
          return this.prevPicture();
        }, this));
        this.rightArrowVisible = false;
        this.rightArrowFading = false;
        this.leftArrowVisible = false;
        this.leftArrowFading = false;
        this.el.mouseleave(__bind(function() {
          this.handleNonLeftSideMouseMove();
          return this.handleNonRightSideMouseMove();
        }, this));
        this.el.mousemove(__bind(function(e) {
          var x, y;
          x = e.pageX - this.el.offset().left;
          y = e.pageY - this.el.offset().top;
          if (this.el.width() - x < 100) {
            this.handleRightSideMouseMove();
          } else {
            this.handleNonRightSideMouseMove();
          }
          if (x < 100) {
            return this.handleLeftSideMouseMove();
          } else {
            return this.handleNonLeftSideMouseMove();
          }
        }, this));
      }
      SlideShowView.prototype.handleNonLeftSideMouseMove = function() {
        if (this.leftArrowFading || !this.leftArrowVisible) {
          return;
        }
        this.leftArrowFading = true;
        return this.el.find('.left-slide-show-arrow').fadeOut(__bind(function() {
          this.leftArrowFading = false;
          return this.leftArrowVisible = false;
        }, this));
      };
      SlideShowView.prototype.handleLeftSideMouseMove = function() {
        if (this.leftArrowFading || this.leftArrowVisible) {
          return;
        }
        this.leftArrowFading = true;
        return this.el.find('.left-slide-show-arrow').fadeIn(__bind(function() {
          this.leftArrowFading = false;
          return this.leftArrowVisible = true;
        }, this));
      };
      SlideShowView.prototype.handleNonRightSideMouseMove = function() {
        if (this.rightArrowFading || !this.rightArrowVisible) {
          return;
        }
        this.rightArrowFading = true;
        return this.el.find('.right-slide-show-arrow').fadeOut(__bind(function() {
          this.rightArrowFading = false;
          return this.rightArrowVisible = false;
        }, this));
      };
      SlideShowView.prototype.handleRightSideMouseMove = function() {
        if (this.rightArrowFading || this.rightArrowVisible) {
          return;
        }
        this.rightArrowFading = true;
        return this.el.find('.right-slide-show-arrow').fadeIn(__bind(function() {
          this.rightArrowFading = false;
          return this.rightArrowVisible = true;
        }, this));
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
        if (this.index < 0) {
          return this.index = this.indexCount - 1;
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
        this.hide = __bind(this.hide, this);;
        this.show = __bind(this.show, this);;
        this.blur = __bind(this.blur, this);;        ContactFormView.__super__.constructor.apply(this, arguments);
        this.el = $("#contact-form");
        this.textarea = this.el.find('textarea');
        this.el.bind("submit", __bind(function(event) {
          event.preventDefault();
          this.trigger("submitContactForm", {
            email: this.el.find("#email").val(),
            message: "Name: " + (this.el.find('#name').val()) + "\nEmail: " + (this.el.find('#email').val()) + "\nPhone: " + (this.el.find('#phone').val()) + "\nDate: " + (this.el.find('#date').val()) + "\nLocation: " + (this.el.find('#location').val()) + "\nMessage:\n" + (this.el.find('#message').val())
          });
          return false;
        }, this));
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
            if (i === 3) {
              break;
            }
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
        this.slideDownSmall = __bind(this.slideDownSmall, this);;
        this.slideUpSmall = __bind(this.slideUpSmall, this);;
        this.handleMouseExtremeBottom = __bind(this.handleMouseExtremeBottom, this);;
        this.handleMouseNotExtremeBottom = __bind(this.handleMouseNotExtremeBottom, this);;
        this.handleMouseExtremeTop = __bind(this.handleMouseExtremeTop, this);;
        this.handleMouseNotExtremeTop = __bind(this.handleMouseNotExtremeTop, this);;
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
        this.el.mouseextremes();
        this.el.bind("mouseextremebottom", this.handleMouseExtremeBottom);
        this.el.bind("mousenotextremebottom", this.handleMouseNotExtremeBottom);
        this.el.bind("mouseextremetop", this.handleMouseExtremeTop);
        this.el.bind("mousenotextremetop", this.handleMouseNotExtremeTop);
        return this;
      }
      HorizontalSliderView.prototype.handleMouseNotExtremeTop = function() {
        if (this.slidingState === "up") {
          return;
        }
        this.slidingState = false;
        return clearInterval(this.slidingInterval);
      };
      HorizontalSliderView.prototype.handleMouseExtremeTop = function() {
        if (this.slidingState !== false) {
          return;
        }
        this.slidingState = "down";
        clearInterval(this.slidingInterval);
        return this.slidingInterval = setInterval(this.slideDownSmall, 10);
      };
      HorizontalSliderView.prototype.handleMouseNotExtremeBottom = function() {
        if (this.slidingState === "down") {
          return;
        }
        this.slidingState = false;
        return clearInterval(this.slidingInterval);
      };
      HorizontalSliderView.prototype.handleMouseExtremeBottom = function() {
        if (this.slidingState !== false) {
          return;
        }
        this.slidingState = "up";
        clearInterval(this.slidingInterval);
        return this.slidingInterval = setInterval(this.slideUpSmall, 10);
      };
      HorizontalSliderView.prototype.slideUpSmall = function() {
        return this.currentPanelEl.css("top", this.currentPanelEl.position().top - 2 + "px");
      };
      HorizontalSliderView.prototype.slideDownSmall = function() {
        if (this.currentPanelEl.position().top >= 0) {
          return;
        }
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
        this.linkAreaMouseOut = __bind(this.linkAreaMouseOut, this);;
        this.linkAreaMouseOver = __bind(this.linkAreaMouseOver, this);;        HomeView.__super__.constructor.apply(this, arguments);
      }
      __extends(HomeView, Backbone.View);
      HomeView.prototype.initialize = function() {
        HomeView.__super__.initialize.apply(this, arguments);
        _.bindAll(this);
        this.thumbsWidth = 200;
        this.el = $('#home-wrapper');
        this.state = "home";
        this.thumbGroupings = [];
        this.thumbsView = new HorizontalSliderView(this.thumbsWidth, 640);
        $('#thumbs').append(this.thumbsView.el);
        this.imageDisplayer = new ImageDisplayerView($('#viewer'));
        $('area').mouseover(__bind(function(e) {
          return this.linkAreaMouseOver($(e.target).attr('alt'));
        }, this));
        $('area').mouseout(__bind(function(e) {
          return this.linkAreaMouseOut($(e.target).attr('alt'));
        }, this));
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
      HomeView.prototype.linkAreaMouseOver = function(name) {
        return $(".bullet." + name).show();
      };
      HomeView.prototype.linkAreaMouseOut = function(name) {
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
        var bottom, slideAmt, translate;
        slideAmt = 50;
        if (upOrDown === "up") {
          translate = 0;
          bottom = "" + slideAmt + "px";
        } else {
          translate = "" + slideAmt + "px";
          bottom = 0;
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
    HomeRoutes = (function() {
      function HomeRoutes() {
        this.home = __bind(this.home, this);;
        this.gallery = __bind(this.gallery, this);;
        this.contact = __bind(this.contact, this);;        HomeRoutes.__super__.constructor.apply(this, arguments);
      }
      __extends(HomeRoutes, Backbone.Controller);
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
    })();
    HomePresenter = (function() {
      function HomePresenter() {
        this.handleGalleriesChange = __bind(this.handleGalleriesChange, this);;
        this.handleImagePanelImageClicked = __bind(this.handleImagePanelImageClicked, this);;
        this.handleLinkClick = __bind(this.handleLinkClick, this);;
        this.handleContactClick = __bind(this.handleContactClick, this);;        _.bindAll(this);
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
        return this.view.contactFormView.hide();
      };
      HomePresenter.prototype.handleContactClick = function() {
        this.slideShow.hide();
        this.view.hideViewer();
        this.view.contactFormView.show();
        this.view.galleryState = "";
        return this.view.slideThumbnails("in");
      };
      HomePresenter.prototype.handleLinkClick = function(linkName) {
        var gallery_name;
        this.view.showViewer();
        linkName = k.capitalize(linkName);
        if (this.slideShow.hidden === false) {
          this.slideShow.hide();
          this.view.showViewer();
        }
        if (linkName === this.view.galleryState) {
          return;
        }
        this.view.contactFormView.hide();
        this.view.galleryState = linkName;
        this.view.slideThumbnails("out");
        gallery_name = "gallery_" + linkName.toLowerCase();
        this.view.thumbsView.goto(this.linkPanelMap[linkName]);
        return this.view.displayFirstImage();
      };
      HomePresenter.prototype.handleImagePanelImageClicked = function(meta) {
        return this.view.setImage(meta.image);
      };
      HomePresenter.prototype.handleGalleriesChange = function(event) {
        var gallery, galleryIndex, image, imagePanel, index, info, linkName, meta, thumb, _i, _len, _len2, _ref, _ref2, _ref3;
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
        return Backbone.history.start();
      };
      return HomePresenter;
    })();
    window.app = new HomePresenter;
    app = window.app;
    return routes = new HomeRoutes;
  });
}).call(this);
