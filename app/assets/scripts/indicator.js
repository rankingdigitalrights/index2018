var $ = require('jquery');
var _ = require('underscore');

var Backbone = require('backbone');
var Barchart = require('./views/indicators-barchart');
var baseurl = require('./util/base-url');
var barsort = require('./util/barsort');
var template = require('./templates/item.tpl');

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

        if($indicator_type == 'g')
        {
            var barchart = new Barchart({
                width: $('#indicator--overview_chart').width(),
                height: 340,
                data: $data,
            });
            barchart.render('#indicator--overview_chart');
        }
        else 
        {
            var barchart = new Barchart({
                width: $('#indicator--overview_chart').width()/2,
                height: 340,
                data: $internet,
            });
            barchart.render('#indicator--overview_chart');

            var barchart = new Barchart({
                width: $('#indicator--overview_chart').width()/2,
                height: 340,
                data: $telco,
            });
            barchart.render('#indicator--overview_chart'); 
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
