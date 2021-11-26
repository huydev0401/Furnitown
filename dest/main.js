$(".load").fadeOut(1000);
$(window).on("load", function () {
  // declare
  let $scrollMenu = $(".scrollmenu"),
    $toggleBtn = $(".toggle-menu"),
    $slider = $(".slider"),
    $navMobile = $(".nav-mobile"),
    $hamburger = $(".toggle-menu .hamburger"),
    $toTop = $(".backtotop"),
    $menuBtn = $(".btnmenu"),
    $sidebar = $(".sidebar"),
    $overlay = $(".overlay-modal"),
    $closeBtn = $(".sidebar .close"),
    $homeBtn = $(".sidebar .logo"),
    $header = $("header"),
    $dropdown = $(".dropdown");

  function scrollHeader() {
    let scrollY = $(window).scrollTop();
    if (scrollY > $header.outerHeight()) {
      $scrollMenu.addClass("active");
    } else {
      $scrollMenu.removeClass("active");
    }
  }
  function closeNav() {
    $hamburger.removeClass("active");
    $navMobile.removeClass("active");
  }
  function handleClickToggleMenu() {
    $hamburger.toggleClass("active");
    $navMobile.toggleClass("active");
  }

  function showSidebar() {
    $sidebar.addClass("active");
    $overlay.show();
    $menuBtn.hide();
    $slider.css("padding-left", "500px");
    $(".slider__bottom").css("padding-left", "500px");
  }

  function closeSidebar() {
    $sidebar.removeClass("active");
    $overlay.hide();
    $menuBtn.show();
    $slider.css("padding-left", "0px");
    $(".slider__bottom").css("padding-left", "0px");
  }

  // scroll header
  $(window).on("scroll", scrollHeader);

  // nav mobile
  $toggleBtn.on("click", handleClickToggleMenu);

  // window resize
  $(window).on("resize", function () {
    if ($(window).innerWidth() > 767) {
      closeNav();
    }
  });

  // back to top
  $toTop.on("click", function () {
    $(window).scrollTop(0);
  });

  // sidebar
  $menuBtn.on("click", showSidebar);
  $closeBtn.on("click", closeSidebar);
  $homeBtn.on("click", closeSidebar);
  $overlay.on("click", closeSidebar);

  // dropdown
  $dropdown.on("click", function (e) {
    e.stopPropagation();
    $(this).toggleClass("active");
  });
  $(".dropdown .dropdown__list p").on("click", function () {
    let optionValue = $(this).text();
    let currentValue = $(".dropdown .btn span").text();
    $(this).html(currentValue);
    $(".dropdown .btn span").html(optionValue);
  });

  // library
  // slider
  let $carousel = $(".slider__list");
  $carousel.flickity({
    cellAlign: "left",
    contain: true,
    prevNextButtons: false,
    pageDots: false,
    wrapAround: true,
    lazyLoad: true,
    friction: 0.6,
    autoPlay: true,
  });
  // next pre button
  $(".--next").on("click", function () {
    $carousel.flickity("next");
  });
  $(".--prev").on("click", function () {
    $carousel.flickity("previous");
  });

  // product list slider
  let $product__list = $(".product1page .product .item__list");
  $product__list.flickity({
    cellAlign: "left",
    contain: true,
    prevNextButtons: false,
    pageDots: false,
    wrapAround: true,
  });
  $(".--next").on("click", function () {
    $product__list.flickity("next");
  });

  let $img__list = $(".product3 .product__detail .image__list");
  $img__list.flickity({
    cellAlign: "left",
    contain: true,
    prevNextButtons: false,
    pageDots: false,
    draggable: false,
  });
  $(".image__group").on("click", ".img", function () {
    var index = $(this).index();
    $(this).addClass("selected").siblings().removeClass("selected");
    $img__list.flickity("select", index, false, true);
  });

  // photo swipe
  var initPhotoSwipeFromDOM = function (gallerySelector) {
    var parseThumbnailElements = function (el) {
      var thumbElements = el.childNodes,
        numNodes = thumbElements.length,
        items = [],
        figureEl,
        linkEl,
        size,
        item;
      for (var i = 0; i < numNodes; i++) {
        figureEl = thumbElements[i]; // <figure> element
        if (figureEl.nodeType !== 1) {
          continue;
        }
        linkEl = figureEl.children[0]; // <a> element
        size = linkEl.getAttribute("data-size").split("x");
        item = {
          src: linkEl.getAttribute("href"),
          w: parseInt(size[0], 10),
          h: parseInt(size[1], 10),
        };
        if (figureEl.children.length > 1) {
          item.title = figureEl.children[1].innerHTML;
        }
        if (linkEl.children.length > 0) {
          // <img> thumbnail element, retrieving thumbnail url
          item.msrc = linkEl.children[0].getAttribute("src");
        }
        item.el = figureEl; // save link to element for getThumbBoundsFn
        items.push(item);
      }
      return items;
    };
    var closest = function closest(el, fn) {
      return el && (fn(el) ? el : closest(el.parentNode, fn));
    };
    var onThumbnailsClick = function (e) {
      e = e || window.event;
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      var eTarget = e.target || e.srcElement;
      var clickedListItem = closest(eTarget, function (el) {
        return el.tagName && el.tagName.toUpperCase() === "FIGURE";
      });
      if (!clickedListItem) {
        return;
      }
      var clickedGallery = clickedListItem.parentNode,
        childNodes = clickedListItem.parentNode.childNodes,
        numChildNodes = childNodes.length,
        nodeIndex = 0,
        index;
      for (var i = 0; i < numChildNodes; i++) {
        if (childNodes[i].nodeType !== 1) {
          continue;
        }
        if (childNodes[i] === clickedListItem) {
          index = nodeIndex;
          break;
        }
        nodeIndex++;
      }
      if (index >= 0) {
        openPhotoSwipe(index, clickedGallery);
      }
      return false;
    };
    var photoswipeParseHash = function () {
      var hash = window.location.hash.substring(1),
        params = {};
      if (hash.length < 5) {
        return params;
      }
      var vars = hash.split("&");
      for (var i = 0; i < vars.length; i++) {
        if (!vars[i]) {
          continue;
        }
        var pair = vars[i].split("=");
        if (pair.length < 2) {
          continue;
        }
        params[pair[0]] = pair[1];
      }
      if (params.gid) {
        params.gid = parseInt(params.gid, 10);
      }
      return params;
    };
    var openPhotoSwipe = function (
      index,
      galleryElement,
      disableAnimation,
      fromURL
    ) {
      var pswpElement = document.querySelectorAll(".pswp")[0],
        gallery,
        options,
        items;
      items = parseThumbnailElements(galleryElement);
      options = {
        galleryUID: galleryElement.getAttribute("data-pswp-uid"),
        getThumbBoundsFn: function (index) {
          var thumbnail = items[index].el.getElementsByTagName("img")[0], // find thumbnail
            pageYScroll =
              window.pageYOffset || document.documentElement.scrollTop,
            rect = thumbnail.getBoundingClientRect();

          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        },
        showAnimationDuration: 0,
        hideAnimationDuration: 0,
      };
      if (fromURL) {
        if (options.galleryPIDs) {
          for (var j = 0; j < items.length; j++) {
            if (items[j].pid == index) {
              options.index = j;
              break;
            }
          }
        } else {
          options.index = parseInt(index, 10) - 1;
        }
      } else {
        options.index = parseInt(index, 10);
      }
      if (isNaN(options.index)) {
        return;
      }
      if (disableAnimation) {
        options.showAnimationDuration = 0;
      }
      gallery = new PhotoSwipe(
        pswpElement,
        PhotoSwipeUI_Default,
        items,
        options
      );
      gallery.init();
    };
    var galleryElements = document.querySelectorAll(gallerySelector);
    for (var i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute("data-pswp-uid", i + 1);
      galleryElements[i].onclick = onThumbnailsClick;
    }
    var hashData = photoswipeParseHash();
    if (hashData.pid && hashData.gid) {
      openPhotoSwipe(
        hashData.pid,
        galleryElements[hashData.gid - 1],
        true,
        true
      );
    }
  };
  initPhotoSwipeFromDOM(".image__list");
});
