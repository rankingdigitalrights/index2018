module.exports = function (a, b) {
  a.t = +a.t;
  b.t = +b.t;
  if (a.t === b.t) {
    return a.service < b.service ? -1
      : a.service > b.service ? 1 : 0;
  } else {
    return a.t > b.t ? -1 : 1;
  }
};
