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

app.get("/directors",(req,res)=>{
  res.json(directors)
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/genres',(req,res)=>{
  res.json(genres)
  .catch((err) => {
    console.error(err);
    res.status(500).send('Error: ' + err);
  });
});

app.get('/movies', (req, res) => {
  res.json(movies)
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
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