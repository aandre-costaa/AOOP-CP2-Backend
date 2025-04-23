import { Router } from 'express';
import * as controller from './controllers.js';

const router = Router();


// Route to get all movies
router.get('/movies', controller.getAllMovies);

// GET /movies/:id - Get a movie by ID
router.get('/movies/:id', controller.getMovieById);

// GET /movies/comments/:id - Get comments for a movie by ID
router.get('/movies/comments/:id', controller.getMovieComments);

export default router;