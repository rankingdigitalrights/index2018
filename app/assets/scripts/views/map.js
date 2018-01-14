var Backbone = require('backbone');
var Datamap = require('datamaps');
var d3 = require('d3');
var d3GeoProjection = require("d3-geo-projection")(d3);


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
                  'red': '#ED1B46',
                  defaultFill: '#E7E6E6' 
                },
                data: {
                   "USA":{
                      "companies":[
                         {
                            "name":"Apple",
                            "type":"internet"
                         },
                         {
                            "name":"Facebook",
                            "type":"internet"
                         },
                         {
                            "name":"Google",
                            "type":"internet"
                         },
                         {
                            "name":"Microsoft",
                            "type":"internet"
                         },
                         {
                            "name":"Twitter",
                            "type":"internet"
                         },
                         {
                            "name":"Yahoo",
                            "type":"internet"
                         },
                         {
                            "name":"AT&T",
                            "type":"telco"
                         }
                      ],
                      "fillColor":"#5DA0CA"
                   },
                   "MEX":{
                      "companies":[
                         {
                            "name":"América Móvil",
                            "type":"telco"
                         }
                      ],
                      "fillColor":"#5DA0CA"
                   },
                   "GBR":{
                      "companies":[
                         {
                            "name":"Vodafone",
                            "type":"telco"
                         }
                      ],
                      "fillColor":"#5DA0CA"
                   },
                   "FRA":{
                      "companies":[
                         {
                            "name":"Orange",
                            "type":"telco"
                         }
                      ],
                      "fillColor":"#5DA0CA"
                   },
                   "ESP":{
                      "companies":[
                         {
                            "name":"Telefónica",
                            "type":"telco"
                         }
                      ],
                      "fillColor":"#5DA0CA"
                   },
                   "RUS":{
                      "companies":[
                         {
                            "name":"Yandex",
                            "type":"internet"
                         },
                         {
                            "name":"Mail.ru",
                            "type":"internet"
                         }
                      ],
                      "fillColor":"#5DA0CA"
                   },
                   "CHN":{
                      "companies":[
                         {
                            "name":"Tencent",
                            "type":"internet"
                         },
                         {
                            "name":"Baidu",
                            "type":"internet"
                         }
                      ],
                      "fillColor":"#5DA0CA"
                   },
                   "KOR":{
                      "companies":[
                         {
                            "name":"Kakao",
                            "type":"internet"
                         },
                         {
                            "name":"Samsung",
                            "type":"internet"
                         }
                      ],
                      "fillColor":"#5DA0CA"
                   },
                   "MYS":{
                      "companies":[
                         {
                            "name":"Axiata",
                            "type":"telco"
                         }
                      ],
                      "fillColor":"#5DA0CA"
                   },
                   "IND":{
                      "companies":[
                         {
                            "name":"Bharti Airtel",
                            "type":"telco"
                         }
                      ],
                      "fillColor":"#5DA0CA"
                   },
                   "QAT":{
                      "companies":[
                         {
                            "name":"Ooredoo",
                            "type":"telco"
                         }
                      ],
                      "fillColor":"#5DA0CA"
                   },
                   "ARE":{
                      "companies":[
                         {
                            "name":"Etisalat",
                            "type":"telco"
                         }
                      ],
                      "fillColor":"#5DA0CA"
                   },
                   "ZAF":{
                      "companies":[
                         {
                            "name":"MTN",
                            "type":"telco"
                         }
                      ],
                      "fillColor":"#5DA0CA"
                   }
                },
                geographyConfig: {
                    borderColor: '#DEDEDE',
                    highlightBorderWidth: 1,
                    // don't change color on mouse hover
                    highlightFillColor: function(geo) {
                        return geo['fillColor'] || '#E7E6E6';
                    },
                    // only change border
                    highlightBorderColor: '#B7B7B7',
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

        $.getJSON("bubbles.json", function(points) {
          map.bubbles(points, {
            borderWidth: 0,
            popupOnHover: true,
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
              layer.append("text")
              .attr("x", coords[0] - datum.position) //this could use a little massaging
              .attr("y", coords[1] + 5)
              .style("font-size", '14px')
              .style("fill", "#000")
              .text(datum.company);

              layer.append("line")          // attach a line
              .style("stroke", datum.lineColor)  // colour the line
              .attr("x1", coords[0])     // x position of the first end of the line
              .attr("y1", coords[1])      // y position of the first end of the line
              .attr("x2", 250)     // x position of the second end of the line
              .attr("y2", 170);    // y position of the second end of the line

            return "bar";
          });
        }

        //register the plugin to datamaps
        map.addPlugin('bombLabels', handleBombLabels);

/*                
        map.bubbles(bombs, {
          popupTemplate:function (geography, data) { 
            return ['<div class="hoverinfo"><strong>' +  data.name + '</strong>',
              '<br/>Payload: ' +  data.yeild + ' kilotons',
              '<br/>Country: ' +  data.country + '',
              '<br/>Date: ' +  data.date + '',
              '</div>'].join('');
          }
        });

        function handleBombLabels ( layer, data, options ) {
          var self = this;
          options = options || {};

          d3.selectAll(".datamaps-bubble").attr("data-foo", function(datum) {
            //convert lat/lng into x/y
            var coords = self.latLngToXY(datum.latitude, datum.longitude)

              layer.append("text")
              .attr("x", coords[0] - 10) //this could use a little massaging
              .attr("y", coords[1])
              .style("font-size", (options.fontSize || 10) + 'px')
              .style("font-family", options.fontFamily || "Verdana")
              .style("fill", options.labelColor || "#000")
              .text( datum[options.labelKey || 'fillKey']);
            return "bar";
          });
        }

        //register the plugin to datamaps
        map.addPlugin('bombLabels', handleBombLabels);
        
        //call the plugin. The 2nd param is options and it will be sent as `options` to the plugin function.
        //Feel free to add to these options, change them, etc
        map.bombLabels(bombs, {fontSize: 12});
*/


        window.addEventListener('resize', function() {
            map.resize();
        });
    },
});