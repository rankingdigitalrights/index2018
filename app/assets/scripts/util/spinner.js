var Spinner = require('spin');
var opts = {
  lines: 5,
  length: 0,
  width: 22,
  radius: 17,
  scale: 1,
  corners: 1,
  color: '#000',
  opacity: 0.25,
  rotate: 0,
  direction: 1,
  speed: 1,
  trail: 100,
  fps: 20,
  zIndex: 2e9,
  className: 'spinner',
  top: '50%',
  left: '50%',
  shadow: false,
  hwaccel: false,
  position: 'absolute'
};
module.exports = new Spinner(opts);
