var _ = require('underscore');
var $ = require('jquery');

var BaseChart = require('./base-chart');
var ServiceCircleChart = require('./service-circle-chart');
var categories = require('../util/categories');
var template = require('../templates/company-overview.tpl');

module.exports = BaseChart.extend({
  
  initialize: function (options) {
    _.extend(this, options);
    //this.$el.append(this.template());
    //$('#' + options.container).append(this.$el);
  },

  // We want to render four circle graphs:
  // the overview, and each category graph.
  render: function () {

    //console.info(indexservice);
    this.collection.forEach(function (d, i) {
      var id = d.attributes.id;
      var total = d.attributes.total;
      var service = d.attributes.service;
      var company = d.attributes.company;
      var val = 100-total;

      var data = [
        {
          "id": "remainder",
          "name": "Remainder",
          "val": val,
        }, 
        {
          "id": id,
          "max": 100,
          "name": service,
          "val": total,
        }
      ];

      var label = {name: company, val: total};
      var chart = new ServiceCircleChart(_.extend({
        width: 135,
        height: 140,
        diameter: 135 * 0.95,
        data: data,
        label: label
      }));
      chart.render('#circle--chart--' + id);
    });
  }

});
