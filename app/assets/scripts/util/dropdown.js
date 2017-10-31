var $ = require('jquery');
var Tether = require('tether');

module.exports = function () {
  var $body = $('body');
  // Regular dropdowns
  $('.dropdown--trigger').each(function () {
    var $this = $(this);
    var $dropdown = $('#' + $this.data('dropdown'));
    var tether = null;
    var isOver;
    var isActive = false;
    var direction = $this.data('reverse') ? 'right' : 'left';
    var isThrottled = false;

    function activate () {
      isThrottled = true;
      window.setTimeout(function () {
        isThrottled = false;
      }, 20);

      tether = tether || new Tether({
        element: $dropdown[0],
        target: $this[0],
        attachment: 'top ' + direction,
        targetAttachment: 'bottom ' + direction
      });

      $dropdown.css({ visibility: 'visible', 'z-index': 1000 });
      isActive = true;

      $body.one('click', function () {
        if (isActive) {
          off();
        }
      });
    }

    function off () {
      // Prevent this from running directly after an activate event.
      // Some browsers call both mouseenter and click on a tap event.
      if (isThrottled) {
        return;
      }
      $dropdown.css({ visibility: 'hidden', 'z-index': 0 });
      isActive = false;
    }

    $dropdown.on('mouseenter', function () {
      isOver = true;
    }).on('mouseleave', function () {
      isOver = false;
      if (isActive) {
        off();
      }
    });

    $this.on('mouseenter', function () {
      if (isActive) {
        off();
      } else {
        activate();
      }
      return false;
    })

    .on('mouseleave', function () {
      window.setTimeout(function () {
        if (!isOver) {
          off();
        }
      }, 50);
    });
  });

  // Mobile dropdowns
  $('.dropdown--trigger_mobile').each(function ($el) {
    var $this = $(this);
    var $dropdown = $('#' + $this.data('dropdown'));
    var open = false;
    function toggle () {
      if (open) {
        $this.removeClass('expanded');
        $dropdown.slideUp(200, function () {
          $dropdown.hide();
        });
      } else {
        $this.addClass('expanded');
        $dropdown.slideDown(200).show();
      }
      open = !open;
    }
    $this.on('click', function (e) {
      toggle();
      return false;
    });
  });
};
