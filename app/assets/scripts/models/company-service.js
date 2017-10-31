var Backbone = require('backbone');
var _ = require('underscore');
var genericCollection = Backbone.Collection.extend();

module.exports = Backbone.Model.extend({
  defaults: {
    name: '',
    group: {},
    overall: {},
    services: genericCollection
  },

  overallScoreByCategory: function (prefix, exclude) {
    var scores = [];
    _.each(this.get('overall'), function (val, key) {
      if (key.charAt(0) === prefix && key !== exclude) {
        scores.push({name: key, val: val});
      }
    });
    return _.chain(scores)
      .filter(d => d.val !== undefined && !isNaN(d.val))
      .sortBy(d => +d.name.slice(1))
      .value();
  }
});
