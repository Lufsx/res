var LazyLoad = (function () {
  "use strict";
  function t() {
    return (t =
      Object.assign ||
      function (t) {
        for (var n = 1; n < arguments.length; n++) {
          var e = arguments[n];
          for (var i in e)
            Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
        }
        return t;
      }).apply(this, arguments);
  }
  var n = "undefined" != typeof window,
    e =
      (n && !("onscroll" in window)) ||
      ("undefined" != typeof navigator &&
        /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent)),
    i = n && "IntersectionObserver" in window,
    a = n && "classList" in document.createElement("p"),
    o = n && window.devicePixelRatio > 1,
    r = {
      elements_selector: "img",
      container: e || n ? document : null,
      threshold: 300,
      thresholds: null,
      data_src: "src",
      data_srcset: "srcset",
      data_sizes: "sizes",
      data_bg: "bg",
      data_bg_hidpi: "bg-hidpi",
      data_bg_multi: "bg-multi",
      data_bg_multi_hidpi: "bg-multi-hidpi",
      data_poster: "poster",
      class_applied: "applied",
      class_loading: "loading",
      class_loaded: "loaded",
      class_error: "error",
      unobserve_completed: !0,
      unobserve_entered: !1,
      cancel_on_exit: !1,
      callback_enter: null,
      callback_exit: null,
      callback_applied: null,
      callback_loading: null,
      callback_loaded: null,
      callback_error: null,
      callback_finish: null,
      callback_cancel: null,
      use_native: !1,
    },
    c = function (n) {
      return t({}, r, n);
    },
    l = function (t, n) {
      var e,
        i = new t(n);
      try {
        e = new CustomEvent("LazyLoad::Initialized", {
          detail: { instance: i },
        });
      } catch (t) {
        (e = document.createEvent(
          "CustomEvent"
        )).initCustomEvent("LazyLoad::Initialized", !1, !1, { instance: i });
      }
      window.dispatchEvent(e);
    },
    s = function (t, n) {
      return t.getAttribute("data-" + n);
    },
    u = function (t) {
      return s(t, "ll-status");
    },
    d = function (t, n) {
      return (function (t, n, e) {
        var i = "data-" + n;
        null !== e ? t.setAttribute(i, e) : t.removeAttribute(i);
      })(t, "ll-status", n);
    },
    f = function (t) {
      return d(t, null);
    },
    _ = function (t) {
      return null === u(t);
    },
    g = ["loading", "applied", "loaded", "error"],
    v = function (t, n, e, i) {
      t && (void 0 === i ? (void 0 === e ? t(n) : t(n, e)) : t(n, e, i));
    },
    b = function (t, n) {
      a ? t.classList.add(n) : (t.className += (t.className ? " " : "") + n);
    },
    p = function (t, n) {
      a
        ? t.classList.remove(n)
        : (t.className = t.className
            .replace(new RegExp("(^|\\s+)" + n + "(\\s+|$)"), " ")
            .replace(/^\s+/, "")
            .replace(/\s+$/, ""));
    },
    h = function (t) {
      return t.llTempImage;
    },
    m = function (t, n) {
      if (n) {
        var e = n._observer;
        e && e.unobserve(t);
      }
    },
    E = function (t, n) {
      t && (t.loadingCount += n);
    },
    L = function (t, n) {
      t && (t.toLoadCount = n);
    },
    I = function (t) {
      for (var n, e = [], i = 0; (n = t.children[i]); i += 1)
        "SOURCE" === n.tagName && e.push(n);
      return e;
    },
    A = function (t, n, e) {
      e && t.setAttribute(n, e);
    },
    w = function (t, n) {
      t.removeAttribute(n);
    },
    k = function (t) {
      return !!t.llOriginalAttrs;
    },
    y = function (t) {
      if (!k(t)) {
        var n = {};
        (n.src = t.getAttribute("src")),
          (n.srcset = t.getAttribute("srcset")),
          (n.sizes = t.getAttribute("sizes")),
          (t.llOriginalAttrs = n);
      }
    },
    z = function (t) {
      if (k(t)) {
        var n = t.llOriginalAttrs;
        A(t, "src", n.src), A(t, "srcset", n.srcset), A(t, "sizes", n.sizes);
      }
    },
    O = function (t, n) {
      A(t, "sizes", s(t, n.data_sizes)),
        A(t, "srcset", s(t, n.data_srcset)),
        A(t, "src", s(t, n.data_src));
    },
    C = function (t) {
      w(t, "src"), w(t, "srcset"), w(t, "sizes");
    },
    N = function (t, n) {
      var e = t.parentNode;
      e && "PICTURE" === e.tagName && I(e).forEach(n);
    },
    x = {
      IMG: function (t, n) {
        N(t, function (t) {
          y(t), O(t, n);
        }),
          y(t),
          O(t, n);
      },
      IFRAME: function (t, n) {
        A(t, "src", s(t, n.data_src));
      },
      VIDEO: function (t, n) {
        I(t).forEach(function (t) {
          A(t, "src", s(t, n.data_src));
        }),
          A(t, "poster", s(t, n.data_poster)),
          A(t, "src", s(t, n.data_src)),
          t.load();
      },
    },
    M = function (t, n, e) {
      var i = x[t.tagName];
      i &&
        (i(t, n),
        E(e, 1),
        b(t, n.class_loading),
        d(t, "loading"),
        v(n.callback_loading, t, e));
    },
    R = ["IMG", "IFRAME", "VIDEO"],
    T = function (t, n) {
      !n ||
        (function (t) {
          return t.loadingCount > 0;
        })(n) ||
        (function (t) {
          return t.toLoadCount > 0;
        })(n) ||
        v(t.callback_finish, n);
    },
    G = function (t, n, e) {
      t.addEventListener(n, e), (t.llEvLisnrs[n] = e);
    },
    D = function (t, n, e) {
      t.removeEventListener(n, e);
    },
    F = function (t) {
      return !!t.llEvLisnrs;
    },
    P = function (t) {
      if (F(t)) {
        var n = t.llEvLisnrs;
        for (var e in n) {
          var i = n[e];
          D(t, e, i);
        }
        delete t.llEvLisnrs;
      }
    },
    S = function (t, n, e) {
      !(function (t) {
        delete t.llTempImage;
      })(t),
        E(e, -1),
        (function (t) {
          t && (t.toLoadCount -= 1);
        })(e),
        p(t, n.class_loading),
        n.unobserve_completed && m(t, e);
    },
    V = function (t, n, e) {
      var i = h(t) || t;
      if (!F(i)) {
        !(function (t, n, e) {
          F(t) || (t.llEvLisnrs = {}),
            G(t, "load", n),
            G(t, "error", e),
            "VIDEO" === t.tagName && G(t, "loadeddata", n);
        })(
          i,
          function (a) {
            !(function (t, n, e, i) {
              S(n, e, i),
                b(n, e.class_loaded),
                d(n, "loaded"),
                v(e.callback_loaded, n, i),
                T(e, i);
            })(0, t, n, e),
              P(i);
          },
          function (a) {
            !(function (t, n, e, i) {
              S(n, e, i),
                b(n, e.class_error),
                d(n, "error"),
                v(e.callback_error, n, i),
                T(e, i);
            })(0, t, n, e),
              P(i);
          }
        );
      }
    },
    j = function (t, n, e) {
      !(function (t) {
        t.llTempImage = document.createElement("img");
      })(t),
        V(t, n, e),
        (function (t, n, e) {
          var i = s(t, n.data_bg),
            a = s(t, n.data_bg_hidpi),
            r = o && a ? a : i;
          r &&
            ((t.style.backgroundImage = "".concat(r, "")),
            h(t).setAttribute("src", r),
            E(e, 1),
            b(t, n.class_loading),
            d(t, "loading"),
            v(n.callback_loading, t, e));
        })(t, n, e),
        (function (t, n, e) {
          var i = s(t, n.data_bg_multi),
            a = s(t, n.data_bg_multi_hidpi),
            r = o && a ? a : i;
          r &&
            ((t.style.backgroundImage = r),
            b(t, n.class_applied),
            d(t, "applied"),
            v(n.callback_applied, t, e),
            n.unobserve_completed && m(t, n));
        })(t, n, e);
    },
    U = function (t, n, e) {
      !(function (t) {
        return R.indexOf(t.tagName) > -1;
      })(t)
        ? j(t, n, e)
        : (function (t, n, e) {
            V(t, n, e), M(t, n, e);
          })(t, n, e),
        T(n, e);
    },
    $ = function (t, n, e, i) {
      "IMG" === t.tagName &&
        (P(t),
        (function (t) {
          N(t, function (t) {
            C(t);
          }),
            C(t);
        })(t),
        (function (t) {
          N(t, function (t) {
            z(t);
          }),
            z(t);
        })(t),
        p(t, e.class_loading),
        E(i, -1),
        v(e.callback_cancel, t, n, i),
        setTimeout(function () {
          f(t);
        }, 0));
    },
    q = function (t, n, e, i) {
      v(e.callback_enter, t, n, i),
        (function (t) {
          return g.indexOf(u(t)) > -1;
        })(t) || (e.unobserve_entered && m(t, i), U(t, e, i));
    },
    H = function (t, n, e, i) {
      _(t) ||
        (e.cancel_on_exit &&
          (function (t) {
            return "loading" === u(t);
          })(t) &&
          $(t, n, e, i),
        v(e.callback_exit, t, n, i));
    },
    B = ["IMG", "IFRAME"],
    J = function (t) {
      return t.use_native && "loading" in HTMLImageElement.prototype;
    },
    K = function (t, n, e) {
      t.forEach(function (t) {
        -1 !== B.indexOf(t.tagName) &&
          (t.setAttribute("loading", "lazy"),
          (function (t, n, e) {
            V(t, n, e), M(t, n, e), d(t, "native"), T(n, e);
          })(t, n, e));
      }),
        L(e, 0);
    },
    Q = function (t, n) {
      i &&
        !J(t) &&
        (n._observer = new IntersectionObserver(
          function (e) {
            !(function (t, n, e) {
              t.forEach(function (t) {
                return (function (t) {
                  return t.isIntersecting || t.intersectionRatio > 0;
                })(t)
                  ? q(t.target, t, n, e)
                  : H(t.target, t, n, e);
              });
            })(e, t, n);
          },
          (function (t) {
            return {
              root: t.container === document ? null : t.container,
              rootMargin: t.thresholds || t.threshold + "px",
            };
          })(t)
        ));
    },
    W = function (t) {
      return Array.prototype.slice.call(t);
    },
    X = function (t) {
      return t.container.querySelectorAll(t.elements_selector);
    },
    Y = function (t) {
      return (function (t) {
        return "error" === u(t);
      })(t);
    },
    Z = function (t, n) {
      return (function (t) {
        return W(t).filter(_);
      })(t || X(n));
    },
    tt = function (t, n) {
      var e;
      ((e = X(t)), W(e).filter(Y)).forEach(function (n) {
        p(n, t.class_error), f(n);
      }),
        n.update();
    },
    nt = function (t, e) {
      var i = c(t);
      (this._settings = i),
        (this.loadingCount = 0),
        Q(i, this),
        (function (t, e) {
          n &&
            window.addEventListener("online", function () {
              tt(t, e);
            });
        })(i, this),
        this.update(e);
    };
  return (
    (nt.prototype = {
      update: function (t) {
        var n,
          a,
          o = this._settings,
          r = Z(t, o);
        (L(this, r.length), !e && i)
          ? J(o)
            ? K(r, o, this)
            : ((n = this._observer),
              (a = r),
              (function (t) {
                t.disconnect();
              })(n),
              (function (t, n) {
                n.forEach(function (n) {
                  t.observe(n);
                });
              })(n, a))
          : this.loadAll(r);
      },
      destroy: function () {
        this._observer && this._observer.disconnect(),
          delete this._observer,
          delete this._settings,
          delete this.loadingCount,
          delete this.toLoadCount;
      },
      loadAll: function (t) {
        var n = this,
          e = this._settings;
        Z(t, e).forEach(function (t) {
          U(t, e, n);
        });
      },
    }),
    (nt.load = function (t, n) {
      var e = c(n);
      U(t, e);
    }),
    (nt.resetStatus = function (t) {
      f(t);
    }),
    n &&
      (function (t, n) {
        if (n)
          if (n.length) for (var e, i = 0; (e = n[i]); i += 1) l(t, e);
          else l(t, n);
      })(nt, window.lazyLoadOptions),
    nt
  );
})();
