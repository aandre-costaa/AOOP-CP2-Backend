import { ObjectId } from 'mongodb';

// Get all movies with pagination and optional title search
export const getAllMovies = async (req, res) => {
    try {
        const { movies } = req.collections;
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        const title = req.query.title;
        const query = title
            ? { title: { $regex: title, $options: 'i' } }  // Case-insensitive title search
            : {};

        const total = await movies.countDocuments(query);
        const results = await movies.find(query).skip(skip).limit(limit).toArray();

        res.json({
            movies: results,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch movies', details: err.message });
    }
};


 // Get a movie by ID
export const getMovieById = async (req, res) => {
    try {
        const { movies, comments } = req.collections;
        const movieId = new ObjectId(req.params.id);

        const movie = await movies.findOne({ _id: movieId });

        if (movie) {
            const movieComments = await comments
                .find({ movie_id: movieId })
                .toArray();

            res.json({ ...movie, comments: movieComments });
        } else {
            res.status(404).send({ error: 'Movie not found' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch movie', details: err.message });
    }
};

// Update a movie by ID
export const updateMovieById = async (req, res) => {
    try {
        const { movies } = req.collections;
        const movieId = req.params.id;

        if (!ObjectId.isValid(movieId)) {
            return res.status(400).json({ error: 'Invalid movie ID' });
        }

        const updateData = req.body;

        const result = await movies.updateOne(
            { _id: new ObjectId(movieId) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.json({ message: 'Movie updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update movie', details: err.message });
    }
};

// Create a comment for a movie
export const createComment = async (req, res) => {
    try {
        const { comments } = req.collections;
        const { name, email, text, movie_id } = req.body;
        if (!name || !email || !text || !movie_id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newComment = {
            name,
            email,
            text,
            movie_id: new ObjectId(movie_id),
            date: new Date()
        };
        const result = await comments.insertOne(newComment);
        res.status(201).json({
            message: 'Comment created successfully',
            commentId: result.insertedId
        });
    } catch (err) {
        res.status(500).json({
            error: 'Failed to create comment',
            details: err.message
        });
    }
};

// Delete a comment for a movie
export const deleteComment = async (req, res) => {
    try {
        const { comments } = req.collections;
        const comment = await comments.findOneAndDelete({ _id: new ObjectId(req.params.id) });

        if (comment) {
            res.json({ message: 'Comment deleted successfully', comment: comment.value });
        } else {
            res.status(404).send({ error: 'Comment not found' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch comment', details: err.message });
    }
};