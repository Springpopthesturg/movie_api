const express = require('express');
  morgan = require('morgan'),
  bodyParser = require('body-parser'),
  uuid = require('uuid');


const app = express();

app.use(morgan('common'));
app.use(bodyParser.json());

let movies = [
  {
    title: 'Pulp Fiction',
    director: 'Quinton Tarintino',
    genres: ['Crime', 'Drama']
  },
  {
    title: 'Oldboy',
    driector: 'Park Chan-wook',
    genres: ['Action', 'Mystery', 'Drama']
  },
  {
    title: 'Ten Things I Hate About You',
    driector: 'Gil Junger',
    genres: 'Romantic Comedy'
  },
  {
    title: 'John Wick',
    driector: 'Chad Stahelski',
    genres: ['Neo-Noir', 'Action', 'Thriller']
  },
  {
    title: 'Aladdin',
    driector: ['Ron Clements', 'John Musker'],
    genres: ['Musical', 'Romance', 'Fantasy']
  },
  {
    title: 'Star Wars Episode Six Return of the Jedi',
    driector: 'George Lucas',
    genres: ['Science Fiction', 'Adventure', 'Action']
  },
  {
    title: 'Accepted',
    driector: 'Steve Pink',
    genres: 'Comedy'
  },
  {
    title: 'Back To The Future',
    driector: 'Robert Zemeckis',
    genres: ['Adventure', 'Comedy', 'Science Fiction']
  },
  {
    title: 'Master of Disguise',
    driector: 'Perry Andelin Blake',
    genres: 'Comedy'
  },
  {
    title: 'Fear and Loathing in Las Vegas',
    driector: 'Terry Gilliam',
    genres: ['Biography', 'Surreal']
  },
];

//GET Requests

app.get('/', (req, res) => {
  res.send('Welcome to my app!');
});

//Return all movies
app.get('/movies', (req, res) => {
  Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return Movies of specified genre
app.get ('/movies/:genres', (req, res) => {
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
  app.get ('/movies/:title', (req, res) => {
    movies.findOne({ title: req.params.title })
    .then((usermovie) => {
      res.json(usermovie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
  });
//Returns list of Directors
  app.get ('/movies/:director', (req, res) => {
    Movies.find ({director: req.params.director})
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  });

  //Returns single director
  app.get ('/movies/:name', (req, res) => {
    movies.findOne({ name: req.params.name })
  .then((nameDirector) => {
    res.json(nameDirector);
  })
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});
//Return user by username
app.get('/users/:username',(req,res) => {
  users.findOne({ username: req.params.username})
  .then((user) => {
      res.json(user);
      })
   .catch((err) => {
     console.error(err);
     res.status(500).send('error:' + err)
     });
});

//Return movie favorites by name
app.get('/users/:username/favorites/:movie', (req,res)=>{
  users.findOne({ favoritesMovies: req.params.favoritesMovies})
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
app.delete('/users/:username', (req, res) => {
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
      res.status(500).send('Error: ' + err);
    });
  });
//delete from users favorites
  app.delete('/users/:username/favorites/:movie', (req,res)=>{
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
      res.status(500).send('Error: ' + err);
    });
  });

  //PUT requests

  //Update user
  app.put ('/users/:Username',[
      check("Username", "Username is required").isLength({ min: 4 }),
      check(
        "Username",
        "Username contains non alphanumeric characters - not allowed."
      ).isAlphanumeric(),
      check("Password", "Password is required").not().isEmpty(),
      check("Email", "Email does not appear to be valid").isEmail(),
    ],
    (req, res) => {
      // check the validation object for errors
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
      }
      Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
          $set: {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          },
        },
        { new: true }, // This makes sure that the updated document is returned
        (err, updatedUser) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error: " + err);
          } else {
            res.json(updatedUser);
          }});
      });
  
// POST Requests

//create account
app.post ("/users",
  [
    check("Username", "Username is required").isLength({ min: 4 }),
    check(
      "Username",
      "Username contains non alphanumeric characters - not allowed."
    ).isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }})
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error :" + error);
      });
  });

  //Adds movies to users favorites
  app.post(
    "/users/:Username/Movies/:MovieID", (req, res) => {
      Users.findOneAndUpdate ({Username: req.params.Username},
        {
          $addToSet: { Favorites: req.params.MovieID },
        },
        { new: true },(err, updatedUser) => {
          if (err) {res.status(500).send("Error: " + err);
          } 
          else {res.json(updatedUser);
          }});
      });

app.get('/documentation.html', (req, res) => {
  res.sendFile('public/documentation.html', {root: __dirname});
});

app.use(express.static('public'));

//Error response

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

//listen response

app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});