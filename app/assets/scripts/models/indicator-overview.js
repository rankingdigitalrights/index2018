var Backbone = require('backbone');
var _ = require('underscore');
var categoryClasses = require('../util/category-classes');
var barsort = require('../util/barsort');

module.exports = Backbone.Model.extend({
  defaults: {
    indicator: '',
    scores: {},
    text: ''
  },
  getSortedScores: function () {
    var src = this.get('indicator');
    var className = categoryClasses[src.charAt(0).toLowerCase()];
    return _.chain(this.get('scores'))
      .map(function (val, key) {
        return {
          name: key,
          src,
          className,
          val: +val
        };
      })
      .filter(d => d.val !== undefined && !isNaN(d.val))
      .value().sort(barsort);
  }

});
