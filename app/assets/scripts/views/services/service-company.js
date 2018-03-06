var $ = require('jquery');
var _ = require('underscore');

var Backbone = require('backbone');
var template = require('../../templates/service-companies.tpl');

module.exports = Backbone.View.extend({
  template: template,
  initialize: function (options) {
    _.extend(this, options);
  },
  render: function (data) {

    this.$el.html(this.template({
      service: this.model.service,
      company: this.model.company,
      total: this.model.t + '%',
      text: this.model.text,
      rank: this.model.rank,
      difference: this.model.difference,
    }));

    return this.$el;
  }
});
