var _ = require('underscore');
var $ = require('jquery');

var Company = require('./service-company');
var BaseChart = require('../base-chart');

module.exports = BaseChart.extend({

  initialize: function (options) {
    _.extend(this, options);
  },

  render: function () {

    var childViews = _.chain(this.data)
      .map(m => new Company({model: m}))
      .value();

    var parent = this.parent;
    var data = this.data;

    childViews.forEach(function (view){
        parent.append(view.render(data));
    });

  }
});
