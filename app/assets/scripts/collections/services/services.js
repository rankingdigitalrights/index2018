var Backbone = require('backbone');
var model = require('../../models/services/services');
var baseurl = require('../../util/base-url');

// Represents how a single company responded
// to survey questions.
module.exports = Backbone.Collection.extend({
  url: baseurl + '/assets/static/services/',
  model: model,
  initialize: function (options) {
    this.url += options.service + '.json';
  },

  parse: function (resp) {
    return resp;
  }
});
