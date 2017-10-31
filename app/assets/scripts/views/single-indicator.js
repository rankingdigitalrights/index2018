var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');
var Collapse = require('./collapse');
var template = require('../templates/survey-question.tpl');
var baseurl = require('../util/base-url');

module.exports = Backbone.View.extend({

  template: template,
  className: 'spaced-row',
  tagName: 'div',

  initialize: function (options) {
    this.pageId = options.indicatorName;
  },

  render: function (id) {
    var pageId = this.pageId;
    var $el = this.$el;
    var template = this.template;
    var isCommitment = pageId.charAt(0) === 'c';
    var follow = this.collection.indicatorFollow;

    _.chain(this.collection.models)
      .filter(model => !isNaN(model.get('score')))
      .sortBy(model => model.get('id'))
      .each(function (model) {
        var levels = model.get('levels');

        var services = model.get('services').map(function (d) {
          d.displayScore = isNaN(d.score) ? d.score : '' + Math.round(d.score);
          return d;
        });

        var data = _.extend({}, model.attributes, {
          name: model.get('display'),
          dir: 'companies',
          categoryTitle: 0,
          cat: pageId.charAt(0),
          text: 0,
          label: model.get('type'),
          href: model.get('id'),
          overall: model.get('score'),
          length: levels.length,
          customId: '',
          custom: [],
          isCommitment,
          follow,
          services,
          baseurl
        });

        var $child = $('<div />').addClass('survey-row').html(template(data));
        var collapse = [];
        collapse.push(new Collapse({
          el: $child.find('.js--table_trigger'),
          $body: $child.find('.js--table_collapse')
        }));
        collapse.push(new Collapse({
          el: $child.find('.js--levels_trigger_small'),
          $body: $child.find('.js--levels_collapse_small')
        }));

        $el.append($child);
      });
    $('#' + id).append(this.$el);
  }
});
