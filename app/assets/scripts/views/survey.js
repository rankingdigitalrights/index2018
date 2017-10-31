var $ = require('jquery');
var _ = require('underscore');

var BaseChart = require('./base-chart');
var SurveyQuestion = require('./survey-question');

var Question = require('../models/question');

// View to represent survey questions and answers
module.exports = BaseChart.extend({

  tagName: 'div',

  initialize: function (options) {
    _.extend(this, options);
  },

  render: function (id) {
    var survey = this.survey;
    var $el = this.$el;

    // Match the question with it's response, and
    // create a new question view with the result.
    this.company.each(function (model) {
      let id = model.get('id');
      let question = survey.findWhere({id: id});

      // In case we can't find it, notify and
      // point it to a generic model.
      if (!question) {
        console.log('No indicator data for', id);
        console.log('Using generic question model instead');
        question = new Question();
      }

      model.set('question', question);
      let surveyQuestion = new SurveyQuestion({model: model});
      $el.append(surveyQuestion.render());
    });
    $('#' + id).append($el);
  }
});
