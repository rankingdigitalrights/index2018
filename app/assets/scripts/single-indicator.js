var $ = require('jquery');
var _ = require('underscore');

var SingleIndicator = require('./collections/single-indicator');
var SingleIndicatorView = require('./views/single-indicator');

var Barchart = require('./views/barchart');
var categoryClasses = require('./util/category-classes');
var barsort = require('./util/barsort');

var Collapse = require('./views/collapse');

module.exports = function generateIndicator (indicatorName) {

  var toggles = [];
  toggles.push(new Collapse({
    el: $('.trigger'),
    $body: $('.collapse--target')
  }));

  var $parent = $('#indicator--overview_chart');
  var indicator = new SingleIndicator({indicator: indicatorName});

  var indicatorView = new SingleIndicatorView({
    collection: indicator,
    indicatorName
  });
  var className = categoryClasses[indicatorName.charAt(0).toLowerCase()];

  var success = function () {
    var data = indicator.map(function (model) {
      return {
        name: model.get('display'),
        src: model.get('id'),
        val: model.get('score'),
        className
      }
    }).filter(d => d.val !== undefined && !isNaN(d.val)).sort(barsort);
    var barchart = new Barchart({
      width: $parent.width(),
      height: 400,
      data: data
    });

    //barchart.render($parent[0]);
    indicatorView.render('indicator--companies');
  };
  indicator.fetch({success: success});
}
