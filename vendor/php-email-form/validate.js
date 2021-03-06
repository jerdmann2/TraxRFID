+ function (a) {
  

  function b(b) {
    return b.is('[type="checkbox"]') ? b.prop("checked") : b.is('[type="radio"]') ? !!a('[name="' + b.attr("name") + '"]:checked').length : a.trim(b.val())
  }

  function c(b) {
    return this.each(function () {
      var c = a(this),
        e = a.extend({}, d.DEFAULTS, c.data(), "object" == typeof b && b),
        f = c.data("bs.validator");
      (f || "destroy" != b) && (f || c.data("bs.validator", f = new d(this, e)), "string" == typeof b && f[b]())
    })
  }
  var d = function (c, e) {
    this.options = e, this.$element = a(c), this.$inputs = this.$element.find(d.INPUT_SELECTOR), this.$btn = a('button[type="submit"], input[type="submit"]').filter('[form="' + this.$element.attr("id") + '"]').add(this.$element.find('input[type="submit"], button[type="submit"]')), e.errors = a.extend({}, d.DEFAULTS.errors, e.errors);
    for (var f in e.custom)
      if (!e.errors[f]) throw new Error("Missing default error message for custom validator: " + f);
    a.extend(d.VALIDATORS, e.custom), this.$element.attr("novalidate", !0), this.toggleSubmit(), this.$element.on("input.bs.validator change.bs.validator focusout.bs.validator", d.INPUT_SELECTOR, a.proxy(this.onInput, this)), this.$element.on("submit.bs.validator", a.proxy(this.onSubmit, this)), this.$element.find("[data-match]").each(function () {
      var c = a(this),
        d = c.data("match");
      a(d).on("input.bs.validator", function () {
        b(c) && c.trigger("input.bs.validator")
      })
    })
  };
  d.INPUT_SELECTOR = ':input:not([type="submit"], button):enabled:visible', d.FOCUS_OFFSET = 20, d.DEFAULTS = {
    delay: 500,
    html: !1,
    disable: !0,
    focus: !0,
    custom: {},
    errors: {
      match: "Does not match",
      minlength: "Not long enough"
    },
    feedback: {
      success: "glyphicon-ok",
      error: "glyphicon-remove"
    }
  }, d.VALIDATORS = {
    "native": function (a) {
      var b = a[0];
      return b.checkValidity ? b.checkValidity() : !0
    },
    match: function (b) {
      var c = b.data("match");
      return !b.val() || b.val() === a(c).val()
    },
    minlength: function (a) {
      var b = a.data("minlength");
      return !a.val() || a.val().length >= b
    }
  }, d.prototype.onInput = function (b) {
    var c = this,
      d = a(b.target),
      e = "focusout" !== b.type;
    this.validateInput(d, e).done(function () {
      c.toggleSubmit()
    })
  }, d.prototype.validateInput = function (c, d) {
    var e = b(c),
      f = c.data("bs.validator.previous"),
      g = c.data("bs.validator.errors");
    if (f === e) return a.Deferred().resolve();
    c.data("bs.validator.previous", e), c.is('[type="radio"]') && (c = this.$element.find('input[name="' + c.attr("name") + '"]'));
    var h = a.Event("validate.bs.validator", {
      relatedTarget: c[0]
    });
    if (this.$element.trigger(h), !h.isDefaultPrevented()) {
      var i = this;
      return this.runValidators(c).done(function (b) {
        c.data("bs.validator.errors", b), b.length ? d ? i.defer(c, i.showErrors) : i.showErrors(c) : i.clearErrors(c), g && b.toString() === g.toString() || (h = b.length ? a.Event("invalid.bs.validator", {
          relatedTarget: c[0],
          detail: b
        }) : a.Event("valid.bs.validator", {
          relatedTarget: c[0],
          detail: g
        }), i.$element.trigger(h)), i.toggleSubmit(), i.$element.trigger(a.Event("validated.bs.validator", {
          relatedTarget: c[0]
        }))
      })
    }
  }, d.prototype.runValidators = function (c) {
    function e(a) {
      return c.data(a + "-error") || c.data("error") || "native" == a && c[0].validationMessage || h.errors[a]
    }
    var f = [],
      g = a.Deferred(),
      h = this.options;
    return c.data("bs.validator.deferred") && c.data("bs.validator.deferred").reject(), c.data("bs.validator.deferred", g), a.each(d.VALIDATORS, a.proxy(function (a, d) {
      if ((b(c) || c.attr("required")) && (c.data(a) || "native" == a) && !d.call(this, c)) {
        var g = e(a);
        !~f.indexOf(g) && f.push(g)
      }
    }, this)), !f.length && b(c) && c.data("remote") ? this.defer(c, function () {
      var d = {};
      d[c.attr("name")] = b(c), a.get(c.data("remote"), d).fail(function (a, b, c) {
        f.push(e("remote") || c)
      }).always(function () {
        g.resolve(f)
      })
    }) : g.resolve(f), g.promise()
  }, d.prototype.validate = function () {
    var b = this;
    return a.when(this.$inputs.map(function () {
      return b.validateInput(a(this), !1)
    })).then(function () {
      b.toggleSubmit(), b.focusError()
    }), this
  }, d.prototype.focusError = function () {
    if (this.options.focus) {
      var b = a(".has-error:first :input");
      0 !== b.length && (a(document.body).animate({
        scrollTop: b.offset().top - d.FOCUS_OFFSET
      }, 250), b.focus())
    }
  }, d.prototype.showErrors = function (b) {
    var c = this.options.html ? "html" : "text",
      d = b.data("bs.validator.errors"),
      e = b.closest(".form-group"),
      f = e.find(".help-block.with-errors"),
      g = e.find(".form-control-feedback");
    d.length && (d = a("<ul/>").addClass("list-unstyled").append(a.map(d, function (b) {
      return a("<li/>")[c](b)
    })), void 0 === f.data("bs.validator.originalContent") && f.data("bs.validator.originalContent", f.html()), f.empty().append(d), e.addClass("has-error has-danger"), e.hasClass("has-feedback") && g.removeClass(this.options.feedback.success) && g.addClass(this.options.feedback.error) && e.removeClass("has-success"))
  }, d.prototype.clearErrors = function (a) {
    var c = a.closest(".form-group"),
      d = c.find(".help-block.with-errors"),
      e = c.find(".form-control-feedback");
    d.html(d.data("bs.validator.originalContent")), c.removeClass("has-error has-danger"), c.hasClass("has-feedback") && e.removeClass(this.options.feedback.error) && b(a) && e.addClass(this.options.feedback.success) && c.addClass("has-success")
  }, d.prototype.hasErrors = function () {
    function b() {
      return !!(a(this).data("bs.validator.errors") || []).length
    }
    return !!this.$inputs.filter(b).length
  }, d.prototype.isIncomplete = function () {
    function c() {
      return !b(a(this))
    }
    return !!this.$inputs.filter("[required]").filter(c).length
  }, d.prototype.onSubmit = function (a) {
    this.validate(), (this.isIncomplete() || this.hasErrors()) && a.preventDefault()
  }, d.prototype.toggleSubmit = function () {
    this.options.disable && this.$btn.toggleClass("disabled", this.isIncomplete() || this.hasErrors())
  }, d.prototype.defer = function (b, c) {
    return c = a.proxy(c, this, b), this.options.delay ? (window.clearTimeout(b.data("bs.validator.timeout")), void b.data("bs.validator.timeout", window.setTimeout(c, this.options.delay))) : c()
  }, d.prototype.destroy = function () {
    return this.$element.removeAttr("novalidate").removeData("bs.validator").off(".bs.validator").find(".form-control-feedback").removeClass([this.options.feedback.error, this.options.feedback.success].join(" ")), this.$inputs.off(".bs.validator").removeData(["bs.validator.errors", "bs.validator.deferred", "bs.validator.previous"]).each(function () {
      var b = a(this),
        c = b.data("bs.validator.timeout");
      window.clearTimeout(c) && b.removeData("bs.validator.timeout")
    }), this.$element.find(".help-block.with-errors").each(function () {
      var b = a(this),
        c = b.data("bs.validator.originalContent");
      b.removeData("bs.validator.originalContent").html(c)
    }), this.$element.find('input[type="submit"], button[type="submit"]').removeClass("disabled"), this.$element.find(".has-error, .has-danger").removeClass("has-error has-danger"), this
  };
  var e = a.fn.validator;
  a.fn.validator = c, a.fn.validator.Constructor = d, a.fn.validator.noConflict = function () {
    return a.fn.validator = e, this
  }, a(window).on("load", function () {
    a('form[data-toggle="validator"]').each(function () {
      var b = a(this);
      c.call(b, b.data())
    })
  })
}(jQuery);