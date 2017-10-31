var Backbone = require('backbone');

module.exports = Backbone.View.extend({

  events: {
    'click': 'toggleExpand'
  },

  initialize: function (options) {
    if (options.$triggerTarget) {
      options.$triggerTarget.addClass('js--collapse_trigger');
    }
    this.$body = options.$body;
  },

  toggleExpand: function () {
    var $body = this.$body;
    if (this.$el.hasClass('expanded')) {
      $body.fadeOut(200, function () {
        $body.hide();
      });
    } else {
      $body.fadeIn(200);
    }
    this.$el.toggleClass('expanded');
    return false;
  }

});
