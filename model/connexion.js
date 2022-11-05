import { existsSync } from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let year = '2022';
let month = '11';
let days = '05';
let separtorDate = '-';

const tournoiDefaultDate = `'${year}${separtorDate}${month}${separtorDate}${days}'`;
/**
 * Constante indiquant si la base de données existe au démarrage du serveur 
 * ou non.
 */
const IS_NEW = !existsSync(process.env.DB_FILE);

/**
 * Crée une base de données par défaut pour le serveur. Des données fictives
 * pour tester le serveur y ont été ajouté.
 */
const createDatabase = async (connectionPromise) => {
    let connection = await connectionPromise;

    await connection.exec(
        `CREATE TABLE IF NOT EXISTS type_utilisateur(
            id_type_utilisateur INTEGER PRIMARY KEY,
            type TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS utilisateur(
            id_utilisateur INTEGER PRIMARY KEY,
            id_type_utilisateur INTEGER NOT NULL,
            courriel TEXT NOT NULL UNIQUE,
            mot_passe TEXT NOT NULL,
            prenom TEXT NOT NULL,
            nom TEXT NOT NULL,
            CONSTRAINT fk_type_utilisateur 
                FOREIGN KEY (id_type_utilisateur)
                REFERENCES type_utilisateur(id_type_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS tournois(
            id_tournois INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT NOT NULL,
            description TEXT NOT NULL,
            capacite INTEGER NOT NULL,
            date_debut TEXT NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS tournois_utilisateur(
            id_tournois INTEGER,
            id_utilisateur INTEGER,
            PRIMARY KEY (id_tournois, id_utilisateur),
            CONSTRAINT fk_tournois_utilisateur 
                FOREIGN KEY (id_tournois)
                REFERENCES tournois(id_tournois) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE,
            CONSTRAINT fk_utilisateur_tournois
                FOREIGN KEY (id_utilisateur)
                REFERENCES utilisateur(id_utilisateur) 
                ON DELETE SET NULL 
                ON UPDATE CASCADE
        );
        
        INSERT INTO type_utilisateur (type) VALUES 
            ('regulier'),
            ('administrateur');

        INSERT INTO utilisateur (id_type_utilisateur, courriel, mot_passe, prenom, nom) VALUES 
            (2, 'admin@admin.com', 'admin', 'Admin', 'Admin'),
            (1, 'john_doe@gmail.com', 'passw0rd', 'John', 'Doe'),
            (1, 'sera@gmail.com', 'passw0rd', 'Seraphina', 'Lopez'),
            (1, 'arlo_shield@gmail.com', 'passw0rd', 'Arlo', 'Shield'),
            (1, 'blyke_ray@gmail.com', 'passw0rd', 'Blyke', 'Leclerc'),
            (1, 'remi_fast@gmail.com', 'passw0rd', 'Remi', 'Smith'),
            (1, 'isen_radar@gmail.com', 'passw0rd', 'Isen', 'Turner'),
            (1, 'elaine_doc@gmail.com', 'passw0rd', 'Elaine', 'Nelson'),
            (1, 'zeke_the_form@gmail.com', 'passw0rd', 'Zeke', 'Anderson');
            
        INSERT INTO tournois (nom, date_debut, capacite, description) VALUES 
            ('Call Of Duty : Modern Warfare II',  ${tournoiDefaultDate}, 16, 'Il plonge les joueurs dans un conflit mondial sans précédent avec le retour de la Task Force 141, il propose des combats multijoueurs immersifs et des missions coop axées sur la narration.'),
            ('Jump Force',  ${tournoiDefaultDate}, 16, 'Il propose des combats en équipe réunissant tous les héros des mangas du Shonen Weekly Jump comme Naruto, Dragon Ball Z, One Piece ou encore Bleach.'),
            ('NBA 2K23',  ${tournoiDefaultDate}, 16, 'Il propose des matchs de BasketBall intenses avec vos franchises préférées de la NBA. Affrontez-vous en 1 vs 1, 2 vs 2 ou 3 vs 3 mode bitume en choisissant vos joueurs.'),
            ('FIFA 23', ${tournoiDefaultDate}, 16, 'Il propose des matchs de Football immersifs avec toutes les équipes du monde dans les stades de Football les plus célèbres du milieu. .'),
            ('NHL 23',  ${tournoiDefaultDate}, 16, 'Il propose des matchs de hockey sur glace avec toutes les équipes, hommes et femmes de la Ligue Nationale de Hockey.'),
            ('Battlefield 4',  ${tournoiDefaultDate}, 16, 'Battlefield V (BFV) est un jeu vidéo de tir à la première personne développé par DICE et édité par Electronic Arts, sorti le 20 novembre 2018 sur PlayStation 4, Xbox One et Microsoft Windows.'),
            ('Forza Horizon 5',  ${tournoiDefaultDate}, 16, 'Découvrez le monde ouvert vivant et changeant constamment, situé dans les magnifiques paysages du Mexique, et vibrez au volant de centaines de voitures parmi les plus belles du monde.'),
            ('Street Fighter V',  ${tournoiDefaultDate}, 16, 'Découvrez l’intensité du combat face à face avec Street Fighter™ V! Choisissez parmi 36 personnages avec leur histoire et leurs défis uniques, combattez des amis en ligne ou non avec une foule d’options de correspondance.'),
            ('Tekken 8',  ${tournoiDefaultDate}, 16, 'Découvrez l’intensité du combat face à face avec Tekken 8! Choisissez parmi 28 personnages et revivez l’histoire culte de la rivalité entre la famille Mishima et la famille Kazama..'),
            ('Naruto Storm 4',  ${tournoiDefaultDate}, 16, 'Plonger dans des combats en 3 dimensions dans l’univers de ninja de Naruto et ses amis et affrontez-vous avec tous les personnages culte du manga.');
        
        INSERT INTO tournois_utilisateur (id_tournois, id_utilisateur) VALUES 
            (1, 5),
            (1, 6),
            (1, 7),
            (2, 2),
            (2, 3),
            (3, 9),
            (6, 4),
            (6, 5),
            (6, 6),
            (6, 7),
            (6, 8),
            (7, 2),
            (7, 3),
            (7, 4),
            (7, 5),
            (7, 6),
            (7, 7),
            (7, 8);`
    );

    return connection;
};

// Base de données dans un fichier
let connectionPromise = open({
    filename: process.env.DB_FILE,
    driver: sqlite3.Database
});

// Si le fichier de base de données n'existe pas, on crée la base de données
// et on y insère des données fictive de test.
if (IS_NEW) {
    connectionPromise = createDatabase(connectionPromise);
}

export default connectionPromise;
