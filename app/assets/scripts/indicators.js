// Generate a list of indicators
// Use for both category and indicator pages.
var Indicators = require('./collections/indicators-overview');
var AllIndicatorsView = require('./views/all-indicators');

module.exports = function generateIndicators () {
  
  var indicators = new Indicators();
  console.info(indicators);
  var indicatorView = new AllIndicatorsView({
    collection: indicators
  });
  
  indicators.fetch({
    success: function() {
      indicatorView.render('governance');
      indicatorView.render('freedom');
      indicatorView.render('privacy');
    }
  });

}