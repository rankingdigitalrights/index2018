var Backbone = require('backbone');

var baseurl = require('../../util/base-url');
var category = require('../../models/categories/categories');

module.exports = Backbone.Collection.extend({
  model: category,
  url: baseurl + '/assets/static/categories/categories-overview.json',

  parse: function (resp) {
    resp.forEach(function (d) {
      d.commitment = d.commitment;
      d.freedom = d.freedom;
      d.privacy = d.privacy;
      /* eslint-disable no-unneeded-ternary */
      d.telco = d.telco === 'false' ? false : true;
      /* eslint-enable no-unneeded-ternary */
    });
    return resp;
  }
});
