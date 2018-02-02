var Backbone = require('backbone');

var _ = require('underscore');
var $ = require('jquery');
var d3 = require('d3');
d3.tip = require('d3-tip')(d3);
var baseurl = require('../util/base-url');

module.exports = Backbone.View.extend({


    // We want to render four circle graphs:
    // the overview, and each category graph.
    render: function (el) {

        var data = this.collection.models;

        var $data = [];
        data.forEach(function (i) {
            $data.push({name:i.attributes.name,total_difference:i.attributes.total_difference});
        });


        $data.sort(function(a, b) {
            return parseFloat(a.total_difference) - parseFloat(b.total_difference);
        });

        $data.reverse();

        //var _data = [["A",0.012], ["B",-0.025], ["C",0.008], ["D",0.023], ["E",-0.009], ["F", 0.005]];
        
        d3.select("#compare--overview_chart")
            .datum($data)
            .call(columnChart()
            .width($('#compare--overview_chart').width())
            .height(500)
            .x(function(d, i) { return d.name; })
            .y(function(d, i) { return d.total_difference; }));

    },
});


function columnChart() {
  var margin = {top: 30, right: 10, bottom: 50, left: 50},
      width = 100,
      height = 400,
      xRoundBands = 0.05,
      xValue = function(d) { return d[0]; },
      yValue = function(d) { return d[1]; },
      xScale = d3.scale.ordinal(),
      yScale = d3.scale.linear(),
      yAxis = d3.svg.axis().scale(yScale).orient("left"),
      xAxis = d3.svg.axis().scale(xScale);
      

  function chart(selection) {
    selection.each(function(data) {

      // Convert data to standard representation greedily;
      // this is needed for nondeterministic accessors.
      data = data.map(function(d, i) {
        return [xValue.call(data, d, i), yValue.call(data, d, i)];
      });
    
      // Update the x-scale.
      xScale
          .domain(data.map(function(d) { return d[0];} ))
          .rangeRoundBands([0, width - margin.left - margin.right], xRoundBands);
         

      // Update the y-scale.
      yScale
          .domain(d3.extent(data.map(function(d) { return d[1];} )))
          .range([height - margin.top - margin.bottom, 0])
          .nice();
          

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var gEnter = svg.enter().append("svg").append("g");
      gEnter.append("g").attr("class", "bars");
      gEnter.append("g").attr("class", "y axis");
      gEnter.append("g").attr("class", "x axis");
      gEnter.append("g").attr("class", "x axis zero");

      // Update the outer dimensions.
      svg .attr("width", width)
          .attr("height", height);

      // Update the inner dimensions.
      var g = svg.select("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

     // Update the bars.
      var bar = svg.select(".bars").selectAll(".bar").data(data);
      bar.enter().append("rect");
      bar.exit().remove();
      bar .attr("class", function(d, i) { return d[1] < 0 ? "bar negative" : "bar positive"; })
          .attr("x", function(d) { return X(d); })
          .attr("y", function(d, i) { return d[1] < 0 ? Y0() : Y(d); })
          .attr("width", xScale.rangeBand())
          .attr("height", function(d, i) { return Math.abs( Y(d) - Y0() ); });


      // x axis at the bottom of the chart
      /*
      g.select(".x.axis")
       .attr("transform", "translate(0," + (height - margin.top - margin.bottom) + ")")
       .call(xAxis.orient("bottom"));
      */

      g.select(".x.axis.zero")
        .attr("transform", "translate(0," + Y0() + ")")
        .call(xAxis.tickSize(0))
        .selectAll('text')
        .attr('x', '0')
        .attr('y', '0')
        .style('text-anchor', function(d, i) { return data[i][1] < 0 ? 'start' : 'end' })
        .attr('class', 'company--name')
        .attr('transform', function(d, i) { return data[i][1] < 0 ? 'rotate(-45), translate(10, -10)' : 'rotate(-45), translate(-5, 5)' });

      // Update the y-axis.
      // g.select(".y.axis").call(yAxis);

      gEnter.append("g").attr("class", "x axis label");
      g.select(".x.axis.label")
        .attr("transform", "translate(0," + Y0() + ")")
        .call(xAxis.tickSize(0))
        .selectAll('text')
        .attr('x', '0')
        .attr('y', function(d, i) {
          var $height = Math.abs(Y(data[i]) - Y0());
          var $retval  = data[i][1] >= 0 ? $height*(-1)-20 : $height + 5 ;
          return $retval;
        })
        .attr('class', function(d,i) { return data[i][1] < 0 ? 'label positive' : 'label negative' } )
        .data(data)
        .html(function(d,i) { return d[1] });

    });
  }


// The x-accessor for the path generator; xScale ∘ xValue.
  function X(d) {
    return xScale(d[0]);
  }

  function Y0() {
    return yScale(0);
  }

  // The x-accessor for the path generator; yScale ∘ yValue.
  function Y(d) {
    return yScale(d[1]);
  }

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function(_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function(_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  return chart;
}