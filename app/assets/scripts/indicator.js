var $ = require('jquery');
var _ = require('underscore');

var Indicators = require('./collections/indicators-overview');
var Barchart = require('./views/barchart');
var barsort = require('./util/barsort');

module.exports = function generateIndicator (indicatorName) {

  var indicators = new Indicators();

  indicators.fetch({
      success: function () {
          overviewSuccess();
      }
  });


      var $parent = $('#indicator--overview_chart');
      var overviewSuccess = function () {
          var comp = indicators.findWhere({indicator: indicatorName});
          var $scores = comp.attributes.scores;

          var $data = [];
          $.each( $scores, function( key, value ) {
              $data.push({name:key,val:value});
          });

          $data.sort(barsort);

          var barchart = new Barchart({
              width: $('#indicator--overview_chart').width(),
              height: 340,
              data: $data,
          });

          barchart.render('#indicator--overview_chart');

      }



}
