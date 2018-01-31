var queue = require('queue-async');
var $ = require('jquery');

var Compare = require('./collections/compare');
var CompareView = require('./views/compare');

module.exports = function() {

    var compare = new Compare();

    var compareView = new CompareView({
        collection: compare,
    });

    compare.fetch({
        success: function () {
            compareView.render();
        }
    });
}