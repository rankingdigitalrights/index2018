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

    $companies.forEach(function(item){
      console.info(item);
      $("#indicator--companies").append(
          template({name:$name, item:item})
      );
    });
  }
});
