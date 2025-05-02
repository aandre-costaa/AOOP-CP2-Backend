import { Router } from 'express';
import * as controller from './controllers.js';

const router = Router();


// Route to get all movies
router.get('/movies', controller.getAllMovies);

// GET /movies/:id - Get a movie by ID
router.get('/movies/:id', controller.getMovieById);

// GET /movies/comments/:id - Get comments for a movie by ID
router.get('/movies/comments/:id', controller.getMovieComments);

// PUT /movies/comments/:id - Update a movie by ID
router.put('/movies/:id', controller.updateMovieById);

// POST /movies/comment - Update a movie by ID
router.post('/movies/comment', controller.createComment);

// DELETE /movies/comment/id - Update a movie by ID
router.delete('/movies/comment/:id', controller.deleteComment);

export default router;