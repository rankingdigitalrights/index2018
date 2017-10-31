module.exports = {
  'c1.b': [{
    'text': 'Executive-level comment: a senior executive has made statements in a prominent venue.',
    'score': 100
  }, {
    'text': 'Managerial-level comment: company managers or spokesperson(s) have made statements in a prominent venue.',
    'score': 50
  }, {
    'text': 'no/insufficient evidence: company representatives have not made related statements in a prominent venue.',
    'score': 0
  }],

  'f10': [{
    'text': 'The company discloses that it does not prioritize or degrade the delivery of content.',
    'score': 100
  }, {
    'text': 'The company discloses that it prioritizes or degrades content delivery and the purpose of doing so.',
    'score': 50
  }, {
    'text': 'The company discloses that it prioritizes or degrades content delivery but doesn’t explain the purpose.',
    'score': 25
  }, {
    'text': 'The company does not disclose information about prioritizing or degrading the delivery of content.',
    'score': 0
  }],

  'f11': [{
    'text': 'no.',
    'score': 100
  }, {
    'text': 'yes.',
    'score': 0
  }, {
    'text': 'partial.',
    'score': 50
  }],

  'p13': [{
    'text': 'Private user content is encrypted by default; the company itself has no access.',
    'score': 100
  }, {
    'text': 'The company offers a built-in option to encrypt private content.',
    'score': 67
  }, {
    'text': 'The company’s terms or other policies explain that the user may deploy third party encryption technologies.',
    'score': 33
  }, {
    'text': 'No disclosure.',
    'score': 0
  }, {
    'text': 'The company’s terms or other policies prohibit encryption.',
    'score': 0
  }]
};
