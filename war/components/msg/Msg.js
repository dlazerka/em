/** Message at the top. */
var Msg = {
  $el: $('#msg'),

  /** Shows orange message. */
  info: function(text, opt_hideAfterMs) {
    this.$el.removeClass('error');
    this.show_(text, opt_hideAfterMs);
  },

  /** Shows red message. */
  error: function(text, opt_hideAfterMs) {
    this.$el.addClass('error');
    this.show_(text, opt_hideAfterMs);
  },

  show_: function(text, opt_hideAfterMs) {
    this.$el.text(text);
    var w = this.$el.width();
    var ww = $(window).width();
    this.$el.css('left', ww / 2 - w / 2);
    this.$el.show();

    if (opt_hideAfterMs) {
      this.$el.delay(opt_hideAfterMs).slideUp(400);
    }
  }
};
