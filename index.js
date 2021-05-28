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