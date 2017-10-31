var d3 = require('d3');
d3.tip = require('d3-tip')(d3);
var BaseChart = require('./base-chart');
var baseurl = require('../util/base-url');

module.exports = BaseChart.extend({

  margin: { top: 40, right: 10, bottom: 25, left: 0 },

  initialize: function (options) {
    /* options
     *  - width
     *  - height
     *  - data
     */
    this.data = options.data;
    this.updateDimensions(options.width, options.height);

    this.x = d3.scale.ordinal()
      .rangeRoundBands([0, this.width], 0.5)
      .domain(this.data.map((d) => d.name));

    this.y = d3.scale.linear()
      .range([this.height, 0])
      .domain([0, 100]);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient('bottom')
      .tickSize(0);

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient('left')
      .tickSize(0)
      .ticks(0);

    this.tip = d3.tip()
      .attr('class', 'bar--tip')
      .offset([-20, 0])
      .html(d => d.name + '<br />' + Math.round(d.val) + '%');
  },

  render: function (container, companyName) {
    this.container = container;
    var svg = d3.select(container).append('svg')
      .attr('class', 'bar--chart')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.bottom);

    svg.call(this.tip);

    var g = svg.append('g')
      .attr('transform', 'translate(-10,0)');

    var count = 1;
    g.append('g')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis)
      .selectAll('text')
      .data(this.data)
      .attr('class', function (d) {
        if (d.src == companyName) {
          return 'bar--axis_x_current_company';
        }
      })
      .style('text-anchor', 'middle')
      .attr('transform', 'translate(0,4)')
      .html(function (d) {
        
        if (d.src === companyName) {
          if (d.src === 'vodafone') { return 1; }
          if (d.src === 'tencent') { return 10; }
          return count;
        }
        else {
          count++;
        }
      });

    var circle = g.selectAll(".bar--axis_x_current_company").node().parentNode;

    d3.select(circle)
      .insert('circle', ':first-child')
      .attr("cx", '0')
      .attr("cy", '10')
      .attr("r", '9')
      .attr('transform', 'translate(0,2)')
      .style("fill", "#ed1b24");

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
        if (d.src == companyName) {
          return "bar--axis_x_current_company_bar";
        }
      })
      .attr('x', (d, i) => this.x(d.name))
      .attr('width', this.x.rangeBand())
      .attr('y', this.height)
      .attr('height', 0)
      .on('mouseover', this.tip.show)
      .on('mouseout', this.tip.hide);

    bars.transition()
      .duration(2500)
      .attr('y', d => this.y(d.val))
      .attr('height', d => this.height - this.y(d.val));

  }
});
