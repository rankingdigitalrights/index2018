var Backbone = require('backbone');

var baseurl = require('../util/base-url');
var question = require('../models/question');

module.exports = Backbone.Collection.extend({
  model: question,
  url: baseurl + '/assets/static/survey.json',
  parse: function (resp) {
    return resp;
  }
});
