var queue = require('queue-async');
var $ = require('jquery');

var Company = require('./collections/company');
var Survey = require('./collections/survey');
var Overview = require('./collections/overview');
var CompanyIndicator = require('./collections/company/indicator');

var CategoryChart = require('./views/category-line-dot-chart');
var SurveyView = require('./views/survey');
var CompanyOverview = require('./views/company-overview');
var Collapse = require('./views/collapse');

/* ===========================================================*/
var IndicatorView = require('./views/company/indicator');
/* ===========================================================*/

var Barchart = require('./views/company-barchart');
var barsort = require('./util/barsort');

module.exports = function (companyName) {

  var overview = new Overview();

  var companyIndicator = new CompanyIndicator();

  var category = new CategoryChart({
    collection: overview,
    highlighted: companyName
  });
  var companyOverview = new CompanyOverview({
    collection: overview,
    companyName: companyName,
    container: 'comp--circle_chart'
  });

/* ===========================================================*/
  var companyindicator = new IndicatorView({
    collection: companyIndicator,
    companyName: companyName,
  });
/* ===========================================================*/


  

  
  companyIndicator.fetch({
    success: function () {
      // company indicators
      companyindicator.render();
    }
  });

  overview.fetch({
    success: function () {
      category.render('commitment'); // Commitment
      category.render('freedom'); // Freedom
      category.render('privacy'); // Privacy
      companyOverview.render();
      overviewSuccess(companyName);

    }
  });

  // Position among archar
  var $parent = $('#comp--position_among');
  var overviewSuccess = function (companyName) {
    var comp = overview.findWhere({ id: companyName });
    var is_telco = comp.get('telco');
    // var data = overview.map(function (model) {
    var data = overview.filter(model => model.get('telco') === is_telco).map(function (model) { // filter Overview collection
      return {
        name: model.get('display'),
        src: model.get('id'),
        val: Math.round(model.get('total')),
        // className: category
      };
    }).sort(barsort);

    var barchart = new Barchart({
      width: $('#comp--position_among_label').width(),
      height: 140,
      data: data,
    });

    barchart.render('#comp--position_among', companyName);
  }


  // Company responses rely on both survey questions,
  // and how each company answered them.
  var company = new Company({company: companyName});
  var survey = new Survey();

  // Fetch both at once before initializing the view
  var q = queue()
  q.defer(cb => company.fetch({success: () => cb(null, company)}));
  q.defer(cb => survey.fetch({success: () => cb(null, survey)}));
  q.await(function (err, company, survey) {
    var survey = new SurveyView({
      company: company,
      survey: survey
    });
    survey.render('comp--score-table');
  });

};
