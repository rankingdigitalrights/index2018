var _ = require('underscore');
var $ = require('jquery');

var BaseChart = require('./base-chart');
var CircleChart = require('./circle-chart');
var categories = require('../util/categories');
var template = require('../templates/company-overview.tpl');

module.exports = BaseChart.extend({
  template: template,
  tagName: 'div',
  className: 'circle--charts_container',

  initialize: function (options) {
    _.extend(this, options);
    this.$el.append(this.template());
    $('#' + options.container).append(this.$el);
  },

  // We want to render four circle graphs:
  // the overview, and each category graph.
  render: function () {
    var model = this.collection.findWhere({id: this.companyName});
    if (!model) {
      console.log(this.companyName, ' was not found in overview.json');
      return this.$el;
    }

    // Don't need the total value here
    let subCategories = categories.slice(1);

    // TODO assumes each score is out of 100.
    var max = 100;

    var overviewData = subCategories.map(function (cat) {
      return {
        name: cat.display,
        val: +model.get(cat.id),
        max: max,
        id: cat.id
      };
    });

    var categoryData = _.map(overviewData, function (d) {
      return [{
        val: d.max - d.val,
        id: 'remainder',
        name: 'Remainder'
      }, d];
    });

    overviewData.unshift({
      id: 'remainder',
      name: 'Remainder',
      val: overviewData.map(d => d.max - d.val).reduce((a, b) => a + b)
    });

    var $el = this.$el;
    categoryData.forEach(function (d, i) {
      var $parent = $el.find('#circle--' + subCategories[i].id);
      var width = $parent.width();
      // constrain width on large screens
      if (width > 250) {
        width = 250;
      }

      var label = {name: subCategories[i].display, val: model.get(subCategories[i].id)};
      
      var chart = new CircleChart(_.extend({
        width: width,
        height: width,
        diameter: width * 0.95,
        data: d,
        label: label
      }));
      chart.render($parent[0]);
    });
  }
});
