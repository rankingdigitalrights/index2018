var Backbone = require('backbone');
var Services = require('./services');
var model = require('../models/answer');
var baseurl = require('../util/base-url');

// Represents how a single company responded
// to survey questions.
module.exports = Backbone.Collection.extend({
  url: baseurl + '/assets/static/',
  model: model,
  initialize: function (options) {
    this.url += options.company + '.json';
  },

  parse: function (resp) {
    resp.forEach(function (d) {
      d.services = new Services(d.services);
    });
    return resp;
  }
});
