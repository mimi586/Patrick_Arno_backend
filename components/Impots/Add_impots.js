import express from 'express';
import bodyParser from 'body-parser';
import PDFDocument from 'pdfkit'; // Import pdfkit
import { getConnection } from '../../connection.js'; // Import de la fonction de connexion à la base de données

const impotsRoute = express.Router();

// Middleware for parsing request bodies
impotsRoute.use(bodyParser.urlencoded({ extended: true }));
impotsRoute.use(bodyParser.json());

// Route pour ajouter un paiement
impotsRoute.post('/add_imp', (req, res) => {
    const { Montant, DateP, TypeImpots, ModePaiement, ReferencePaiement, NumCompte, NIF } = req.body;

    // Validation des champs requis
    if (!Montant || !DateP || !TypeImpots || !ModePaiement || !ReferencePaiement || !NumCompte || !NIF) {
        return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }

    // Vérification si le NIF existe dans la table 'user'
    const checkNifQuery = 'SELECT * FROM user WHERE NIF = ?';

    getConnection((err, connection) => {
        if (err) {
            console.error('Erreur lors de la connexion à la base de données:', err);
            return res.status(500).json({ message: 'Erreur lors de la connexion à la base de données.' });
        }

        // Vérifier si le NIF existe dans la table 'user'
        connection.query(checkNifQuery, [NIF], (err, results) => {
            if (err) {
                console.error('Erreur lors de la vérification du NIF:', err);
                connection.release();
                return res.status(500).json({ message: 'Erreur lors de la vérification du NIF.' });
            }

            // Si le NIF n'existe pas, retourner une erreur
            if (results.length === 0) {
                connection.release();
                return res.status(400).json({ message: 'Le NIF n\'existe pas dans la base de données.' });
            }

            // Si le NIF existe, insérer le paiement dans la table 'paiements'
            const insertQuery = `
                INSERT INTO paiements (Montant, DateP, TypeImpots, ModePaiement, ReferencePaiement, NumCompte, NIF) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            connection.query(insertQuery, [Montant, DateP, TypeImpots, ModePaiement, ReferencePaiement, NumCompte, NIF], (err, result) => {
                connection.release();

                if (err) {
                    console.error('Erreur lors de l\'insertion du paiement:', err);
                    return res.status(500).json({ message: 'Erreur lors de la création du paiement', error: err.message });
                }

                const paymentId = result.insertId;

                // Créer et envoyer la confirmation PDF
                const doc = new PDFDocument();
                const filename = `confirmation_payment_${paymentId}.pdf`;

                // Définir les en-têtes pour servir le fichier PDF
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

                // Écrire le contenu dans le PDF
                doc.pipe(res);
                doc.fontSize(20).text('Confirmation de Paiement', { align: 'center' });
                doc.moveDown();
                doc.fontSize(12)
                    .text(`Montant : ${Montant}`)
                    .text(`Date : ${DateP}`)
                    .text(`Type d'Impôt : ${TypeImpots}`)
                    .text(`Mode de Paiement : ${ModePaiement}`)
                    .text(`Référence du Paiement : ${ReferencePaiement}`)
                    .text(`Numéro de Compte : ${NumCompte}`)
                    .text(`Numéro de Paiement : ${paymentId}`)
                    .text(`NIF : ${NIF}`);
                doc.end(); // Finaliser le document
            });
        });
    });
});

export { impotsRoute };
