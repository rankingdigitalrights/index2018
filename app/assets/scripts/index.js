var _ = require('underscore');
var $ = require('jquery');
var Overview = require('./collections/overview');
var IndexService = require('./collections/index-service');
var Companies = require('./views/index');
var VIndexService = require('./views/index-service');
var Map = require('./views/map');

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

  var map = new Map();
  //map.render();

};
