const mongoose = require('mongoose');
const express = require('express');
const app = express();
const Movie = require('./models/movie');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
const request = require('request');
app.set('view engine', 'ejs');


mongoose.connect('mongodb://localhost/movies_project')
    .then(() => { console.log('Connected to mongodb')})
    .catch( err => console.error('Could not connect', err));    

app.get('/', (req, res) => {
    Movie.find({}, (err, movies) => {
        if(err) console.log(err)
        else res.render('landing', {movies: movies})
    })
    
})

app.get('/movies',(req, res)=>{

   let query = req.query.search || 'Memento';
   let url = 'http://www.omdbapi.com/?apikey=2edb4869&t=' + query
    request(url, (error, response, body) =>{
        if(!error && response.statusCode == 200){
            let data = JSON.parse(body)
            res.render('results',{data: data })
            }
    })
});

app.post('/movies',(req, res) => {
    let title = req.body.title;
    let poster = req.body.poster;
    let genre = req.body.genre;
    let plot = req.body.plot;
    let director = req.body.director;
    let writer = req.body.writer;
    let actors = req.body.actors;
    let imdbRatings = req.body.ratings;
    let imdbVotes = req.body.votes;
    let runtime = req.body.runtime;
    

    let newMovie = { title: title, poster: poster, genre: genre, plot: plot, director: director,
         writer: writer, actors: actors, ratings: imdbRatings, votes: imdbVotes, runtime: runtime}

    Movie.create(newMovie, (err, createdMovie) =>{
        if(err) console.log(err)
        else res.redirect('/')
    })
    
})


app.get('/movies/new', (req, res) =>{
    res.render('new')
})


app.get('/movies/:id/edit', (req, res) => {
    Movie.findById(req.params.id, (err, foundMovie)=>{
        if(err) res.redirect('.')
            else res.render('edit', {
                movie: foundMovie
            })
    })
    
})

app.put('/movies/:id', (req, res) =>{

    Movie.findByIdAndUpdate(req.params.id, req.body.movie, (err, updatedMovie) =>{
        if (err) console.log(err)
            else res.redirect('/')
    })
})

app.delete('/movies/:id', (req, res) =>{
    Movie.findByIdAndRemove(req.params.id, (err) =>{
        if(err) console.log(err)
            else res.redirect('/')
    })
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
