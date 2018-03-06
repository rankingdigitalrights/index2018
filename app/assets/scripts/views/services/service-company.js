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

    console.info(this.model.company);

    var total_difference;
    var name = this.model.company;
    var collection = this.model.collection;
    collection.fetch({
      async: false,
      success: function(){
        var retval = collection.findWhere({name:name});
        total_difference = retval.attributes.total_difference;
      },
    });

    this.$el.html(this.template({
      service: this.model.service,
      company: this.model.company,
      total: this.model.t + '%',
      text: this.model.text,
      rank: this.model.rank,
      difference: total_difference,
    }));

    return this.$el;
  }
});
