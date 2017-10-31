var $ = require('jquery');
var d3 = require('d3');
d3.tip = require('d3-tip')(d3);
var BaseChart = require('./base-chart');
var baseurl = require('../util/base-url');

module.exports = BaseChart.extend({

  margin: { top: 40, right: 20, bottom: 115, left: 40 },

  initialize: function (options) {
    /* options
     *  - width
     *  - height
     *  - data
     */
    this.data = options.data;
    this.updateDimensions(options.width, options.height);

    this.x = d3.scale.ordinal()
      .rangeRoundBands([0, this.width], 0.25)
      .domain(this.data.map((d) => d.name));

    this.y = d3.scale.linear()
      .range([this.height, 0])
      .domain([-1, 100]);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient('bottom')
      .tickSize(0);

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .tickFormat(d => d + '%')
      .orient('left')
      .ticks(1)
      .tickSize(0);

    this.tip = d3.tip()
      .attr('class', 'bar--tip')
      .offset([-20, 0])
      .html(d => d.name + '<br />' + Math.round(d.val) + '%');
  },

  render: function (container) {
    this.container = container;
    var indicator_id = this.id;
    var svg = d3.select(container).append('svg')
      .attr('class', 'bar--chart')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    svg.call(this.tip);

    var g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    g.append('g')
      .attr('class', 'bar--axis_x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis)
      .selectAll('text')
      .attr('x', '-10')
      .attr('y','0')
      .style('text-anchor', 'end')
      .attr('transform', 'rotate(-45),translate(-15,20)')

      .attr('indicator_id', indicator_id) // parameter for ajax calls

      .on('click', function (d) {
        var href = d.toLowerCase().replace('&', '')
          .replace('.', '').replace(' ', '');
        if (indicator_id) {
          ajax_call(href, indicator_id);
        }
        else {
          window.location.href = baseurl + '/companies/' + href;
        }
      });

    var rank = g.append('g')
      .attr('class', 'bar--axis_x_rank');
    // .attr('transform', 'translate(0,' + this.height + ')')

    rank.call(this.xAxis)
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('class', 'rank')
      .attr('transform', 'translate(0,' + (this.height + 7) + ')')
      .data(this.data)
      .html(d => + d.rank);

    rank.selectAll(".tick").insert('circle', ':first-child')
      .attr("cx", '0')
      .attr("cy", '8')
      .attr("r", '10')
      .attr('transform', 'translate(0,' + (this.height + 7) + ')')
      .style("fill", "#B0B0B0");

    g.append('g')
      .attr('class', 'bar--axis_y')
      .call(this.yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '.71em')
      .style('text-anchor', 'end');

    var barsBg = g.selectAll('.barBg')
      .data(this.data)
      .enter().append('rect')
      .style('fill', '#E5DBD2')
      .attr('x', (d, i) => this.x(d.name))
      .attr('width', this.x.rangeBand())
      .attr('y', this.height)
      .attr('height', 0);

    barsBg.transition()
      .duration(1000)
      .attr('y', '0')
      .attr('height', d => this.height);

    var bars = g.selectAll('.bar')
      .data(this.data)
      .enter().append('rect')
      .attr('class', function (d) {
        if (!d.className) {
          d.className = 'default';
        }
        var className = 'bar bar--' + d.className;
        if (+d.val === 0) {
          className += ' bar--zero';
        }
        return className;
      })
      .attr('x', (d, i) => this.x(d.name))
      .attr('width', this.x.rangeBand())
      .attr('y', this.height)
      .attr('height', 0)
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide);

    bars.transition()
      .duration(2000)
      .attr('y', d => this.y(d.val))
      .attr('height', d => this.height - this.y(d.val));

  }
});
