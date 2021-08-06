const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let genreSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  genreid: String,
});

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  description: { type: String, required: true },
  genreid: String,
  directorid: String,
  imageUrl: String,
  featured: Boolean,
});

let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: { Date },
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

userSchema.statics.hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let directorSchema = mongoose.Schema({
  name: { type: String, required: true },
  bio: String,
  birthyear: Date,
  deathyear: Date,
  directorid: String,
});

let Genre = mongoose.model("Genre", genreSchema);
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
let Director = mongoose.model("Director", directorSchema);

module.exports.Genre = Genre;
module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;