var $ = require('jquery');
var d3 = require('d3');
d3.tip = require('d3-tip')(d3);
var BaseChart = require('./base-chart');
var baseurl = require('../util/base-url');

module.exports = BaseChart.extend({

  margin: { top: 40, right: 20, bottom: 120, left: 40 },

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
      .style('font-weight', 'bold')
      .attr('transform', 'rotate(-45),translate(5,0)')
      .on('click', function (d) {
        var href = d.toLowerCase().replace('&', '').replace('.', '').replace(' ', '').replace('ó', 'o').replace('é', 'e');
          window.location.href = baseurl + '/companies/' + href;
      });

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
