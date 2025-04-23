// mongodb native driver setup
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import router from './routes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('../public'));
app.use(express.urlencoded({ extended: true }));

const url = process.env.MONGODB_URI;
const dbName = 'sample_mflix';
let db;

// Start the server
async function startServer() {
    try {
        const client = await MongoClient.connect(url);
        db = client.db(dbName);
        console.log('Connected to MongoDB');

        // middleware to use connection in every route
        function setCollection(req, res, next) {
            req.collections = {
                movies: db.collection('movies'),
                comments: db.collection('comments')
            };
            next();
        };
        app.use(setCollection);
        app.use('/', router);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

await startServer();

// CRUD endpoints

// Get all movies
// app.get('/movies/', async (req, res) => {
//     try {
//         if (!req.collection) {
//             return res.status(500).send({ error: 'Database collection not initialized' });
//         }
//         const movies = await req.collection.find().toArray();
//         console.log(movies);
//         res.json(movies);
//     } catch (err) {
//         res.status(500).send({ error: 'Failed to fetch movies', details: err.message });
//     }
// });
//
// // Get a movie by ID
// app.get('/movies/:id', async (req, res) => {
//     try {
//         if (!req.collection) {
//             return res.status(500).send({ error: 'Database collection not initialized' });
//         }
//         const movie = await req.collection.findOne({ _id: new ObjectId(req.params.id) });
//         if (movie) {
//             res.json(movie);
//         } else {
//             res.status(404).send({ error: 'Movie not found' });
//         }
//     } catch (err) {
//         res.status(500).send({ error: 'Failed to fetch movie', details: err.message });
//     }
// });