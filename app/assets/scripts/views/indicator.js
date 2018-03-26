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
  },

  render: function () {

    var $companies = this.collection.companies;
    var $name = this.collection.indicatorName;
    var $scores = this.collection.scores;

    $companies.forEach(function(item){
      var $company_name = item.name;

      alert($company_name);

      if($company_name == 'Oath') $company_name = 'Yahoo';
      var $score = isNaN($scores[$company_name]) ? 'N/A' : Math.round($scores[$company_name])+'%';
      // var $score = Math.round($scores[$company_name]);

      $("#indicator--companies").append(
          template({score:$score, name:$name, item:item})
      );

    });
  }
});
