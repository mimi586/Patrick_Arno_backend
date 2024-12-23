// Import necessary modules
import express from 'express';
import bodyParser from 'body-parser';
import { getConnection } from '../../connection.js'; // Ensure this path is correct

const update_userRoute = express.Router();
update_userRoute.use(bodyParser.json());

update_userRoute.put('/update_user/:id', (req, res) => {
    const { NIF, numStat, nom, Prenoms, adresse, email, tel, numCompte, role } = req.body;
    const id = req.params.id; // This should correspond to the NIF or unique identifier

    // Check if all required fields are provided
    if (!NIF || !numStat || !nom || !Prenoms || !adresse || !email || !tel || !numCompte || !role) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Query to update the user
    const query = `
        UPDATE user
        SET NIF = ?, numStat = ?, nom = ?, Prenoms = ?, adresse = ?, email = ?, tel = ?, numCompte = ?, role = ?
        WHERE NIF = ?
    `;

    // Get a connection from the pool
    getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ message: 'Error connecting to the database.' });
        }

        // Execute the query
        connection.query(query, [NIF, numStat, nom, Prenoms, adresse, email, tel, numCompte, role, id], (err, result) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).json({ message: 'Error updating user' });
            }

            // Check if any rows were affected
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No user found with this identifier.' });
            }

            // Return a success message
            return res.status(200).json({ message: 'User  updated successfully' });
        });
    });
});

export { update_userRoute };