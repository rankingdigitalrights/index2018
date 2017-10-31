var Backbone = require('backbone');
module.exports = Backbone.Model.extend({
  defaults: {
    score: 0,
    id: '',
    display: '',
    name: '',
    levels: [],
    type: ''
  }
});
