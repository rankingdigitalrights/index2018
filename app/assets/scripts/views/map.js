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
                  defaultFill: '#E7E6E6' 
                },
                data: {
                  'USA':{companies:
                    [
                    {name:'Apple', type:'internet'}, 
                    {name:'Facebook', type:'internet'},
                    {name:'Google', type:'internet'},
                    {name:'Microsoft', type:'internet'},
                    {name:'Twitter', type:'internet'},
                    {name:'Yahoo', type:'internet'},
                    {name:'AT&T', type:'telco'}
                    ], 
                    fillColor:'#5DA0CA'},
                  'MEX':{companies:
                    [
                    {name:'América Móvil', type:'telco'}
                    ], 
                    fillColor:'#5DA0CA'},
                  'GBR':{companies:
                    [
                    {name:'Vodafone', type:'telco'}
                    ], 
                    fillColor:'#5DA0CA'},
                  'FRA':{companies:
                    [
                    {name:'Orange', type:'telco'}
                    ], 
                    fillColor:'#5DA0CA'},
                  'ESP':{companies:
                    [
                    {name:'Telefónica', type:'telco'}
                    ], 
                    fillColor:'#5DA0CA'},
                  'RUS':{companies:
                    [
                    {name:'Yandex', type:'internet'}, 
                    {name:'Mail.ru', type:'internet'}
                    ], 
                    fillColor:'#5DA0CA'},
                  'CHN':{companies:
                    [
                    {name:'Tencent', type:'internet'}, 
                    {name:'Baidu', type:'internet'}
                    ], 
                    fillColor:'#5DA0CA'},
                  'KOR':{companies:
                    [
                    {name:'Kakao', type:'internet'}, 
                    {name:'Samsung', type:'internet'}
                    ], 
                    fillColor:'#5DA0CA'},
                  'MYS':{companies:
                    [
                    {name:'Axiata', type:'telco'}
                    ], 
                    fillColor:'#5DA0CA'},
                  'IND':{companies:
                    [
                    {name:'Bharti Airtel', type:'telco'}
                    ], 
                    fillColor:'#5DA0CA'},
                  'QAT':{companies:
                    [
                    {name:'Ooredoo', type:'telco'}
                    ], 
                    fillColor:'#5DA0CA'},
                  'ARE':{companies:
                    [
                    {name:'Etisalat', type:'telco'}
                    ], 
                    fillColor:'#5DA0CA'},
                  'ZAF':{companies:
                    [
                    {name:'MTN', type:'telco'}
                    ], 
                    fillColor:'#5DA0CA'},
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

        window.addEventListener('resize', function() {
            map.resize();
        });
    },
});