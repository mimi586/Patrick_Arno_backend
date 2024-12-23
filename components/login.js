import express from 'express';
import bodyParser from 'body-parser';
import { getConnection } from '../connection.js';

const loginRoute = express.Router();

loginRoute.use(bodyParser.urlencoded({ extended: true }));
loginRoute.use(bodyParser.json());

loginRoute.post('/login', (req, res) => {
    console.log('Requête reçue:', req.body); // Loggez les données reçues dans le backend

    const email = req.body.Email;
    const password = req.body.MDP;

    if (!email || !password) {
        console.log("Email ou mot de passe manquant");
        return res.status(400).json({ message: 'L\'email et le mot de passe sont requis.' });
    }

    try {
        const sql = "SELECT * FROM login WHERE Email = ? AND MDP = ?";
        
        // Connexion à la base de données
        getConnection((err, connection) => {
            if (err) {
                console.error('Erreur lors de l\'obtention de la connexion au pool:', err);
                return res.status(500).json({ message: 'Erreur de connexion à la base de données.' });
            }

            connection.query(sql, [email, password], (err, results) => {
                connection.release(); // Libération de la connexion

                if (err) {
                    console.error('Erreur lors de l\'exécution de la requête:', err);
                    return res.status(500).json({ message: 'Erreur lors de l\'exécution de la requête.' });
                }

                // Vérification des résultats
                if (results.length > 0) {
                    console.log("Utilisateur trouvé:", results[0]); // Loggez l'utilisateur trouvé
                    const user = results[0];
                    return res.status(200).json({
                        message: 'Connexion réussie',
                        user: {
                            ID: user.ID,  // Renvoie l'ID de l'utilisateur
                            Email: user.Email, // Renvoie l'email de l'utilisateur
                        }
                    });
                } else {
                    console.log("Aucun utilisateur trouvé");
                    return res.status(401).json({ message: 'Email ou mot de passe invalide' });
                }
            });
        });
    } catch (error) {
        console.error('Erreur inattendue:', error);
        return res.status(500).json({ message: 'Une erreur inattendue est survenue.' });
    }
});


export { loginRoute };
