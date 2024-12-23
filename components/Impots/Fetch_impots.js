import express from 'express';
import bodyParser from 'body-parser';
import { getConnection } from '../../connection.js'; // Assurez-vous que ce chemin est correct

const Affiche_impotsRoute = express.Router();
Affiche_impotsRoute.use(bodyParser.json());

// Route pour récupérer les données des paiements
Affiche_impotsRoute.get('/fetch_imp', (req, res) => {
    // Requête pour récupérer toutes les colonnes, y compris NIF
    const query = 'SELECT * FROM paiements';

    // Obtenir une connexion à partir de la pool
    getConnection((err, connection) => {
        if (err) {
            console.error('Erreur lors de la récupération de la connexion :', err);
            return res.status(500).json({ 
                message: 'Erreur lors de la connexion à la base de données.',
                error: err.message,
            });
        }

        // Exécuter la requête SQL
        connection.query(query, (err, results) => {
            // Libérer la connexion après la requête
            connection.release();

            if (err) {
                console.error('Erreur lors de l’exécution de la requête :', err);
                return res.status(500).json({ 
                    message: 'Erreur lors de la récupération des paiements.',
                    error: err.message,
                });
            }

            // Vérifier et afficher les résultats dans la console pour le débogage
            console.log('Résultats récupérés :', results);

            // Renvoyer les données au client
            if (results && results.length > 0) {
                res.status(200).json({
                    message: 'Données récupérées avec succès',
                    data: results,
                });
            } else {
                res.status(404).json({
                    message: 'Aucune donnée trouvée dans la table paiements.',
                });
            }
        });
    });
});

export { Affiche_impotsRoute };
