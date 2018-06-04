var baseUrl;

switch (process.env.NODE_ENV) {
  case "development":
    baseUrl = "http://localhost:3000";
    break;
  case "stage":
    baseUrl = "https://rankingdigitalrights.org/index2018-stg";
    break;
  default:
    baseUrl = "https://rankingdigitalrights.org/index2018";
    break;
}
module.exports = baseUrl;
