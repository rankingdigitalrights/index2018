var $ = require('jquery');
var _ = require('underscore');

var Backbone = require('backbone');
var Barchart = require('./views/barchart');
var baseurl = require('./util/base-url');
var barsort = require('./util/barsort');
var template = require('./templates/item.tpl');

var Overview = require('./collections/overview');
var Indicator = require('./collections/single-indicator');
var Indicators = require('./collections/indicators-overview');
var IndicatorView = require('./views/indicator');

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
        var $indicators = indicators.findWhere({indicator: indicatorName});
        var $scores = $indicators.attributes.scores;
        var $data = [];
        $.each( $scores, function( key, value ) {
            $data.push({name:key,val:value});
        });
        $data.sort(barsort);

        var barchart = new Barchart({
            width: $('#indicator--overview_chart').width(),
            height: 340,
            data: $data,
        });
        barchart.render('#indicator--overview_chart');
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
