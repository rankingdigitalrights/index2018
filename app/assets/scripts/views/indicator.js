var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
var Barchart = require('./barchart');
var template = require('../templates/indicator.tpl');
var companySpecificIndicators = require('../util/company-specific-indicators');
var isCategoryStart = require('../util/is-category-start');
var baseurl = require('../util/base-url');
var telco = require('../util/telco');

module.exports = Backbone.View.extend({
  template: template,
  tagName: 'div',

  initialize: function (options) {

    var indicator_type = options.indicator_id.charAt(0);

    var data = [];
    var a_telco = [];
    var a_internet = [];

    var indicators = this.model.getSortedScores();
    indicators.forEach(function (i, d) {
      data.push(i);
      var control = $.inArray(i.name, telco);
      if (control == '-1') {
        a_internet.push(i);
      }
      else {
        a_telco.push(i);
      }

    });

    this.id = 'js--indicator_' + this.model.get('id');

    if (indicator_type == 'G') {
      this.graphic = new Barchart({
        width: options.width,
        height: 275,
        data: this.model.getSortedScores(),
        id: options.indicator_id
      });
    }
    else {
      console.info($(window).width());


      var width_i = options.width / 2;
      var width_t = options.width / 2;
      
      if ($(window).width() < 768) {
        width_i = options.width;
        width_t = options.width;
      }

      if (a_internet.length === 0) {
        this.no_internet = true;
      }
      if (a_telco.length === 0) {
        this.no_teclo = true;
      }

      this.graphic_telco = new Barchart({
        width: width_t,
        height: 275,
        data: a_telco,
        id: options.indicator_id
      });

      this.graphic_internet = new Barchart({
        width: width_i,
        height: 275,
        data: a_internet,
        id: options.indicator_id
      });
    }
  },

  handleResize: function (dimensions) { },

  render: function () {

    var indicator_type = this.model.get('indicator').charAt(0);

    var label = companySpecificIndicators[this.model.get('indicator')] || '';
    this.model.set('categoryTitle', isCategoryStart[this.model.get('indicator')]);
    this.$el.append(this.template(_.extend({}, this.model.attributes, {
      baseurl,
      label,
      indicator_type,
      no_internet: this.no_internet,
      no_telco: this.no_teclo
    })));

    if (indicator_type == 'G') {
      this.graphic.render(this.$('.bar--container')[0]);
    }
    else {
      if (this.no_internet === true) {
        this.graphic_telco.render(this.$('.bar--container--telco')[0]);
      } else if (this.no_teclo === true) {
        this.graphic_internet.render(this.$('.bar--container--internet')[0]);
      } else {
        this.graphic_telco.render(this.$('.bar--container--telco')[0]);
        this.graphic_internet.render(this.$('.bar--container--internet')[0]);
      }
    }

    return this.$el;
  }
});
