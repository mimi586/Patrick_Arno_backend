import express from 'express';
import bodyParser from 'body-parser';
import { getConnection } from '../../connection.js'; // Make sure this is the correct path

const userRoute = express.Router();

userRoute.use(bodyParser.urlencoded({ extended: true }));
userRoute.use(bodyParser.json());

userRoute.post('/add_user', (req, res) => {
    const { NIF, numStat, nom, Prenoms, adresse, email, tel, numCompte, role } = req.body;

    // Validate required fields
    if (!NIF || !numStat || !nom || !Prenoms || !adresse || !email || !tel || !numCompte || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Insert query
    const query = 'INSERT INTO user (NIF, numStat, nom, Prenoms, adresse, email, tel, numCompte, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';

    // Get a connection from the pool
    getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ message: 'Error connecting to the database.' });
        }

        // Execute the query
        connection.query(query, [NIF, numStat, nom, Prenoms, adresse, email, tel, numCompte, role], (err, result) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error('Error while inserting user:', err);
                return res.status(500).json({ message: 'Error while creating user' });
            }

            console.log('User  added successfully:', result);
            return res.status(201).json({ message: 'User  added successfully', userId: result.insertId });
        });
    });
});

export { userRoute };