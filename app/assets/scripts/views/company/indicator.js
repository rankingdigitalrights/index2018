var _ = require('underscore');
var $ = require('jquery');

var d3 = require('d3');
d3.tip = require('d3-tip')(d3);

var baseurl = require('../../util/base-url');
var BaseChart = require('./../base-chart');
var ServiceCircleChart = require('./../service-circle-chart');
var categories = require('../../util/categories');
var template = require('../../templates/company-overview.tpl');

module.exports = BaseChart.extend({

    initialize: function (options) {
        _.extend(this, options);
        //this.$el.append(this.template());
        //$('#' + options.container).append(this.$el);
    },

    // We want to render four circle graphs:
    // the overview, and each category graph.
    render: function (el) {

        var tmp = this.collection;
        var companyName = this.companyName;
        var comp = tmp.findWhere({ id: companyName });

        var category = ['freedom', 'privacy', 'commitment'];
        category.forEach(function (i, dd) {

            // console.info(comp);
            var data = comp.attributes[i].reverse();


            //set up svg using margin conventions - we'll need plenty of room on the left for labels
            var margin = {
                top: 20,
                right: 350,
                bottom: 10,
                left: 10
            };

            var width = 460 - margin.left - margin.right,
                height = 45 * data.length; // 200 - margin.top - margin.bottom;


            var svg = d3.select("#indicators--" + i).append("svg")
                .attr("height", height + margin.top + margin.bottom)
                .attr("width", "100%")
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            svg.append("text")
                .attr("x", 60)
                .attr("y", 0)
                .attr("text-anchor", "right")
                .style("font-size", "14px")
                .style("text-transform", "uppercase")
                .text("score");

            svg.append("text")
                .attr("x", 110)
                .attr("y", 0)
                .attr("text-anchor", "left")
                .style("font-size", "14px")
                .style("text-transform", "uppercase")
                .text("indicators");

            var x = d3.scale.linear()
                .domain(d3.extent(data, function (d) {
                    var neg = d.value * (-1);
                    return neg;
                }))
                .range([0, width]);

            var y = d3.scale.ordinal()
                .rangeRoundBands([height, 0], 0.3)
                .domain(data.map(function (d) {
                    return d.name;
                }));

            var yAxis = d3.svg.axis()
                .scale(y)
                .tickSize(0.3)
                .orient("right");

            var tip = d3.tip()
                .attr('class', 'bar--tip')
                .offset([-10, 0])
                .html(function (d) {
                    var value = Math.round(d.value) + "%";
                    if(d.value == '0.0000'){
                        value = 'N/A';
                    }
                    return value;
                });

            svg.call(tip);

            var indicator_width = $('#indicators--privacy').width();
            var wrap_width = Number(indicator_width) - 100;

            var gy = svg.append("g")
                .attr("class", "y axis")
                .call(yAxis)
                .selectAll("text")
                .attr("y", -8)
                .attr("x", 110)
                .style("font-size", "15px")

                .call(wrap, wrap_width);

            svg.selectAll('.tick')
                .style("cursor", "pointer")
                .append("svg:title")
                .text("Go to indicators page");

            var bars = svg.selectAll(".bar")
                .data(data)
                .enter().append("rect")
                //.attr("class", "bar")

                .attr('class', function (d) {
                    var className = 'bar';
                    if (d.value == 0) className = 'bar--zero';
                    return className;
                })

                .attr("x", function (d) {
                    var width = 100;
                    if (d.value == 0) width = 98;
                    return width - Number(d.value);
                })
                .attr("width", function (d) {
                    var width = d.value;
                    if (d.value == 0) width = 2;
                    return width;
                })

                .attr("y", function (d) { return y(d.name); })
                .attr("height", y.rangeBand())

                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            var barBg = svg.selectAll(".barBg")
                .data(data)
                .enter().append("rect")
                .style('fill', '#E5DBD2')
                .attr("x", 0)
                .attr("y", function (d) { return y(d.name); })
                .attr("width", function (d) {
                    var width = 100;
                    if (d.value == 0) width = 98;
                    return width - Number(d.value);
                })
                .attr("height", y.rangeBand());
        })

        function wrap(text, width) {
            text.each(function () {
                var text = d3.select(this),
                    pos = text.text().indexOf("."),
                    indic = text.text().slice(0, pos),
                    href = text.on('click', function () {
                        window.location.href = baseurl + '/indicators/#' + indic;
                    }),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line = [],
                    lineNumber = 0.1,
                    lineHeight = 1.1, // ems
                    y = text.attr("y"),
                    dy = parseFloat(text.attr("dy")),
                    tspan = text.text(null).append("tspan").attr("x", 110).attr("y", y).attr("dy", dy + "em");

                while (word = words.pop()) {
                    line.push(word);
                    tspan.text(line.join(" "));
                    if (tspan.node().getComputedTextLength() > width) {
                        line.pop();
                        tspan.text(line.join(" "));
                        line = [word];
                        tspan = text.append("tspan").attr("x", 110).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                    }
                }
            });
        }

    },
});
