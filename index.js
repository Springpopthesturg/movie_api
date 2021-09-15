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

mongoose.connect( process.env.CONNECTION_URI , {useNewUrlParser: true, useUnifiedTopology: true}).then(() => console.log("Connection Successful"))
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
app.get('/movies', passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
}
);

//Return Movies of specified genre
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
app.get('/genres',passport.authenticate('jwt', { session:false }), (req, res) => {
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
app.get('/genres/:Name',passport.authenticate('jwt',{ session:false }), (req, res) => {
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
app.delete('/users/:Username/movies/:MovieID', passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
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
app.post('/users/:username/MovieID/:Id', passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.username }, 
  { $push: { FavoriteMovies: req.params.Id } }, 
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