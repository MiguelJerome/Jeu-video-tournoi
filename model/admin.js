import connectionPromise from './connexion.js';


export const getTournoi = async () => {
    let connexion = await connectionPromise;
    let resultat = await connexion.all('SELECT * FROM tournois');
    return resultat;
};

export const addTournoi = async () => {
    let connexion = await connectionPromise;

    let resultat = await connexion.run(
        `INSERT INTO tournois (nom, date_debut, capacite, description) VALUES 
        ('Badminton pour débutant',  10, 12, 'Cours de badminton monttrant les bases du sport. C''est un bon cours à suivre si vous n''avez jamais joué et que vous voulez apprendre les rudiments du sport et ses règlements.')`

    );

    return resultat.lastID;
}


