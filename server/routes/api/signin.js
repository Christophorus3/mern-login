const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {
  /*
   * Signup method
   */
  app.post('/api/account/signup', (req, res, next) => {
    const { body } = req;
    let {
      firstName,
      lastName,
      email,
      password
    } = body;

    email = email.toLowerCase();

    if (!firstName) {
      return res.send({
        success: false,
        message: 'Error: first name can not be blank.'
      })
    }

    if (!lastName) {
      return res.send({
        success: false,
        message: 'Error: last name can not be blank.'
      })
    }

    if (!email) {
      return res.send({
        success: false,
        message: 'Error: email can not be blank.'
      })
    }

    if (!password) {
      return res.send({
        success: false,
        message: 'Error: password can not be blank.'
      })
    }

    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error.'
        })
      } else if (previousUsers.length > 0) {
        return res.send({
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
          return res.send({
            success: false,
            message: 'Error: error saving new user.'
          })
        }
        return res.send({
          success: true,
          message: 'User signed up.'
        })
      })
    })
  });

  app.post('/api/account/login', (req, res, next) => {
    const {body} = req;
    let {
      email,
      password
    } = body;

    email = email.toLowerCase();

    if (!email) {
      return res.send({
        success: false,
        message: 'Error: email can not be blank.'
      })
    }

    if (!password) {
      return res.send({
        success: false,
        message: 'Error: password can not be blank.'
      })
    }

    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: server error."
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: "Error: Invalid user email."
        });
      }

      let user = users[0];

      console.log(user);

      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: "Error: Invalid password."
        });
      }

      let userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, session) => {
        if (err) {
          return res.send({
            success: false,
            message: "Error: server error."
          });
        }

        return res.send({
          success: true,
          message: "User login valid!",
          token: session._id
        })
      })
    })
  });

  app.get('/api/account/verify', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    console.log(token);

    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error."
        })
      }
      console.log(sessions);

      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: "Error: No valid session."
        })
      } else {
        return res.send({
          success: true,
          message: "Success: This session is valid."
        })
      }
    })
  });

  app.get('/api/account/logout', (req, res, next) => {
    const { query } = req;
    const { token } = query;

    UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {
      $set: {isDeleted: true}
    }, null, (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          message: "Error: Server error."
        })
      }

      return res.send({
        success: true,
        message: "Success: This session is ended. User logged out."
      })
    })
  });
};
