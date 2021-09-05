const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

let genreSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Description: String,
  GenreID: String,
});

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  GenreID: String,
  DirectorID: String,
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
  return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.Password);
};

let directorSchema = mongoose.Schema({
  Name: { type: String, required: true },
  Bio: String,
  Birth: Date,
  Death: Date,
  DirectorID: String,
});

let Genre = mongoose.model("Genre", genreSchema);
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);
let Director = mongoose.model("Director", directorSchema);

module.exports.Genre = Genre;
module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Director = Director;