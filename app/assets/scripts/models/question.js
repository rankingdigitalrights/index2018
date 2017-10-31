var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    text: '',
    name: '',
    id: '',
    services: []
  }
});
