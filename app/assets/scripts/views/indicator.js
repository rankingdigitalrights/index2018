var $ = require('jquery');
var _ = require('underscore');

var Backbone = require('backbone');
var Barchart = require('./barchart');
var baseurl = require('../util/base-url');
var barsort = require('../util/barsort');
var template = require('../templates/indicator.tpl');

module.exports = Backbone.View.extend({

  initialize: function (options) {
    this.collection = options.collection;
    this.p_name = options.p_name;
  },

  render: function () {

    var $companies = this.collection.companies;
    var $name = this.collection.indicatorName;
    var $scores = this.collection.scores;
    var $p_name = this.p_name;

    var $class_name = '';
    if( $p_name.charAt(0) == 'g' ) {
      $class_name = 'table-governance';
    }

    $companies.forEach(function(item){
      var $company_name = item.name;
      var $score = isNaN($scores[$company_name]) ? 'N/A' : Math.round($scores[$company_name])+'%';
      
      $("#indicator--companies").append(
          template({score:$score, name:$name, item:item, p_name:$class_name})
      );

    });
  }
});
