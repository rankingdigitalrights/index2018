var Backbone = require('backbone');
var _ = require('underscore');

// A generic subview for all d3-enabled chart views.
module.exports = Backbone.View.extend({

  margin: {top: 0, right: 0, bottom: 0, left: 0},

  // Update width, height, according to arguments.
  updateDimensions: function (width, height) {
    this.width = width - this.margin.left - this.margin.right;
    this.height = height - this.margin.top - this.margin.bottom;
    return this;
  },
  // Keep track of subviews and remove them all
  // when this view (the parent) is removed.
  childViews: [],
  remove: function () {
    _.each(this.childViews, view => view.remove());
    Backbone.View.prototype.remove.call(this);
  }
});
