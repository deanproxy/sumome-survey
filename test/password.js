const assert = require('assert');
const Password = require('../helpers/password');

describe('Password', function() {
  const password = 'muffins';
  const SALT = 10;

  it('should hash a password', done => {
    let hash = Password.hash(password)
    assert.equal(Password.confirm(password, hash), true);
    assert.equal(Password.confirm('meowmix', hash), false);
    done();
  });

  it("should compare passwords properly", done => {
    let hash = Password.hash(password);
    assert.equal(Password.confirm(password, hash), true);
    assert.equal(Password.confirm('meowmix', hash), false);
    done();
  });
});

