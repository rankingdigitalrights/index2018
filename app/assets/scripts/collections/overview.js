var Backbone = require('backbone');
var model = require('../models/overview');
var baseurl = require('../util/base-url');

module.exports = Backbone.Collection.extend({
  model: model,
  url: baseurl + '/assets/static/overview.json',

  parse: function (resp) {
    resp.forEach(function (d) {
      d.commitment = isNaN(d.commitment) ? 'N/A' : +d.commitment;
      d.freedom = isNaN(d.freedom) ? 'N/A' : +d.freedom;
      d.privacy = isNaN(d.privacy) ? 'N/A' : +d.privacy;
      d.total = isNaN(d.total) ? 'N/A' : +d.total;
      /* eslint-disable no-unneeded-ternary */
      d.telco = d.telco === 'false' ? false : true;
      /* eslint-enable no-unneeded-ternary */
    });
    return resp;
  }
});
