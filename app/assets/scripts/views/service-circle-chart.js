var _ = require('underscore');
var d3 = require('d3');

var BaseChart = require('./base-chart');
var baseurl = require('../util/base-url');

module.exports = BaseChart.extend({

  initialize: function (options) {
    _.extend(this, options);
  },

  render: function (el) {
    var radius = this.diameter / 2;
    var circleWidth = this.diameter / 7.5;
    var data = this.data;

    var g = d3.select(el).append('svg')
      .attr('class', 'circle--container')
      .attr('width', this.width)
      .attr('height', this.height + 40)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

    var arc = d3.svg.arc()
      .innerRadius(radius - circleWidth)
      .outerRadius(radius);

    var pie = d3.layout.pie()
      .value(d => d.val)
      .sort(null);

    var label = this.label;
    var name = g.append('text')
      .attr('class', 'circle--label_name')
      .style('text-anchor', 'middle')
      .attr('dy', '100px')
      .on('click', function (d) {
        var href = label.name.toLowerCase().replace('&', '')
          .replace('.', '').replace(' ', '').replace('ó', 'o').replace('é', 'e');
        window.location.href = baseurl + '/companies/' + href;
      });
    var service = g.append('text')
      .attr('class', 'circle--label_service')
      .style('text-anchor', 'middle')
      .attr('dy', '85px')
      .html(this.data[1].name);

    var score = g.append('text')
      .attr('class', 'circle--label_val')
      .style('text-anchor', 'middle')
      .attr('dy', '12px');

    var paths = g.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'circle--arc')
      .append('path')
      .attr('d', arc)
      .attr('class', (d) => 'circle--arc--chart--val circle--arc_' + d.data.id);

    toDefaultLabel();

    function toDefaultLabel() {
      name.text(label.name);
      score.text(Math.round(label.val) + '%');
    }

    // if multiple data, support hover
    if (data.length > 2) {
      paths.on('mouseover', function (d) {
        if (d.data.id === 'remainder') {
          toDefaultLabel();
        } else {
          name.text(d.data.name);
          score.text(Math.round(d.data.val) + '%');
        }
      }).on('mouseout', toDefaultLabel);
    }
  }
});