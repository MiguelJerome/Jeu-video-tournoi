import connectionPromise from './connexion.js';
import { hash } from 'bcrypt';
/**
 * ajouter un nouveau utilisateur et ensuite l'inserer dans la base de donnees
 * @param {* courriel utilisateur} courriel 
 * @param {* motDePasse utilisateur} motDePasse 
 * @param {* prenom utilisateur} prenom 
 * @param {*nom utilisateur} nom 
 */
export const addUtilisateur = async (courriel,motDePasse,prenom, nom) => {
    let connexion = await connectionPromise;

    let motDePasseHash = await hash(motDePasse, 10);

    await connexion.run(
        `INSERT INTO utilisateur (id_type_utilisateur,courriel,mot_passe,prenom,nom)
        VALUES (1,?,?,?,?)`,
        [courriel, motDePasseHash,prenom,nom]
    );
};
/**
 * verifire dans la base de donnees si le courriel est existant obtenu a partir de l'utilisateur
 */
export const getUtilisateurByCourriel = async (courriel) => {
    let connexion = await connectionPromise;

    let utilisateur = await connexion.get(
        `SELECT *
        FROM utilisateur
        WHERE courriel = ?`,
        [courriel]
    )
    return utilisateur;
};