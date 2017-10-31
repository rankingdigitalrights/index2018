var $ = require('jquery');
var _ = require('underscore');
var BaseChart = require('../base-chart');
var template = require('../../templates/service-line-dot-chart.tpl');
var categoryClasses = require('../../util/category-classes');

module.exports = BaseChart.extend({
  className: 'dotchart',
  tagName: 'div',
  template: template,
  events: {
    'mouseover .dot': 'showTooltip',
    'mouseout .dot': 'hideTooltip'
  },

  initialize: function (options) {

    // console.info(options);

    var active = options.active;

    // Find the highlighted value to label.
    var highlighted = _.find(options.values, d => d.rank === active);
    highlighted.t = Math.round(highlighted.t);

    // Round the values and aggregate by equal values.
    // Sort so the highlighted dot is drawn last, on top.
    var values = _.chain(options.values)
      .each(d => d.t = Math.round(d.t))
      .groupBy(d => d.t)
      .values()
      .sortBy(d => _.pluck(d, 'rank').indexOf(active) === -1 ? 0 : 1)
      .value();

    // Add the highlight class to the last item
    _.each(values, d => d[0].className = '');
    values[values.length - 1][0].className = 'highlight';

    this.$el.html(this.template({
      category: options.category,
      dots: values,
      highlight: highlighted,
      className: categoryClasses[options.category.charAt(0).toLowerCase()]
    }));

    this.values = values;
    this.$tooltip = this.$('.dotchart--tooltip');
  },

  showTooltip: function (e) {
    var $target = $(e.currentTarget);

    var targetData;
    if ($target.hasClass('highlight')) {
      // If it's highlighted, we know it's the last item.
      targetData = this.values[this.values.length - 1];
    } else {
      // Otherwise find it using it's value.
      var val = $target.data('val');
      targetData = _.find(this.values, d => d[0].t === val);
    }
    var html = targetData.map(d => '<span class="rank">' + d.rank + '</span>')
        .join(', ') + ' ' + targetData[0].company + ' '
         + '<span class="percent">' + targetData[0].t + '% </span>';
    this.$tooltip.html(html)
      .css('left', $target.position().left + 'px')
      .addClass('active');
  },

  hideTooltip: function (e) {
    this.$tooltip.removeClass('active');
  },

  render: function () {
    return this.$el;
  }

});
