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

        data.forEach(function (i, dd) {
            console.info(i.attributes.name);
        });

        var margin = {
                top: 10,
                right: 10,
                bottom: 20,
                left: 30
            },
            width = 920 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        var y = d3.scale.linear()
            .range([height, 0]);

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .2);

        var xAxisScale = d3.scale.linear()
            .domain([1880, 2015])
            .range([ 0, width]);

        var xAxis = d3.svg.axis()
            .scale(xAxisScale)
            .orient("bottom")
            .tickFormat(d3.format("d"));

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var svg = d3.select("#compare--overview_chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            //console.info(data);
            x.domain(data.map(function(d) {
                return d.name;
            }));
            y.domain(d3.extent(data, function(d) {
                return d.total_difference;
            })).nice();

            svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                .attr("class", function(d) {

                    if (d.total_difference < 0){
                        return "bar negative";
                    } else {
                        return "bar positive";
                    }

                })
                .attr("data-yr", function(d){
                    return d.name;
                })
                .attr("data-c", function(d){
                    return d.total_difference;
                })
                .attr("title", function(d){
                    return (d.name + ": " + d.total_difference + " °C")
                })
                .attr("y", function(d) {

                    if (d.total_difference > 0){
                        return y(d.total_difference);
                    } else {
                        return y(0);
                    }

                })
                .attr("x", function(d) {
                    return x(d.name);
                })
                .attr("width", x.rangeBand())
                .attr("height", function(d) {

                    console.info(d.name);

                    return Math.abs(y(d.total_difference) - y(0));
                })
                .on("mouseover", function(d){
                    // alert("Year: " + d.Year + ": " + d.Celsius + " Celsius");
                    d3.select("#_yr")
                        .text("Year: " + d.name);
                    d3.select("#degrree")
                        .text(d.total_difference + "°C");
                });

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            svg.append("g")
                .attr("class", "y axis")
                .append("text")
                .text("°Celsius")
                .attr("transform", "translate(15, 40), rotate(-90)")

            svg.append("g")
                .attr("class", "X axis")
                .attr("transform", "translate(" + (margin.left - 6.5) + "," + height + ")")
                .call(xAxis);

            svg.append("g")
                .attr("class", "x axis")
                .append("line")
                .attr("y1", y(0))
                .attr("y2", y(0))
                .attr("x2", width);

            svg.append("g")
                .attr("class", "infowin")
                .attr("transform", "translate(50, 5)")
                .append("text")
                .attr("id", "_yr");

            svg.append("g")
                .attr("class", "infowin")
                .attr("transform", "translate(110, 5)")
                .append("text")
                .attr("id","degrree");




        function type(d) {
            d.total_difference = +d.total_difference;
            return d;
        }


    },
});
