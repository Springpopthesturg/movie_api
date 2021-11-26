const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // Local passport file

let generateJWTToken = (user) => {
  return jwt.sign(user, 'your_jwt_secret', {
    subject: user.Username, // This is the username encoding in the JWT
    expiresIn: '7d', // This says that the token will expire in 7 days
  });
}

/**
  * POST login.
  * @param {*} router
  * @returns {object} Token, User
  */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    console.log('====login', req.body)
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not working',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}