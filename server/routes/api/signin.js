const User = require('../../models/User');

module.exports = (app) => {
  /*
   * Signup method
   */
  app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    var {
      firstName,
      lastName,
      email,
      password
    } = body;

    if (!firstName) {
      res.end({
        success: false,
        message: 'Error: first name can not be blank.'
      })
    }

    if (!lastName) {
      res.end({
        success: false,
        message: 'Error: last name can not be blank.'
      })
    }

    if (!email) {
      res.end({
        success: false,
        message: 'Error: email can not be blank.'
      })
    }

    if (!password) {
      res.end({
        success: false,
        message: 'Error: password can not be blank.'
      })
    }

    email = email.toLowerCase();

    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        res.end({
          success: false,
          message: 'Error: Server error.'
        })
      } else if (previousUsers.length > 0) {
        res.end({
          success: false,
          message: 'Error: User already exists.'
        })
      }

      let newUser = new User();
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.email = email;
      newUser.password = newUser.generateHash(password);

      newUser.save((err, user) => {
        if (err) {
          res.end({
            success: false,
            message: 'Error: error saving new user.'
          })
        }
        res.end({
          success: true,
          message: 'User signed up.'
        })
      })
    })
  })
};
