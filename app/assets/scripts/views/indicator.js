var $ = require('jquery');
var _ = require('underscore');

var Backbone = require('backbone');
var Barchart = require('./barchart');
var baseurl = require('../util/base-url');
var barsort = require('../util/barsort');

module.exports = Backbone.View.extend({

  initialize: function (options) {
    this.collection = options.collection;
    this.indicator = options.indicator;
  },

  render: function () {

    var indicator = this.indicator;
    var indicators = this.collection;
    var comp = indicators.findWhere({indicator: indicator});
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

});
