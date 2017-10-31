var $ = require('jquery');
var _ = require('underscore');

var BaseChart = require('../base-chart');
var LineDotChart = require('./line-dot-chart');

var categories = require('../../util/categories');

module.exports = BaseChart.extend({
  
  initialize: function (options) {
    this.data = options.data;
  },

  render: function () {
    var d = this.data;

    this.data.forEach(function (data){
      var view = new LineDotChart({
        values: d,
        active: data.rank,
        isTelco: true,
        category: data.service
      });

      $('#' + data.service.slice(0,2) + data.rank + '-dot-chart').append(view.render());
    });
  }
});
