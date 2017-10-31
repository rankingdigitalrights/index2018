var Backbone = require('backbone');

module.exports = Backbone.Model.extend({
  defaults: {
    name: '',
    id: '',
    display: '',
    telco: false,
    privacy: -1,
    commitment: -1,
    freedom: -1,
    total: -1
  }
});
