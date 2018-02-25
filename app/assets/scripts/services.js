var $ = require('jquery');
var _ = require('underscore');
var Service = require('./collections/services/services');
var Survey = require('./collections/survey');
var CompanyServices = require('./collections/company-services');
var Barchart = require('./views/services-barchart');
var CompanyService = require('./views/services/service');

var DotChart = require('./views/services/service-line-dot-chart');
var Indicators = require('./views/category-indicators');
var Collapse = require('./views/collapse');
var barsort = require('./util/services-barsort');

module.exports = function generateService (serviceType) {

  var $parent = $('#service--overview_chart');
  var service = new Service({service: serviceType });
  
  var overviewSuccess = function () {
    var data = service.map(function (model) {
    // var data = overview.filter(model => model.get('telco') === true).map(function (model) { // filter Overview collection
      return {
        company: model.get('Company'),
        service: model.get('Service '),
        rank: model.get('rank'),
        g: model.get('G'),
        foe: model.get('FoE'),
        p: model.get('P'),
        t: model.get('Total'),
        text: model.get('Description'),
        className: serviceType
      };
    }).sort(barsort);
    var barchart = new Barchart({
      width: $parent.width(),
      height: 270,
      data: data
    });
    barchart.render($parent[0]);

    var companyService = new CompanyService({
      data: data,
      parent: $("#service--companies")
    });
    
    companyService.render();

    var dotChart = new DotChart({
      data: data
    });

    dotChart.render();
  }

  service.fetch({success: overviewSuccess});

  /*
  if (category === 'freedom-of-expression') {
    category = 'freedom';
  }

  var toggles = [];
  toggles.push(new Collapse({
    el: $('.trigger'),
    $body: $('.collapse--target')
  }));

  var $parent = $('#service--overview_chart');
  var overview = new Overview();
  var overviewSuccess = function () {
    var data = overview.map(function (model) {
    // var data = overview.filter(model => model.get('telco') === true).map(function (model) { // filter Overview collection
      return {
        name: model.get('display'),
        src: model.get('id'),
        val: Math.round(model.get(category)),
        className: category
      };
    }).sort(barsort);
    var barchart = new Barchart({
      width: $parent.width(),
      height: 400,
      data: data
    });
    barchart.render($parent[0]);
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
  */

};
