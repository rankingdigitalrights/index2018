var $ = require('jquery');
var _ = require('underscore');
var resize = require('../util/resize');
var IndicatorView = require('./indicator');
var BaseChart = require('./base-chart');

module.exports = BaseChart.extend({
  tagName: 'div',
  initialize: function (options) {
    _.extend(this, options);
    resize.attach(this.id, this.$el);
    this.listenTo(resize, 'resize:' + this.id, this.handleResize);
  },
  render: function (id) {
    var childViews = this.childViews;
    var $el = this.$el;
    var $parent = $('#' + id);
    var width = $parent.width();
    this.collection.each(function (model) {
      var id = model.attributes.indicator;
      var view = new IndicatorView({
        id: id,
        model: model,
        width: width,
        indicator_id: id
      });
      childViews.push(view);
      $el.append(view.render());
    });
    $parent.append($el);
  },

  handleResize: function (dimensions) {
    this.childViews.forEach(function (view) {
      if (view.handleResize) {
        view.handleResize(dimensions);
      }
    });
  }
});
