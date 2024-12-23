import express from 'express';
import bodyParser from 'body-parser';
import { getConnection } from '../../connection.js'; // Ensure the correct import

const delete_impotsRoute = express.Router();
delete_impotsRoute.use(bodyParser.json());

delete_impotsRoute.delete('/delete_imp/:id', (req, res) => {
    const id = req.params.id;

    // SQL DELETE query
    const query = 'DELETE FROM paiements WHERE NumPayements = ?';
    
    // Get a connection from the connection module
    getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool:', err);
            return res.status(500).json({ message: 'Erreur lors de la connexion à la base de données.' });
        }

        connection.query(query, [id], (err, result) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error('Error deleting impots:', err);
                return res.status(500).json({ message: 'Erreur lors de la suppression de l\'impôt.' });
            }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Aucun impôt trouvé avec cet identifiant.' });
            }
            console.log('Impôt supprimé avec succès:', id);
            return res.status(200).json({ message: 'Impôt supprimé avec succès.' });
        });
    });
});

export { delete_impotsRoute };