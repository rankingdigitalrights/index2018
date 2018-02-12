var $ = require('jquery');
var _ = require('underscore');
var Overview = require('./collections/categories/categories');
var Survey = require('./collections/survey');
var Barchart = require('./views/categories-barchart');
var Indicators = require('./views/category-indicators');
var Collapse = require('./views/collapse');
var barsort = require('./util/barsort');

var splitChartTemplate = require('./templates/split-charts.tpl');

module.exports = function generateCategory (category) {

  if (category === 'freedom-of-expression') {
    category = 'freedom';
  }

  var $parent = $('#category--overview_chart');
  var overview = new Overview();
  var overviewSuccess = function () {
    // var data = overview.map(function (model) {
      if (category === 'governance') { 
        var data = overview.map(function (model) {
          console.info(model);
          var cat = model.get(category);
          return {
            name: model.get('display'),
            src: model.get('id'),
            val: cat.val,
            rank: cat.rank,
            className: category
          };
        }).sort(barsort);

        var barchart = new Barchart({
          width: $parent.width(),
          height: 300,
          data: data
        });

        barchart.render($parent[0]);
      }
      else {
        $parent.append(splitChartTemplate);
        var data = overview.filter(model => model.get('telco') === false).map(function (model) { // filter Overview collection
        var cat = model.get(category);
        return {
          name: model.get('display'),
          src: model.get('id'),
          val: cat.val,
          rank: cat.rank,
          className: category
        };
      }).sort(barsort);

      var barchart = new Barchart({
        width: $('#category--overview_chart_left').width(),
        height: 300,
        data: data
      });
      barchart.render($('#category--overview_chart_left')[0]);

      var telcoData = overview.filter(model => model.get('telco') === true).map(function (model) { // filter Overview collection
        var cat = model.get(category);
        return {
          name: model.get('display'),
          src: model.get('id'),
          val: cat.val,
          rank: cat.rank,
          className: category
        };
      }).sort(barsort);

      var telcoBarchart = new Barchart({
        width: $('#category--overview_chart_right').width(),
        height: 300,
        data: telcoData
      });
      telcoBarchart.render($('#category--overview_chart_right')[0]);
      }
  }
  overview.fetch({success: overviewSuccess});

  var survey = new Survey();
  var indicators = new Indicators({
    category,
    collection: survey
  });

  survey.fetch({
    success: () => indicators.render('category--indicators')
  });

};
