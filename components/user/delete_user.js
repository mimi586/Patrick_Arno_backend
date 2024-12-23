import express from 'express';
import bodyParser from 'body-parser';
import { getConnection } from '../../connection.js'; // Ensure this path is correct

const delete_userRoute = express.Router();
delete_userRoute.use(bodyParser.json());

delete_userRoute.delete('/delete_user/:id', (req, res) => {
    const id = req.params.id;

    // SQL DELETE query
    const query = 'DELETE FROM user WHERE NIF = ?';

    // Get a connection from the pool
    getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ message: 'Error connecting to the database.' });
        }

        // Execute the DELETE query
        connection.query(query, [id], (err, result) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error('Error deleting user:', err);
                return res.status(500).json({ message: 'Erreur lors de la suppression de l\'user.' });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Aucun user trouvé avec cet identifiant.' });
            }

            console.log('User  supprimé avec succès:', id);
            return res.status(200).json({ message: 'User  supprimé avec succès.' });
        });
    });
});

export { delete_userRoute };