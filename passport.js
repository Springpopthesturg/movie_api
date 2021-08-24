const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; 
const passportJWT = require('passport-jwt');

const Models = require("./models");

const Movies = Models.Movie;
const Users = Models.User;

const JWTStrategy = passportJWT.Strategy;//jwt strategy assign to a variable
const ExtractJWT = passportJWT.ExtractJwt; // extract method from header assign to a variable
const { check, validationResult } = require('express-validator');



passport.use(
    new LocalStrategy(
      {
    usernameField: 'Username',
    passwordField: 'Password',
  }, 
  (username, password, callback) => {
   console.log(username + '  ' + password);
   console.log('====username', username)

   Users.findOne(
      { Username: username} /*, password: password }*/, 
      (error, user) => {
      if (error) {
        console.error(error);
        return callback(error);
      }
      if (!user) {
        console.log('incorrect username');
        return callback(null, false, {message: 'Incorrect username or password.'});
      }
      if (!user.validatePassword(password)) {
        console.log('incorrect password');
        return callback(null, false, {message: 'Incorrect password.'});
      }
      console.log('finished');
      return callback(null, user);
     },
     );
    },
  ),
);
      passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'
  }, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
      .then((user) => {
        return callback(null, user);
      })
      .catch((error) => {
        return callback(error)
      });
  }));