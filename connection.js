import { existsSync } from 'fs';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

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
            date_debut INTEGER NOT NULL
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
            ('Badminton pour débutant',  10, 12, 'Cours de badminton monttrant les bases du sport. C''est un bon cours à suivre si vous n''avez jamais joué et que vous voulez apprendre les rudiments du sport et ses règlements.'),
            ('Badminton intermédiaire',  10, 24, 'Cours de badminton monttrant les techniques plus avancées de coups de raquette, de déplacement sur le terrain et de stratégies contre vos adversaires.'),
            ('Zumba intense',  8, 20, 'Classe de Zumba à haute intensité. Un entraînement complet combinant cardio, muscle, équilibre et flexibilité pour faire le plein d''énergie et vous sentir mieux dans votre corps.'),
            ('Natation pour les nuls', 15, 10, 'Vous vous sentez comme une roche dans l''eau? Ce cours est pour vous! Apprenez les techniques de base pour nager de façon simple et efficace dans l''eau.'),
            ('Aquaforme',  15, 25, 'Entraînement de mise en forme dans l''eau. Pratique de mouvements aidant à développer vos muscles et votre cardio de façon équilibrée. Idéal pour les personnes qui recommence à s''entraîner ou qui désire simplement maintenir une forme physique.'),
            ('Course à pied',  5, 15, 'Évaluation et conseil pour la course à pied. Si vous désirez améliorer vos temps ou parcourir de plus grandes distance, nous nous ferons un plaisir de vous aider à atteindre vos buts.'),
            ('Course de l''horreur',  1, 200, 'Une course thématique de l''halloween qui saura divertir les coureurs et leur entourage. Des bonbons seront donnés aux enfants à la fin de la course!');
        
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