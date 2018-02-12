var $ = require('jquery');
var _ = require('underscore');
var renderCompanyPage = require('./company');
var renderIndicatorPage = require('./indicator');
var renderIndicatorsPage = require('./indicators');
var renderCategoryPage = require('./category');
var renderServicePage = require('./services');
var renderIndexPage = require('./index');
var renderComparePage = require('./compare')
var renderCompaniesPage = require('./companies');

var baseurl = require('./util/base-url');
var dropdownFn = require('./util/dropdown');

require('typeahead.js/dist/typeahead.jquery.min.js');
var Bloodhound = require('typeahead.js/dist/bloodhound.min.js');

var resize = require('./util/resize');
resize.start();

(function () {
  // Determine which page to load.
  var $site = $('#site-canvas');
  var type = $site.data('type');
  var dataId = $site.data('id');
  if (type === 'company') {
    renderCompanyPage(dataId);
  }
  else if (type === 'indicator') {
    renderIndicatorPage(dataId);
  }
  else if (type === 'indicators') {
    renderIndicatorsPage();
  }
  else if (type === 'category') {
    renderCategoryPage(dataId);
  }
  else if (type === 'index') {
    renderIndexPage();
  }
  // Companies page
  else if (type === 'companies') {
    renderCompaniesPage();
  }
  // Service page
  else if (type === 'service') {
    renderServicePage(dataId);
  }
  // Compare page
  else if (type === 'compare') {
    renderComparePage();
  }

})();

// Animate hamburger menu
(function () {
  var $hamburger = $('.bttn--hamburger');
  var $menu = $('.nav--mobile');
  $hamburger.on('click', function (e) {
    if ($hamburger.hasClass('active')) {
      $hamburger.removeClass('active');
      $menu.css('margin-top', 0).animate({ 'margin-top': -$menu.outerHeight(true) }, 200);
    } else {
      $hamburger.addClass('active');
      $menu.addClass('active').css('margin-top', -$menu.outerHeight(true)).animate({ 'margin-top': 0 }, 200);
    }
  });

  var breakpoint = 768;
  resize.attach('hamburger', $('body'));
  resize.on('resize:hamburger', function (dimensions) {
    if (dimensions.width >= 768 && $hamburger.hasClass('active')) {
      $hamburger.removeClass('active');
      $menu.css('margin-top', 0).animate({ 'margin-top': -$menu.outerHeight(true) }, 200);
    }
  });
})();

// Take care of the dropdowns
dropdownFn();

// And the typeahead
(function () {

  var $container = $('#search--data');

  var data = {
    categories: [],
    companies: [],
    indicators: []
  };

  _.each(data, function (d, key) {
    var $data = $container.find('#search--data_' + key).children();
    $data.each(function () {
      d.push($(this).text());
    });

    data[key] = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.whitespace,
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: d
    });
  });

  $('.supersearch').typeahead({
    hint: true,
    minLength: 1,
    highlight: true
  }, {
      name: 'categories',
      source: data.categories
    }, {
      name: 'companies',
      source: data.companies
    }, {
      name: 'indicators',
      source: data.indicators
    });

  $('.twitter-typeahead').bind('typeahead:select', function (ev, suggestion) {
    _.each(data, function (d, key) {

      if (d.local.indexOf(suggestion) !== -1) {
        var url = baseurl + '/' + key + '/'

        if (suggestion === 'Freedom Of Expression') {
          suggestion = 'freedom-of-expression';
        } else if (suggestion === 'América Móvil') {
          suggestion = 'americamovil';
        } else {
          suggestion = suggestion.toLowerCase().replace('.', '')
            .replace('&', '').replace(' ', '');
        }
        window.location.href = url + suggestion;
      }
    });
  });

})();

$(window).load(function () {

  // scroll to indicator
  var $root = $('html,body');
  var ancloc = window.location.hash;
  if (ancloc != '') {
    $root.animate({
      scrollTop: $(ancloc).position().top,
    }, 2000);
  }

  // share feature
  document.getElementById('linkToCopy').innerHTML = window.location;
  $('#CopyToClipboard').click(function () {
    document.getElementById('linkToCopy').select();
    document.execCommand('copy');
  });
});