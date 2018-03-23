var Backbone = require('backbone');
var Datamap = require('datamaps');
var d3 = require('d3');
var d3GeoProjection = require("d3-geo-projection")(d3);
var baseurl = require('../util/base-url');


module.exports = Backbone.View.extend({

    // Represents the actual DOM element that corresponds to your View (There is a one to one relationship between View Objects and DOM elements)
    el: 'body',

    // Constructor
    initialize: function() {

        // render map
        var map = new Datamap({
                element: document.getElementById('container'),
                setProjection: function (element) {
                  var projection = d3.geo.robinson()
                    .scale(element.offsetWidth / 6)
                    .rotate([350, 0, 0])
                    .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
                  var path = d3.geo.path().projection(projection);
                  return { path: path, projection: projection };
                },
                responsive: true, // If true, call `resize()` on the map object when it should adjust it's size
                // countries don't listed in dataset will be painted with this color
                fills: { 
                  'yellow': '#F8931F',
                  'red': '#ed1b24',
                  defaultFill: '#E7E6E6'
                },
                data: {
                   "USA":{
                      "fillColor":"#5DA0CA",
                      "hoverColor":"#224c68"
                   },
                   "MEX":{
                      "fillColor":"#5DA0CA",
                      "hoverColor":"#224c68"
                   },
                   "GBR":{
                      "fillColor":"#5DA0CA",
                      "hoverColor":"#224c68"
                   },
                   "FRA":{
                      "fillColor":"#5DA0CA",
                      "hoverColor":"#224c68"
                   },
                   "ESP":{
                      "fillColor":"#5DA0CA",
                      "hoverColor":"#224c68"
                   },
                   "RUS":{
                      "fillColor":"#5DA0CA",
                      "hoverColor":"#224c68"
                   },
                   "CHN":{
                      "fillColor":"#5DA0CA",
                      "hoverColor":"#224c68"
                   },
                   "KOR":{
                      "fillColor":"#5DA0CA",
                      "hoverColor":"#224c68"
                   },
                   "MYS":{
                      "fillColor":"#5DA0CA",
                      "hoverColor":"#224c68"
                   },
                   "IND":{
                      "fillColor":"#5DA0CA",
                      "hoverColor":"#224c68"
                   },
                   "QAT":{
                      "fillColor":"#5DA0CA",
                      "hoverColor":"#224c68"
                   },
                   "ARE":{
                      "fillColor":"#5DA0CA",
                      "hoverColor":"#224c68"
                   },
                   "ZAF":{
                      "fillColor":"#5DA0CA",
                      "hoverColor":"#224c68"
                   }
                },
                geographyConfig: {
                    borderColor: '#DEDEDE',
                    highlightBorderWidth: 1,
                    popupOnHover: false,
                    // don't change color on mouse hover
                    highlightFillColor: function(geo) {
                        return geo['hoverColor'] || '#E7E6E6';
                    },
                    // only change border
                    highlightBorderColor: '#DEDEDE',
                    // show desired information in tooltip
                    popupTemplate: function(geo, data) {
                        // don't show tooltip if country don't present in dataset
                        if (!data) { return ; }
                        // tooltip content
                        var retval = '';
                        data.companies.forEach(function(item){
                          retval += '<li><i class="fa fa-circle '+item.type+'"></i>'+item.name+'</li>';
                        });
                        return ['<div class="d3-tip s"><div class="country">',geo.properties.name,'</div>',
                            '<ul>', retval, '</ul>',
                            '</div>'].join('');
                    }
                }
        });

        $.getJSON(baseurl + "/assets/static/companies.json", function(points) {
          map.bubbles(points, {
            borderWidth: 0,
            popupOnHover: false,
            highlightOnHover: false,
            popupTemplate: function() {
              return ['<div class="d3-tip e"><div class="country">Test</div>',
                '<ul>Test test</ul>',
                '</div>'].join('');
            }
          });

          map.bombLabels(points);

        });

        function handleBombLabels ( layer ) {

          var self = this;
          
          d3.selectAll(".datamaps-bubble").attr("data-foo", function(datum) {

            //convert lat/lng into x/y
            var coords = self.latLngToXY(datum.latitude, datum.longitude)

              layer.append("a")
                .attr("xlink:href", "https://rankingdigitalrights.org/index2017/companies/")
                .append("text")
                .attr("x", coords[0] - parseInt(datum.compPosX))
                .attr("y", coords[1] - parseInt(datum.compPosY))
                .style("font-size", "16px")
                .style("text-transform", "uppercase")
                .style("fill", datum.compColor)
                .style("font-weight", "bold")
                .attr("text-anchor", datum.compAnchor)
                .text(datum.company);

            layer.append("text")
              .attr("x", coords[0] - parseInt(datum.countryPosX)) //this could use a little massaging
              .attr("y", coords[1] + parseInt(datum.countryPosY))
              .style("font-size", "16px")
              .style("fill", datum.countryColor)
              .style("font-weight", "bold")
              .attr("text-anchor", datum.countryAnchor) // set anchor y justification
              .attr("class", "label--country")
              .text(datum.country);

              if (parseInt(datum.lineColor)!=0){
                  var $end = self.latLngToXY(datum.x2, datum.y2);
                  layer.append("line")          // attach a line
                    .style("stroke", datum.lineColor)  // colour the line
                    .attr("x1", coords[0])     // x position of the first end of the line
                    .attr("y1", coords[1])      // y position of the first end of the line
                    .attr("x2", $end[0])     // x position of the second end of the line
                    .attr("y2", $end[1]);    // y position of the second end of the line

                layer.append("circle")          // attach a line
                    .style("fill", datum.lineColor)  // colour the line
                    .style("stroke-width", 0)  // colour the line
                    .attr("r", 2)
                    .attr("cx", $end[0])     // x position of the second end of the line
                    .attr("cy", $end[1]);    // y position of the second end of the line
            }

            return "bar";
          });
        }

        //register the plugin to datamaps
        map.addPlugin('bombLabels', handleBombLabels);

        window.addEventListener('resize', function() {
            map.resize();
        });
    },
});