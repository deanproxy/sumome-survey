'use strict';

const bcrypt = require('bcrypt');

class Password {

  static confirm(password, hash) {
    return bcrypt.compareSync(password, hash);
  }

  static hash(password) {
    const SALT = 10;
    return bcrypt.hashSync(password, SALT);
  }

}

module.exports = Password;

