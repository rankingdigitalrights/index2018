var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var template = require('../templates/indicators.tpl');

module.exports = Backbone.View.extend({

  initialize: function (options) {
    _.extend(this, options);
  },

  render: function (el) {

    var $el = el;
    var $indicators = this.collection;
    var $data = $indicators.filter(model => model.get('indicator').charAt(0) === el.charAt(0));
    $data.forEach(function (item) {

      $('#overview_list--'+$el).append(
        template({name:item.attributes.name})
      );

    });

  },

});