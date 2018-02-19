// Generate a list of indicators
var Indicators = require('./collections/indicators-overview');
var IndicatorsView = require('./views/indicators');

module.exports = function generateIndicators () {
  
  var indicators = new Indicators();
  var indicatorsView = new IndicatorsView({
    collection: indicators
  });
  
  indicators.fetch({
    success: function() {
      indicatorsView.render('governance');
      indicatorsView.render('freedom');
      indicatorsView.render('privacy');
    }
  });

}