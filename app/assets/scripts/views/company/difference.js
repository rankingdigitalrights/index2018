var Backbone = require('backbone');
var _ = require('underscore');
var $ = require('jquery');

module.exports = Backbone.View.extend({

    initialize: function (options) {
        this.collection = options.collection;
        this.companyName = options.companyName;
    },

    render: function (el) {

        var collection = this.collection;
        var companyName = this.companyName;

        var difference = collection.findWhere({id: companyName});

        // Overall score
        var total_2018 = difference.attributes.total_2018;
        $('#total_2018').text(Math.round(total_2018) + '%');
        $('#total_score').text(Math.round(total_2018) + '%');

        // Total difference
        var total_difference = Math.round(difference.attributes.total_difference);

        $('#total_difference span').text(
            Math.abs(Math.round(total_difference))
        );
        if(total_difference == 0) $('#total_difference .fa').removeClass();
        if(total_difference < 0) $('#total_difference .fa').removeClass().addClass('fa fa-chevron-down down-arrow-red');

        // Governance
        var governance_2017 = difference.attributes.governance_2017;
        $('#governance_2017').text(Math.round(governance_2017) + '%');
        var governance_2018 = difference.attributes.governance_2018;
        $('#governance_2018').text(Math.round(governance_2018) + '%');
        var governance_difference = Math.round(difference.attributes.governance_difference);
        $('#governance_difference span').text(
            Math.abs(Math.round(governance_difference))
        );
        if(governance_difference == 0) $('#governance_difference .fa').removeClass();
        if(governance_difference < 0) $('#governance_difference .fa').removeClass().addClass('fa fa-chevron-down down-arrow-red');

        // Privacy
        var privacy_2017 = difference.attributes.privacy_2017;
        $('#privacy_2017').text(Math.round(privacy_2017) + '%');
        var privacy_2018 = difference.attributes.privacy_2018;
        $('#privacy_2018').text(Math.round(privacy_2018) + '%');
        var privacy_difference = Math.round(difference.attributes.privacy_difference);
        $('#privacy_difference span').text(
            Math.abs(Math.round(privacy_difference))
        );
        if(privacy_difference == 0) $('#privacy_difference .fa').removeClass();
        if(privacy_difference < 0) $('#privacy_difference .fa').removeClass().addClass('fa fa-chevron-down down-arrow-red');

        // Freedom of expression
        var freedom_of_expression_2017 = difference.attributes.freedom_of_expression_2017;
        $('#freedom_of_expression_2017').text(Math.round(freedom_of_expression_2017) + '%');
        var freedom_of_expression_2018 = difference.attributes.freedom_of_expression_2018;
        $('#freedom_of_expression_2018').text(Math.round(freedom_of_expression_2018) + '%');
        var freedom_of_expression_difference = Math.round(difference.attributes.freedom_of_expression_difference);
        $('#freedom_of_expression_difference span').text(
            Math.abs(Math.round(freedom_of_expression_difference))
        );
        if(freedom_of_expression_difference == 0) $('#freedom_of_expression_difference .fa').removeClass();
        if(freedom_of_expression_difference < 0) $('#freedom_of_expression_difference .fa').removeClass().addClass('fa fa-chevron-down down-arrow-red');

    },

});
