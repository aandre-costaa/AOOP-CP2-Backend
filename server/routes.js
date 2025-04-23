// routes/movieRoutes.js
import { Router } from 'express';
import movieControllers from './controllers.js';

export default function movieRoutes(db) {
    const router = Router();
    const controller = movieControllers(db);

    // GET /movies - Get all movies
    router.get('movies/', controller.getAllMovies);

    // GET /movies/:id - Get a movie by ID
    router.get('movies/:id', controller.getMovieById);

    // // POST /movies - Add a new movie
    // router.post('/', controller.addMovie);
    //
    // // PUT /movies/:id - Update a movie by ID
    // router.put('/:id', controller.updateMovie);
    //
    // // DELETE /movies/:id - Delete a movie
    // router.delete('/:id', controller.deleteMovie);

    return router;
}
