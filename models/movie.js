const mongoose = require('mongoose')

let movieSchema = new mongoose.Schema({
    title: String,
    poster: String,
    year: Number,
    genre: String,
    plot: String,
    director: String,
    actors: String,
    ratings: Number,
    votes: String,
    runtime: String,
    imdbID: String
})

module.exports = mongoose.model('Movie', movieSchema);