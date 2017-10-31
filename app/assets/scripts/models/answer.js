var Backbone = require('backbone');
var genericCollection = Backbone.Collection.extend();

module.exports = Backbone.Model.extend({
  defaults: {
    id: '',
    services: genericCollection
  }
});
