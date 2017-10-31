module.exports = function (a, b) {
  a.val = +a.val;
  b.val = +b.val;
  if (a.val === b.val) {
    return a.name < b.name ? -1
      : a.name > b.name ? 1 : 0;
  } else {
    return a.val > b.val ? -1 : 1;
  }
};
