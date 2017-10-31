var Backbone = require('backbone');
var _ = require('underscore');
var Collapse = require('./collapse');
var companySpecificIndicators = require('../util/company-specific-indicators');
var isCategoryStart = require('../util/is-category-start');
var template = require('../templates/survey-question.tpl');
var baseurl = require('../util/base-url');
var customQuestions = require('../util/custom-questions');

module.exports = Backbone.View.extend({
  tagName: 'div',
  className: 'survey-row',
  template: template,

  render: function () {
    var model = this.model;
    var question = model.get('question');
    var levels = model.get('levels');
    var services = model.get('services');
    var id = this.model.get('id').toLowerCase();

    var follow = model.get('follow');

    var custom = [];
    var customId = '';
    if (id === 'c1' || customQuestions[id]) {
      customId = id === 'c1' ? 'c1.b' : id;
      custom = customQuestions[customId];
    }

    this.$el.append(this.template({

      baseurl,

      name: question.get('name'),
      text: question.get('text'),
      dir: 'indicators',

      follow,
      levels,
      custom,
      customId,

      categoryTitle: isCategoryStart[id],
      cat: id.charAt(0),

      href: id,
      isCommitment: id.charAt(0) === 'c',
      label: companySpecificIndicators[id] || '',
      length: services.length,

      services: services.map(function (model) {
        let score = model.get('score');
        let displayScore = isNaN(score) ? score : '' + Math.round(score);
        return _.extend({}, model.attributes, {
          displayScore
        });
      }),
      overall: Math.round(model.get('score'))
    }));
    var collapse = [];

    collapse.push(new Collapse({
      el: this.$('.js--table_trigger'),
      $body: this.$('.js--table_collapse')
    }));
    collapse.push(new Collapse({
      el: this.$('.js--levels_trigger_small'),
      $body: this.$('.js--levels_collapse_small')
    }));

    return this.$el;
  }
});
