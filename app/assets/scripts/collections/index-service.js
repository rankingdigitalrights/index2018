var Backbone = require('backbone');
var model = require('../models/index-service');
var baseurl = require('../util/base-url');

module.exports = Backbone.Collection.extend({
  model: model,
  url: baseurl + '/assets/static/index-service.json',

  parse: function (resp) {
    resp.forEach(function (d) {
      d.id = d.id;
      d.total = d.total;
      d.service = d.service;
      d.company = d.company;
    });
    return resp;
  }
});
