import connectionPromise from './connexion.js';


export const getTournoi = async () => {
    let connexion = await connectionPromise;
    let resultat = await connexion.all('SELECT * FROM tournois');
    return resultat;
};

export const addTournoi = async (nom,date,capacite,description) => {
    let connexion = await connectionPromise;

    let resultat = await connexion.run(
        `INSERT INTO tournois (nom,description, capacite, date_debut) VALUES 
        (?,?,?,?)`,
        [nom,description,capacite,date]
    );

    return resultat.lastID;
}

export const supprimerTournoi = async(id)=>{
    let connexion = await connectionPromise;

     await connexion.run(
        `DELETE FROM tournois
        WHERE id_tournois = ${id};`
     )
     return id;
}

