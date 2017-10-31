var Backbone = require('backbone');

var baseurl = require('../../util/base-url');
var indicator = require('../../models/company/indicator');

module.exports = Backbone.Collection.extend({
  model: indicator,
  url: baseurl + '/assets/static/company/all-indicators.json',
  parse: function (resp) {
    return resp;
  }
});
