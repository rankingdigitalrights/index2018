var Backbone = require('backbone');
var model = require('../models/single-indicator');
var baseurl = require('../util/base-url');

module.exports = Backbone.Collection.extend({
  url: baseurl + '/assets/static/indicators/',
  model: model,
  initialize: function (options) {
    this.url += options.indicator.toUpperCase() + '.json';
  },
  parse: function (resp) {
    this.indicatorName = resp.name;
    this.companies = resp.companies;
    return resp;
  }
});
