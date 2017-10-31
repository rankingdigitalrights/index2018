var _ = require('underscore');
var Backbone = require('backbone');
var template = require('../templates/horizontal-bar-chart.tpl');

module.exports = Backbone.View.extend({
  template: template,
  initialize: function (options) {
    _.extend(this, options);
  },
  render: function () {
    this.$el.html(this.template({
      value: Math.round(this.value),
      pct: this.value + '%',
      category: this.category,
      display: this.display,
      company: this.company,
      count: this.count
    }));
    return this;
  }
});
