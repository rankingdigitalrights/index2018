var d3 = require('d3');
d3.tip = require('d3-tip')(d3);
var BaseChart = require('./base-chart');
var baseurl = require('../util/base-url');

module.exports = BaseChart.extend({

  margin: {top: 40, right: 20, bottom: 90, left: 40},

  initialize: function (options) {
    /* options
     *  - width
     *  - height
     *  - data
     */
    this.data = options.data;
    this.updateDimensions(options.width, options.height);

    this.x = d3.scale.ordinal()
      .rangeRoundBands([0, this.width], 0.8)
      .domain(this.data.map((d) => d.service));

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
      .ticks(1)
      .tickSize(0)
      .orient('left');

    this.tipG = d3.tip()
      .attr('class', 'bar--tip')
      .offset([-20, 0])
      .html(d => d.g + '%');
    this.tipFoE = d3.tip()
      .attr('class', 'bar--tip')
      .offset([-20, 0])
      .html(d => d.foe + '%');
    this.tipP = d3.tip()
      .attr('class', 'bar--tip')
      .offset([-20, 0])
      .html(d => d.p + '%');
  },

  render: function (container) {
    this.container = container;
    var svg = d3.select(container).append('svg')
      .attr('class', 'bar--chart')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    svg.call(this.tipG);
    svg.call(this.tipFoE);
    svg.call(this.tipP);

    var g = svg.append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');


    g.append('g')
      .attr('class', 'bar--axis_x_service')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis)
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('transform', 'translate(0,50)');

      var rank = g.append('g')
      .attr('class', 'bar--axis_x_rank')
      // .attr('transform', 'translate(0,' + this.height + ')')
      
      rank.call(this.xAxis)
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('class', 'rank')
      .attr('transform', 'translate(-15,' + (this.height + 20) + ')')
      .data(this.data)
      .html(d => + d.rank);

      rank.selectAll(".tick")
      .insert('circle', ':first-child')
      .attr("cx", '0')
      .attr("cy", '8')
      .attr("r", '10')
      .attr('transform', 'translate(-15,' + (this.height + 20) + ')')
      .style("fill", "#B0B0B0");

      g.append('g')
      .attr('class', 'bar--axis_x_percent')
      // .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis)
      .selectAll('text')
      .style('text-anchor', 'start')
      .attr('transform', 'translate(0,' + (this.height + 20) + ')')
      .data(this.data)
      .html(d => + d.t + '%');

      g.append('g')
      .attr('class', 'bar--axis_x_company')
      // .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis)
      .selectAll('text')
      .style('text-anchor', 'middle')
      .attr('transform', 'translate(0,' + (this.height + 65) + ')')
      .data(this.data)
      .html(d => d.company )
      .on('click', function (d) {
        var href = d.company;
        href = href.toLowerCase().replace('&', '')
          .replace('.', '').replace(' ', '').replace('ó', 'o').replace('é', 'e');
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


/**************************************
 ************ Governance bars *********
 **************************************/

//  background bars
    var barsGBg = g.selectAll('.barBg')
      .data(this.data)
      .enter().append('rect')
      .style('fill', '#E5DBD2')
      .attr('x', (d, i) => this.x(d.service) - this.x.rangeBand() - 5)
      .attr('width', this.x.rangeBand())
      .attr('y', this.height)
      .attr('height', 0);

    barsGBg.transition()
      .duration(1000)
      .attr('y', '0')
      .attr('height', d => this.height);


// value bars
    var barsG = g.selectAll('.barG')
      .data(this.data)
      .enter().append('rect')
      .attr('class', function (d) {
        if (!d.className) {
          d.className = 'default';
        }
        var className = 'barG bar--' + d.className;
        if (+d.g == 0) {
          className += ' bar--zero';
        }
        return className;
      })
      .attr('x', (d, i) => this.x(d.service) - this.x.rangeBand() - 5)
      .attr('width', this.x.rangeBand())
      .attr('y', this.height)
      .attr('height', 0)
      .style('fill', '#57A8D5')
      .on('mouseover', this.tipG.show)
      .on('mouseout', this.tipG.hide);

/*************************************************
 ************ Freedom of expression bars *********
 *************************************************/

// background bars
    var barsGBg = g.selectAll('.barBg')
      .data(this.data)
      .enter().append('rect')
      .style('fill', '#E5DBD2')
      .attr('x', (d, i) => this.x(d.service))
      .attr('width', this.x.rangeBand())
      .attr('y', this.height)
      .attr('height', 0);

    barsGBg.transition()
      .duration(1000)
      .attr('y', '0')
      .attr('height', d => this.height);

// value bars
    var barsFoE = g.selectAll('.barFoE')
      .data(this.data)
      .enter().append('rect')
      .attr('class', function (d) {
        if (!d.className) {
          d.className = 'default';
        }
        var className = 'barFoE bar--' + d.className;
        if (+d.foe === 0) {
          className += ' bar--zero';
        }
        return className;
      })
      .attr('x', (d, i) => this.x(d.service))
      .attr('width', this.x.rangeBand())
      .attr('y', this.height)
      .attr('height', 0)
      .style('fill', '#21BCB3')
      .on('mouseover', this.tipFoE.show)
      .on('mouseout', this.tipFoE.hide);


/**************************************
 *************** Privacy bars *********
 **************************************/

//  background bars
    var barsGBg = g.selectAll('.barBg')
      .data(this.data)
      .enter().append('rect')
      .style('fill', '#E5DBD2')
      .attr('x', (d, i) => this.x(d.service) + this.x.rangeBand() + 5)
      .attr('width', this.x.rangeBand())
      .attr('y', this.height)
      .attr('height', 0);

    barsGBg.transition()
      .duration(1000)
      .attr('y', '0')
      .attr('height', d => this.height);

// values bars
    var barsP = g.selectAll('.barP')
      .data(this.data)
      .enter().append('rect')
      .attr('class', function (d) {
        if (!d.className) {
          d.className = 'default';
        }
        var className = 'barP bar--' + d.className;
        if (+d.p === 0) {
          className += ' bar--zero';
        }
        return className;
      })
      .attr('x', (d, i) => this.x(d.service) + this.x.rangeBand() + 5)
      .attr('width', this.x.rangeBand())
      .attr('y', this.height)
      .attr('height', 0)
      .style('fill', '#238E88')
      .on('mouseover', this.tipP.show)
      .on('mouseout', this.tipP.hide);

      

    barsG.transition()
      .duration(2000)
      .attr('y', d => this.y(d.g))
      .attr('height', d => this.height - this.y(d.g));
    barsFoE.transition()
      .duration(2000)
      .attr('y', d => this.y(d.foe))
      .attr('height', d => this.height - this.y(d.foe));
    barsP.transition()
      .duration(2000)
      .attr('y', d => this.y(d.p))
      .attr('height', d => this.height - this.y(d.p));
    

  }
});
