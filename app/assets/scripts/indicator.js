var $ = require('jquery');
var _ = require('underscore');

var Backbone = require('backbone');
var Barchart = require('./views/indicators-barchart');
var baseurl = require('./util/base-url');
var barsort = require('./util/barsort');
var template = require('./templates/item.tpl');
var template_bar_chart = require('./templates/indicator-bar-chart.tpl');

var Overview = require('./collections/overview');
var Indicator = require('./collections/single-indicator');
var Indicators = require('./collections/indicators-overview');
var IndicatorView = require('./views/indicator');

var telco = require('./util/telco');

module.exports = function generateIndicator (indicatorName) {

    var overview = new Overview();
    var indicator = new Indicator({indicator: indicatorName});
    var indicators = new Indicators();

    indicators.fetch({
        success: function () {
            success(indicatorName);
        }
    });

    indicator.fetch({
        success: function(){
            var $indicators = indicators.findWhere({indicator: indicatorName});
            var $scores = $indicators.attributes.scores;
            indicator.scores = $scores;
            var indicatorView = new IndicatorView({
                collection: indicator
            });
            indicatorView.render();
        }
    });

    overview.fetch({
        success: function(){
            successOverview();
        }
    })

    var success = function (indicatorName) {

        var $indicator_type = indicatorName.charAt(0);
        var $indicators = indicators.findWhere({indicator: indicatorName});
        var $scores = $indicators.attributes.scores;
        var $data = [];
        $.each( $scores, function( key, value ) {
            $data.push({name:key,val:value});
        });
        $data.sort(barsort);

        var $telco = [];
        var $internet = [];
        $data.forEach(function (i, d) {
            var control = $.inArray(i.name, telco);
            if(control == '-1')
            {
                $internet.push(i);
            }
            else
            {
                $telco.push(i);
            }
        });

        // console.info($internet.sort(barsort));

        var $exclude_i = ["f9", "f10"];
        var $exc_i = $.inArray(indicatorName, $exclude_i);
        var $display_i = true;
        if( $exc_i == '-1' ) {
            $display_i = false;
        }

        var $exclude_t = ["p9", "p16", "p17"]; 
        var $exc_t = $.inArray(indicatorName, $exclude_t);
        var $display_t = true;
        if( $exc_t == '-1' ) {
            $display_t = false;
        }
        
        $("#indicator--overview_chart").append(
            template_bar_chart({indicator_type:$indicator_type, display_i:$display_i, display_t:$display_t})
        );

        if($indicator_type == 'g')
        {
            var barchart = new Barchart({
                width: $('#bar--container').width(),
                height: 340,
                data: $data,
            });
            barchart.render('#bar--container');
        }
        else 
        {
            setTimeout( function(){ 
                if(!$display_i){
                    var barchart = new Barchart({
                        width: $('#bar--container--internet').width(),
                        height: 340,
                        data: $internet.sort(barsort),
                    });
                    barchart.render('#bar--container--internet');
                }

                if(!$display_t){
                    var barchart = new Barchart({
                        width: $('#bar--container--telco').width(),
                        height: 340,
                        data: $telco.sort(barsort),
                    });
                    barchart.render('#bar--container--telco');
                } 
            }, 1000);

            
        }
    };

    var successOverview = function(){
        var $telco = [];
        var $internet = [];
        overview.forEach(function(item){
            if(item.attributes.telco){
                $telco.push(item);
            } else {
                $internet.push(item);
            }
        });
        $telco.forEach(function (item) {
            $("#company--list").append(
                template({display:item.attributes.display, id:item.attributes.id, type:item.attributes.telco})
            );
        });
        $internet.forEach(function (item) {
            $("#company--list").append(
                template({display:item.attributes.display, id:item.attributes.id, type:item.attributes.telco})
            );
        });
    }

}
