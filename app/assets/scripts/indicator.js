var $ = require('jquery');
var _ = require('underscore');

var Indicators = require('./collections/indicators-overview');
var IndicatorView = require('./views/indicator');

module.exports = function generateIndicator (indicator) {

  var indicators = new Indicators();
  var indicatorView = new IndicatorView({
    collection: indicators,
    indicator: indicator
  });

  indicators.fetch({
      success: function () {
          indicatorView.render();
      }
  });

}
