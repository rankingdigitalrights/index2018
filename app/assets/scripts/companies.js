var $ = require('jquery');
var Overview = require('./collections/overview');
var Companies = require('./views/companies');

module.exports = function () {
  var $parent = $('#site-canvas');
  var overview = new Overview();
  var Internet = new Companies({
    collection: overview,
    telco: false,
    parent: '#category--internet'
  });
  var Telco = new Companies({
    collection: overview,
    telco: true,
    parent: '#category--telco'
  });

  overview.fetch({
    success: function () {
      Internet.render();
      Telco.render();
    }
  });
};
