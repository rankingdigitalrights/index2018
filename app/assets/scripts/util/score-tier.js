module.exports = function (score) {
  if (isNaN(score)) {
    return 'na';
  }
  return Math.ceil(score / 34);
};
