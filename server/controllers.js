// controllers/movieController.js
export default function movieControllers(db) {
    const collection = db.collection('movies');

    return {
        // Get all movies
        getAllMovies: async (req, res) => {
            try {
                const movies = await collection.find().toArray();
                res.json(movies);
            } catch (err) {
                res.status(500).json({ error: 'Failed to fetch movies' });
            }
        },

        // Get a movie by ID
        getMovieById: async (req, res) => {
            try {
                const { ObjectId } = await import('mongodb');
                const movie = await collection.findOne({ _id: new ObjectId(req.params.id) });
                if (!movie) return res.status(404).json({ error: 'Movie not found' });
                res.json(movie);
            } catch (err) {
                res.status(400).json({ error: 'Invalid movie ID' });
            }
        },

        // Add a new movie
        addMovie: async (req, res) => {
            try {
                const result = await collection.insertOne(req.body);
                res.status(201).json(result);
            } catch (err) {
                res.status(400).json({ error: 'Failed to insert movie' });
            }
        },

        // Update a movie by ID
        updateMovie: async (req, res) => {
            try {
                const { ObjectId } = await import('mongodb');
                const result = await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
                if (result.matchedCount === 0) return res.status(404).json({ error: 'Movie not found' });
                res.json({ message: 'Movie updated' });
            } catch (err) {
                res.status(400).json({ error: 'Invalid update' });
            }
        },

        // Delete a movie by ID
        deleteMovie: async (req, res) => {
            try {
                const { ObjectId } = await import('mongodb');
                const result = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
                if (result.deletedCount === 0) return res.status(404).json({ error: 'Movie not found' });
                res.json({ message: 'Movie deleted' });
            } catch (err) {
                res.status(400).json({ error: 'Invalid movie ID' });
            }
        }
    };
}
