var $ = require('jquery');
var _ = require('underscore');
var BaseChart = require('./base-chart');
var template = require('../templates/category-indicators.tpl');
var baseurl = require('../util/base-url');

module.exports = BaseChart.extend({

  // Important to extend base id, so that resize hub can work.
  tagName: 'div',
  template: template,
  initialize: function (options) {
    _.extend(this, options);
  },

  render: function (id) {
    var prefix = this.category.charAt(0).toUpperCase();
    var indicators = this.collection.filter(model => model.get('id').charAt(0) === prefix)
      .map(function (model) {
        var text = model.get('text');
        if (!text) {
          text = model.get('levels').map(d => d.text);
        } else {
          text = [text];
        }
        return {
          name: model.get('name'),
          indicator: model.get('id'),
          text: text,
          baseurl
        };
      });

      var length = indicators.length;
      var a_length = Math.ceil(length/2);
      var indicators_left = indicators.slice(0, a_length);
      var indicators_right = indicators.slice(a_length);


    this.$el.html(this.template({indicators_left: indicators_left, indicators_right: indicators_right}));
    $('#' + id).append(this.$el);
  }
});
