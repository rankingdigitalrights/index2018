var Backbone = require('backbone');
var model = require('../models/service');

module.exports = Backbone.Collection.extend({
  model: model
});
