const express = require('express');
require('dotenv-extended').load();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const passport = require('passport');
const mongoose = require("mongoose");
const app = express();
const Models = require("./models");

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
const Genres = Models.Genre;


require('./passport');

/*mongoose.connect('mongodb://localhost:27017/myFlixDB',
 { 
   useNewUrlParser: true, 
   useUnifiedTopology: true 
  });*/
/*mongoose.connect('mongodb+srv://Springpopthesturg:Bigolepp123@myflixdb.7sr51.mongodb.net/MyFlixDB?retryWrites=true&w=majority',
{ 
 useNewUrlParser: true, 
 useUnifiedTopology: true 
});*/
//mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, () => console.log("MongoDB Connected"))

/* const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Springpopthesturg:Bigolepp123@cluster0.7sr51.mongodb.net/my-first-package?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
}); */

mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("Connection Successful"))
  .catch((err) => console.log(err));

const cors = require('cors');
app.use(cors());
//Imports auth.js for logins

const { check, validationResult } = require('express-validator');
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors());

const auth = require("./auth")(app);
//GET Requests

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

//Return all movies
/*app.get('/movies', passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
}
);*/
/**
 * Get all movies
 * @method GET
 * @param {string} endpoint - endpoint to fetch movies. "url/movies"
 * @returns {object} - returns the movie object
  * @requires authentication JWT
 */
app.get("/movies", passport.authenticate('jwt', { session: false }) ,function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});

//Return Movies of specified genre
/**
 * Get movies by genre
 * @method GET
 * @param {string} endpoint - endpoint - fetch movies by genre
 * @param {string} Title - is used to get specific movie "url/movies/genres/:genreid"
 * @returns {object} - returns the movie with specific title
 * @requires authentication JWT
 */
app.get('/movies/genres/:genreid', passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.find({ genreid: req.params.genreid })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Return a single title of movie
/**
 * Get movies by title
 * @method GET
 * @param {string} endpoint - endpoint - fetch movies by title
 * @param {string} Title - is used to get specific movie "url/movies/:title"
 * @returns {object} - returns the movie with specific title
 * @requires authentication JWT
 */
app.get('/movies/:title', passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Returns list of Directors
/**
 * Get all directors
 * @method GET
 * @param {string} endpoint - endpoint to fetch directors. "url/directors"
 * @returns {object} - returns the directors object
 */
app.get('/directors', passport.authenticate("jwt", { session: false }), (req, res) => {
  Directors.find({ director: req.params.director })
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Returns single director
/**
 * Get director by name
 * @method GET
 * @param {string} endpoint - endpoint - fetch director by name
 * @param {string} Name - is used to get specific director "url/directors/:Name"
 * @returns {object} - returns a specific director
 */
app.get('/directors/:Name', passport.authenticate("jwt", { session: false }), (req, res) => {
  Directors.findOne({ Name: req.params.Name })
    .then((directors) => {
      res.status(200).json(directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Get genres 
/**
 * Get all genres
 * @method GET
 * @param {string} endpoint - endpoint to fetch genres. "url/genres"
 * @returns {object} - returns the genre object
 * @requires authentication JWT
 */
app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.find()
    .then((genre) => {
      res.status(200).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).sned('Error: ' + err);
    });
});

// Get genres by name 
/**
 * Get genre by name
 * @method GET
 * @param {string} endpoint - endpoint - fetch genre by name
 * @param {string} Name - is used to get specific genre "url/genres/:Name"
 * @returns {object} - returns a specific genre
 * @requires authentication JWT
 */
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
      res.status(200).json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return user by username
/**
 * Get user by username
 * @method GET
 * @param {string} endpoint - endpoint - fetch user by username
 * @param {string} Username - is used to get specific user "url/users/:Username"
 * @returns {object} - returns a specific user
 * @requires authentication JWT
 */
app.get('/users/:Username', passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('error:' + err)
    });
});

//Return movie favorites by name
/**
 * Get list of favorite movies
 * @method GET
 * @param {string} Username - endpoint to fetch users favorites by name
 * @returns {object} - containing a single mvoie from favoritemovies 
 * @requires authentication JWT
 */
app.get('/users/:Username/favorites/:movie', passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOne({ FavoriteMovies: req.params.FavoriteMovies })
    .then((favMov) => {
      res.json(favMov);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('error:' + err)
    });
});

//DELETE requests

//delete user
/**
  * Delete user by username
  * @method DELETE
  * @param {string} endpoint - endpoint - delete user by username
  * @param {string} Username - is used to delete specific user "url/users/:Username"
  * @returns {string} success/error message
  * @requires authentication JWT
  */
app.delete('/users/:Username', passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('error: ' + err);
    });
});
//delete from users favorites
/**
 * Delete movie from favorites
 * @method DELETE
 * @param {string} endpoint - endpoint to remove movies from favorites
 * @param {string} Title Username - both are required
 * @returns {string} - returns success/error message
 * @requires authentication JWT
 */
app.delete('/users/:Username/favorites/:MovieID', passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    { $pull: { FavoriteMovies: req.params.MovieID } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
});


// POST Requests

//create account
/**
 * Add user
 * @method POST
 * @param {string} endpoint - endpoint to add user. "url/users"
 * @param {string} Username - choosen by user
 * @param {string} Password - user's password
 * @param {string} Email - user's e-mail adress
 * @param {string} Birthday - user's birthday
 * @returns {object} - new user
 * @requires auth no authentication - public
 */
app.post('/users', (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password);
  Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.Username + ' already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) => { res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Adds movies to users favorites
/**
 * Add movie to favorites
 * @method POST
 * @param {string} endpoint - endpoint to add movies to favorites
 * @param {string} Title, Username - both are required
 * @returns {string} - returns success/error message
 * @requires authentication JWT
 */
app.post('/users/:Username/favorites/:MovieID', passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    { $push: { FavoriteMovies: req.params.MovieID } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

app.get('/documentation.html',/* passport.authenticate("jwt", { session: false }),*/(req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.use(express.static('public'));

//Update requests

//update username
/**
  * Update user by username
  * @method PUT
  * @param {string} endpoint - endpoint to add user. "url/users/:Usename"
  * @param {string} Username - required
  * @param {string} Password - user's new password
  * @param {string} Email - user's new e-mail adress
  * @param {string} Birthday - user's new birthday
  * @returns {string} - returns success/error message
  * @requires authentication JWT
  */
app.put('/users/:Username',
  [
    check('Username', 'Username is required!').isLength({
      min: 5
    }),
    check('Username', 'Username contains non alphanumerical characters!').isAlphanumeric(),
    //check('Password', 'Password is required!').not().isEmpty(),
    //check('Email', 'Email adress is not valid!').isEmail()
  ],
  passport.authenticate('jwt', { session: false }), (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        errors: errors.array()
      });
    }
    Users.findOneAndUpdate({
      Username: req.params.Username
    }, {
      $set: {
        FirstName: req.body.FirstName,
        LastName: req.body.LastName,
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birth: req.body.Birth
      }
    }, {
      new: true
    }, //this line makes sure that updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      });
  });

//Error response

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listen response

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});