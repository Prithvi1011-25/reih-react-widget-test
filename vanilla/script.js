(function () {
  "use strict";

  var WIDGET_SCRIPT_URL =
    "https://reimaginehome-embed-widget-app-git-dev-styldod.vercel.app/widget.js";
  /** Dev/test public key — literal value is the string "public_key" */
  var WIDGET_PUBLIC_KEY = "public_key";
  var WIDGET_SCRIPT_ID = "reih-widget-script";
  var REIH_LOADER_ID = "reih-host-loader";

  var LISTING_MEDIA = [
    {
      image_url:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=600&fit=crop",
    },
    {
      image_url:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
    },
    {
      image_url:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop",
    },
    {
      image_url:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop",
    },
    {
      image_url:
        "https://images.unsplash.com/photo-1721244653580-79577d2822a2?q=80&w=2096&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      image_url:
        "https://images.unsplash.com/photo-1619418602850-35ad20aa1700?q=80&w=1771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      image_url:
        "https://images.unsplash.com/photo-1721244654210-a505a99661e9?q=80&w=1704&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      image_url: "/images/apartment-building.png",
    },
    {
      image_url: "/images/large-test-25mb.jpg",
    },
    {
      image_url: "/images/large-test-30mb.jpg",
    },
    {
      image_url: "/images/invalid-format.txt",
    },
    {
      image_url:
        "https://images.unsplash.com/photo-1630699144919-681cf308ae82?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  var opening = false;

  function clearReihLoader() {
    var loader = document.getElementById(REIH_LOADER_ID);
    if (loader) {
      loader.remove();
    }
  }

  function resolveMediaUrl(url) {
    if (url.charAt(0) === "/") {
      return window.location.origin + url;
    }
    return url;
  }

  function resolveListingMedia(media) {
    var source = media || LISTING_MEDIA;
    return source.map(function (item) {
      return {
        image_url: resolveMediaUrl(item.image_url),
      };
    });
  }

  function buildWidgetLanguage() {
    return [
      { code: "en-US", name: "English (United States)", nativeName: "English (US)" },
      { code: "en-GB", name: "English (United Kingdom)", nativeName: "English (UK)" },
      { code: "pl-PL", name: "Polish", nativeName: "Polski" },
      { code: "es-ES", name: "Spanish", nativeName: "Español" },
    ];
  }

  function buildWidgetBranding() {
    return {
      logo: "https://ecdn.styldod.com/assets/logo/6a2bca9bce2a355c2c13d058.svg",
      text_primary: "#071121FF",
      text_secondary: "#1B232E",
      primary_color: "#3ED37A",
      heading: "Reimagine Your Space",
      sub_heading: "AI-powered room redesign",
      footer_text: "",
    };
  }

  function getWidgetHostCssVars() {
    var branding = buildWidgetBranding();
    return {
      "--reih-primary": branding.primary_color,
      "--reih-text-primary": branding.text_primary.replace(/ff$/i, ""),
      "--reih-text-secondary": branding.text_secondary,
    };
  }

  function applyHostCssVars() {
    var shell = document.getElementById("listing-shell");
    if (!shell) {
      return;
    }

    var vars = getWidgetHostCssVars();
    Object.keys(vars).forEach(function (key) {
      shell.style.setProperty(key, vars[key]);
    });
  }

  var widgetCallbacks = {
    onComplete: function (detail) {
      console.log("[reih] onComplete:", detail);
    },
    onError: function (err) {
      console.error("[reih] onError:", err);
    },
    onClose: function () {
      console.log("[reih] onClose: widget closed");
    },
  };

  function buildScriptEmbedWidgetConfig() {
    return Object.assign(
      {
        media: resolveListingMedia(),
        mode: "simple",
        branding: buildWidgetBranding(),
        sidebar_position: "right",
        language: buildWidgetLanguage(),
      },
      widgetCallbacks
    );
  }

  function waitForReihWidget(timeoutMs) {
    var timeout = timeoutMs || 30000;
    var existing = window.reihWidget;

    if (existing && typeof existing.open === "function") {
      return Promise.resolve(existing);
    }

    return new Promise(function (resolve, reject) {
      var script = document.querySelector('script[src*="widget.js"]');
      var settled = false;
      var poller;
      var timer;

      function finish(widget) {
        if (settled) {
          return;
        }
        settled = true;
        clearTimeout(timer);
        clearInterval(poller);
        if (script) {
          script.removeEventListener("load", tryResolve);
        }
        resolve(widget);
      }

      function tryResolve() {
        var widget = window.reihWidget;
        if (widget && typeof widget.open === "function") {
          finish(widget);
        }
      }

      if (script) {
        script.addEventListener("load", tryResolve);
      }

      poller = window.setInterval(tryResolve, 50);

      timer = window.setTimeout(function () {
        if (settled) {
          return;
        }
        settled = true;
        clearInterval(poller);
        if (script) {
          script.removeEventListener("load", tryResolve);
        }
        reject(new Error("[reih] Widget script did not load in time"));
      }, timeout);

      tryResolve();
    });
  }

  function openReihWithMedia(widget, media) {
    clearReihLoader();
    return widget.open({
      media: media.map(function (item) {
        return {
          image_url: resolveMediaUrl(item.image_url),
        };
      }),
      mode: "simple",
      branding: buildWidgetBranding(),
      sidebar_position: "right",
      language: buildWidgetLanguage(),
    });
  }

  function loadWidgetScript() {
    var existing = document.getElementById(WIDGET_SCRIPT_ID);

    if (existing) {
      if (window.reihWidget && typeof window.reihWidget.open === "function") {
        console.log("[script-embed] Widget script already loaded");
      }
      return;
    }

    var script = document.createElement("script");
    script.id = WIDGET_SCRIPT_ID;
    script.src = WIDGET_SCRIPT_URL + "?v=" + Date.now();
    script.async = true;
    script.setAttribute("data-public-key", WIDGET_PUBLIC_KEY);
    script.onload = function () {
      console.log("[script-embed] Widget script loaded");
    };
    script.onerror = function () {
      console.error("[script-embed] Widget script failed to load");
    };
    document.body.appendChild(script);
  }

  function openWidget(media) {
    if (opening) {
      return;
    }

    opening = true;

    waitForReihWidget()
      .then(function (widget) {
        return openReihWithMedia(widget, media);
      })
      .catch(function (error) {
        clearReihLoader();
        console.error("[script-embed] Widget open failed:", error);
      })
      .finally(function () {
        opening = false;
      });
  }

  function getGalleryAlt(media, index) {
    if (media.image_url.indexOf("apartment-building") !== -1) {
      return "Exterior view of a multi-story apartment building";
    }
    if (media.image_url.indexOf("large-test-25mb") !== -1) {
      return "Large test image (~25MB) for widget stress testing";
    }
    if (media.image_url.indexOf("large-test-30mb") !== -1) {
      return "Large test image (~35MB) for widget stress testing";
    }
    if (media.image_url.indexOf("invalid-format") !== -1) {
      return "Invalid format test (text file, not an image)";
    }
    return "Listing photo " + (index + 2);
  }

  function createMediaFrame(media, options) {
    var frame = document.createElement("div");
    frame.className = "media-frame";

    var img = document.createElement("img");
    img.src = media.image_url;
    img.alt = options.alt;
    if (options.imageClass) {
      img.className = options.imageClass;
    }

    var button = document.createElement("button");
    button.type = "button";
    button.className = "media-frame__fab";
    button.setAttribute("aria-label", "Reimagine " + options.label);
    button.textContent = "Reimagine";
    button.addEventListener("click", function () {
      if (typeof options.onOpen === "function") {
        options.onOpen(media);
        return;
      }
      console.log("[script-embed] Floating button clicked:", media.image_url);
      openWidget([media]);
    });

    frame.appendChild(img);
    frame.appendChild(button);

    return frame;
  }

  function renderListing() {
    var heroSection = document.getElementById("hero");
    var galleryGrid = document.getElementById("gallery-grid");
    var galleryHeading = document.getElementById("gallery-heading");

    if (!heroSection || !galleryGrid || LISTING_MEDIA.length === 0) {
      return;
    }

    var heroMedia = LISTING_MEDIA[0];
    var galleryMedia = LISTING_MEDIA.slice(1);

    heroSection.appendChild(
      createMediaFrame(heroMedia, {
        alt: "Modern home exterior with landscaped front yard",
        imageClass: "hero__image",
        label: "hero photo",
        onOpen: function () {
          console.log("[script-embed] Open button clicked (all listing media)");
          openWidget(resolveListingMedia());
        },
      })
    );

    if (galleryHeading) {
      galleryHeading.textContent =
        "Photo Gallery (" + LISTING_MEDIA.length + " photos)";
    }

    galleryMedia.forEach(function (media, index) {
      galleryGrid.appendChild(
        createMediaFrame(media, {
          alt: getGalleryAlt(media, index),
          label: "gallery photo " + (index + 1),
        })
      );
    });
  }

  function initWidgetConfig() {
    var config = buildScriptEmbedWidgetConfig();
    window.reihWidgetConfig = config;
    console.log("[script-embed] Widget config created", config.branding);
  }

  function handleOpenAllClick() {
    console.log("[script-embed] Open button clicked (all listing media)");
    openWidget(resolveListingMedia());
  }

  function handleHostButtonClick() {
    var status = document.getElementById("host-status");
    if (status) {
      status.textContent =
        "Host page button works — existing JavaScript is unaffected.";
    }
    console.log("Test Host Page Button clicked");
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyHostCssVars();
    renderListing();
    initWidgetConfig();
    loadWidgetScript();

    var openBtn = document.getElementById("open-btn");
    var hostBtn = document.getElementById("host-btn");

    if (openBtn) {
      openBtn.addEventListener("click", handleOpenAllClick);
    }

    if (hostBtn) {
      hostBtn.addEventListener("click", handleHostButtonClick);
    }

    window.addEventListener("beforeunload", clearReihLoader);
  });
})();
