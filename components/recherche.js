import express from "express";
import bodyParser from "body-parser";
import { getConnection } from "../../connection.js"; // Connexion à la base de données

const searchRoute = express.Router();

searchRoute.use(bodyParser.json());
searchRoute.use(bodyParser.urlencoded({ extended: true }));

// Route de recherche
searchRoute.get("/search", (req, res) => {
    const keyword = req.query.keyword || ""; // Récupérer le mot-clé à partir de la requête

    if (!keyword) {
        return res.status(400).json({ message: "Keyword is required" });
    }

    const query = `
        SELECT * FROM paiements
        WHERE DateP ? 
        ORDER BY DateP ASC
    `;

    const likeKeyword = `%${keyword}%`;

    getConnection((err, connection) => {
        if (err) {
            console.error("Database connection error:", err);
            return res.status(500).json({ message: "Error connecting to database" });
        }

        connection.query(query, [likeKeyword, likeKeyword], (err, results) => {
            connection.release();

            if (err) {
                console.error("Search query error:", err);
                return res.status(500).json({ message: "Error performing search" });
            }

            res.status(200).json({ results });
        });
    });
});

export { searchRoute };
