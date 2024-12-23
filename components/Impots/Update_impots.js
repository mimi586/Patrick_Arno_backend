// Import necessary modules
import express from 'express';
import bodyParser from 'body-parser';
import { getConnection } from '../../connection.js'; // Ensure you import getConnection

const Update_impotsRoute = express.Router();
Update_impotsRoute.use(bodyParser.json());

Update_impotsRoute.put('/update_imp/:id', (req, res) => {
    const { Montant, DateP, TypeImpots, ModePaiement, ReferencePaiement, NumCompte } = req.body;
    const id = req.params.id; // NumPayements

    // Check if all required fields are provided
    if (!Montant || !DateP || !TypeImpots || !ModePaiement || !ReferencePaiement || !NumCompte) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Query to update the paiement
    const query = `
        UPDATE Paiements 
        SET Montant = ?, DateP = ?, TypeImpots = ?, ModePaiement = ?, ReferencePaiement = ?, NumCompte = ?
        WHERE NumPayements = ?
    `;

    // Get a connection from the pool
    getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ message: 'Error connecting to the database.' });
        }

        // Execute the query
        connection.query(query, [Montant, DateP, TypeImpots, ModePaiement, ReferencePaiement, NumCompte, id], (err, result) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error('Error updating paiement:', err);
                return res.status(500).json({ message: 'Error updating paiement' });
            }
            
            // Check if any rows were affected
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'No paiement found with the given ID' });
            }

            // Return a success message
            return res.status(200).json({ message: 'Paiement updated successfully' });
        });
    });
});

export { Update_impotsRoute };