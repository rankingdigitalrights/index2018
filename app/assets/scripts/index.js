var _ = require('underscore');
var $ = require('jquery');
var Overview = require('./collections/overview');
var IndexService = require('./collections/index-service');
var Companies = require('./views/index');
var VIndexService = require('./views/index-service');
var Map = require('./views/map');
var Compare = require('./collections/compare');
var CompareView = require('./views/compare');

module.exports = function () {
  var $parent = $('#site-canvas');
  var overview = new Overview();
  var indexservice = new IndexService();

  var Internet = new Companies({
    collection: overview,
    telco: false,
    parent: '#category--internet--home'
  });
  var Telco = new Companies({
    collection: overview,
    telco: true,
    parent: '#category--telco--home'
  });

  var vvndexvervice = new VIndexService({
    collection: indexservice,
  });

  indexservice.fetch({
    success: function () {
      vvndexvervice.render();
    }
  })
  overview.fetch({
    success: function () {
      Internet.render();
      Telco.render();
    }
  });

  // Map
  var map = new Map();
  //map.render();

  // Compare
  var compare = new Compare();
  var compareView = new CompareView({
    collection: compare,
  });
  compare.fetch({
    success: function () {
      compareView.render();
    }
  });

};
