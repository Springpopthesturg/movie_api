const mongoose = require("mongoose");
const Models = require("./models");

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;

const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const passport = require('passport');
require('./passport');

mongoose.connect('mongodb://localhost:27017/myFlixDB',
 { 
   useNewUrlParser: true, 
   useUnifiedTopology: true 
  });


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }, () => console.log("MongoDB Connected"))

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


//Imports auth.js for logins
const auth = require("./auth")(app);

const { check, validationResult } = require('express-validator');
app.use(morgan('common'));
app.use(bodyParser.json());
app.use(cors());

//GET Requests

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

//Return all movies
app.get('/movies', passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
}
);

//Return Movies of specified genre
app.get('/movies/:genres', passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.find({ genre: req.params.genre })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Return a single title of movie
app.get('/movies/:title', passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ title: req.params.title })
    .then((usermovie) => {
      res.json(usermovie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Returns list of Directors
app.get('/movies/:director', passport.authenticate("jwt", { session: false }), (req, res) => {
  Directors.find({ director: req.params.director })
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Returns single director
app.get('/directors/:name', passport.authenticate("jwt", { session: false }), (req, res) => {
  Directors.findOne({ name: req.params.name })
    .then((directors) => {
      res.status(201).json(directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});
//Return user by username
app.get('/users/:username', passport.authenticate("jwt", { session: false }), (req, res) => {
  users.findOne({ username: req.params.username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('error:' + err)
    });
});

//Return movie favorites by name
app.get('/users/:username/favorites/:movie', passport.authenticate("jwt", { session: false }), (req, res) => {
  users.findOne({ favoritesMovies: req.params.favoritesMovies })
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
app.delete('/users/:username', passport.authenticate("jwt", { session: false }), (req, res) => {
  users.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('error: ' + err);
    });
});
//delete from users favorites
app.delete('/users/:username/favorites/:movie', passport.authenticate("jwt", { session: false }), (req, res) => {
  users.findOneAndRemove({ favoritesMovies: req.params.favoritesMovies })
    .then((favMov) => {
      if (!favMov) {
        res.status(400).send(req.params.favoritesMovies + ' was not found');
      } else {
        res.status(200).send(req.params.favoritesMovies + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('error: ' + err);
    });
});

// POST Requests

//create account
app.post('/users', [
  // Configure the validation of req.body
  check('username', 'Username is required').isLength({min: 5, max: 20}),
  check('username', 'Only alphanumeric characters are allowed'). isAlphanumeric(),
  check('pwd', 'Password is required').not().isEmpty(),
  check('email', 'Email not valid'). isEmail()
],(req, res) => {
  // Check the validation object for errors
  let errors = validationResult(req);

  if(!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }

let encryptedPassword = Users.hashPassword(req.body.pwd);
Users.findOne({username: req.body.username}).then((response) => {
  if (response) {
      res.status(400).send(req.body.username + ' already exist.');
  }else {
      Users.create({
          username: req.body.username,
          pwd: encryptedPassword,
          email: req.body.email,
          birth_date: req.body.birth_date
      }).then((user) => {
          res.status(201).json(user);
      }).catch((err) => {
          console.error(err);
          res.status(500).send('Error: ' + err);
      })
  }
}).catch((err) => {
  res.status(500).send('Error: ' + err);
})
})

//Adds movies to users favorites
app.post('/users/:username/movies/:movieID', passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $addToSet: { Favorites: req.params.MovieID },
    },
    { new: true }, (err, updatedUser) => {
      if (err) {
        res.status(500).send("error: " + err);
      }
      else {
        res.json(updatedUser);
      }
    });
});

app.get('/documentation.html',/* passport.authenticate("jwt", { session: false }),*/(req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.use(express.static('public'));

//Error response

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listen response

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});