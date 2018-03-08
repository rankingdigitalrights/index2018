var _ = require('underscore');
var $ = require('jquery');
var HorizontalBarChart = require('./horizontal-bar-chart');
var BaseChart = require('./base-chart');
var template = require('../templates/horizontal-row.tpl');

var baseurl = require('../util/base-url');
// var categories = require('../util/categories');

module.exports = BaseChart.extend({
  template: template,
  render: function (No) {
    var model = this.model;

    if (this.childViews && this.childViews.length) {
      _.each(this.childViews, function (view) {
        view.remove();
      });
    }

    var categories = [{ id: 'total', display: 'Total' }];

    var childViews = _.map(categories, function (cat, idx) {
      return new HorizontalBarChart({
        value: model.get(cat.id),
        company: model.get('display'),
        category: cat.id,
        display: cat.display,
        count: idx
      });
    });
    this.childViews = childViews;

    var barContent = _.chain(childViews)
      .map(view => view.render().$el.html())
      .reduce((a, b) => a + b)
      .value();

    // if (model.get('id') === 'vodafone') { No--; }
    // if (model.get('id') === 'mailru') { No--; }

    this.$el = $(this.template({
      href: model.get('id'),
      id: 'vis-bar-' + model.get('name'),
      name: model.get('display'),
      score: No,
      barContent,
      baseurl
    }));

    return this.$el;
  }
});
