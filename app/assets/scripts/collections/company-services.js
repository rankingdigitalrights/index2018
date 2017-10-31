var Backbone = require('backbone');
var Services = require('./services');
var model = require('../models/company-service');
var baseurl = require('../util/base-url');

module.exports = Backbone.Collection.extend({
  model: model,
  url: baseurl + '/assets/static/services.json',

  parse: function (resp) {
    resp.forEach(function (d) {
      d.services = new Services(d.services);
    });
    return resp;
  }
});
