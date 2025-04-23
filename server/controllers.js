import { ObjectId } from 'mongodb';

// Get all movies
 export const getAllMovies = async (req, res) => {
     try {
         const { movies } = req.collections;
         const allMovies = await movies.find().toArray()
         console.log(allMovies);
         res.json(allMovies);
     } catch (err) {
         res.status(500).send({ error: 'Failed to fetch movies', details: err.message });
     }
 };

 // Get a movie by ID
export const getMovieById = async (req, res) => {
    try {
        const { movies } = req.collections;
        const movie = await movies.findOne({ _id: new ObjectId(req.params.id) });

        if (movie) {
            res.json(movie);
        } else {
            res.status(404).send({ error: 'Movie not found' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch movie', details: err.message });
    }
 };

// Get movie comments
export const getMovieComments = async (req, res) => {
    try {
        const { comments } = req.collections;
        const movieComments = await comments.find({ movie_id: new ObjectId(req.params.id) }).toArray();

        if (movieComments.length > 0) {
            res.json(movieComments);
        } else {
            res.status(404).send({ error: 'Movie comments not found' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch movie comments', details: err.message });
    }
};