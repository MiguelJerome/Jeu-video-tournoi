import connectionPromise from './connexion.js';
import { hash } from 'bcrypt';

export const addUtilisateur = async (courriel, motDePasse) => {
    let connexion = await connectionPromise;

    let motDePasseHash = await hash(motDePasse, 10);

    await connexion.run(
        `INSERT INTO utilisateur (courriel, mot_passe)
        VALUES (?, ?)`,
        [courriel, motDePasseHash]
    );
}

export const getUtilisateurByCourriel = async (courriel) => {
    let connexion = await connectionPromise;

    let utilisateur = await connexion.get(
        `SELECT *
        FROM utilisateur
        WHERE courriel = ?`,
        [courriel]
    )
    return utilisateur;
}