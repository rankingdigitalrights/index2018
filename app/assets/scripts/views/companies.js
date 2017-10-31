var _ = require('underscore');
var $ = require('jquery');
var Tooltip = require('tether-tooltip');
var HorizontalRow = require('./horizontal-row');
var template = require('../templates/companies.tpl');

var BaseChart = require('./base-chart');

module.exports = BaseChart.extend({
  tagName: 'div',
  template: template,

  events: {
    'click .sort': 'sort',
    'mouseover .vis--horiz_bar_container': 'openTooltip',
    'mouseout .vis--horiz_bar_container': 'closeTooltip'
  },

  initialize: function (options) {
    _.extend(this, options);
    var type = this.telco ? 'Telecommunications' : 'Internet';
    this.$el.html(this.template({ type }));
    $(this.parent).append(this.$el);
  },

  openTooltip: function (e) {
    var $target = $(e.currentTarget).find('.vis--horiz_bar');
    this.tip = new Tooltip({
      target: $target[0],
      content: $target.data('company') + '<br />' + $target.data('category') + ': ' + $target.data('value') + '%'
    });
    this.tip.open();
  },

  closeTooltip: function (e) {
    this.tip.close();
    this.tip.destroy();
  },

  category: 'total',
  direction: -1, // 1 ascending

  render: function () {
    let {
      category,
      direction,
      childViews,
      telco
    } = this;

    var $bars = $('<div />');

    if (!childViews.length) {
      childViews = _.chain(this.collection.models)
        .filter(m => m.get('telco') === telco)
        .map(m => new HorizontalRow({ model: m }))
        .value();
      this.childViews = childViews;
    }

    var No = 1;
    _.sortBy(childViews, view => direction * view.model.get(category))
      .forEach(function (view) {
        $bars.append(view.render(No++));
      });

    var $container = this.$('.js--bars');
    $container.fadeOut(100, function () {
      $container.html($bars);
      $container.fadeIn(100);
    });
  }
});
