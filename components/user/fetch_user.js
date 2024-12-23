import express from 'express';
import bodyParser from 'body-parser';
import { getConnection } from '../../connection.js'; // Ensure this path is correct

const affiche_userRoute = express.Router();
affiche_userRoute.use(bodyParser.json());

affiche_userRoute.get('/fetch_user', (req, res) => {
    const query = 'SELECT * FROM user'; // Ensure the table name is correct

    // Get a connection from the pool
    getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ message: 'Error connecting to the database.' });
        }

        // Execute the SELECT query
        connection.query(query, (err, results) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error('Error fetching users:', err);
                return res.status(500).json({ message: 'Internal Server Error' });
            }

            res.status(200).json(results);
        });
    });
});

export { affiche_userRoute };