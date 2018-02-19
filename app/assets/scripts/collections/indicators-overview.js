var Backbone = require('backbone');
var model = require('../models/indicator-overview');
var baseurl = require('../util/base-url');

module.exports = Backbone.Collection.extend({
  url: baseurl + '/assets/static/indicator-overview.json',
  model: model,
  parse: function (resp) {
    resp.forEach(function (d) {
      d.indicator = d.id.toLowerCase();
      delete d.id;
    });
    return resp;
  }
});
