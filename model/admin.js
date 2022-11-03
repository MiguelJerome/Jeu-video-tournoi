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

export const addTournoiInscrit = async(id_tournois)=>{
    let connexion = await connectionPromise;

    await connexion.run(
        `INSERT INTO tournois_utilisateur (id_tournois,id_utilisateur) 
        Values (${id_tournois},1)`
            )
    return id_tournois;
}

export const getTournoiInscrit = async ()=>{
    let connexion = await connectionPromise;
    
    let resultat = await connexion.all(
        `select * from tournois t, tournois_utilisateur tu
        where t.id_tournois = tu.id_tournois and tu.id_utilisateur=1`
    )
   return resultat;
}

export const getIds = async ()=>{
        let connexion = await connectionPromise;

        let resultat = await connexion.all(
            `select id_tournois from tournois_utilisateur
            where id_utilisateur = 1`
        )
    return resultat;
}

export const deleteTournoiInscrit = async (id_tournois)=>{
    let connexion = await connectionPromise;

    await connexion.run(
        `DELETE FROM tournois_utilisateur
        WHERE id_tournois = ${id_tournois} and id_utilisateur=1`
    )
}

export const getNombreInscrit = async ()=>{
        let connexion = await connectionPromise;

        let resultat = await connexion.all(
            `select id_tournois, count(id_tournois) as 'nombre'  from tournois_utilisateur
            group by id_tournois`
        )
    return resultat;  
}
