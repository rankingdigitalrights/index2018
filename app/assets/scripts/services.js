var $ = require('jquery');
var _ = require('underscore');

var Service = require('./collections/services/services');
var Survey = require('./collections/survey');
var Compare = require('./collections/compare');
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
  var compare = new Compare();

  var overviewSuccess = function () {
    var data = service.map(function (model) {

      var total_difference;
      var name = model.get('Company');
      compare.fetch({
        async: false,
        success: function(){
          var retval = compare.findWhere({id:name.toLowerCase()});
          total_difference = retval.attributes.total_difference;
        },
      });

      return {
        company: model.get('Company'),
        service: model.get('Service'),
        rank: model.get('rank'),
        g: model.get('G'),
        foe: model.get('FoE'),
        p: model.get('P'),
        t: model.get('Total'),
        text: model.get('Description'),
        className: serviceType,
        difference: total_difference
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

};
