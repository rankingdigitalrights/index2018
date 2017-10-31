var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');

// TODO only do this if window is focused, blurred.
var elements = {};
module.exports = _.extend({}, Backbone.Events, {

  // make sure the element is a jquery selection
  get$: function (el) {
    if (el instanceof $) {
      return el;
    }
    return $(el);
  },

  // push a jquery element into elements dict
  attach: function (key, el) {
    elements[key] = this.get$(el);
  },

  detach: function (key) {
    if (elements[key]) {
      delete elements[key];
    }
  },

  notify: function (el, key) {
    var width = el.width();
    var height = el.height();
    this.trigger('resize:' + key, {width, height});
  },

  start: function () {
    var self = this;
    $(window).resize(_.throttle(function () {
      _.each(elements, (el, key) => self.notify(el, key));
    }, 1000, {leading: false}));
  }
});
