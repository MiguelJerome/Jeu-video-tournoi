import connectionPromise from './connexion.js';

/**
 * fonction qui permet de retourner tous les tournois stockées dans la base de donnée
 * @returns les tournois
 */
export const getTournoi = async () => {
    let connexion = await connectionPromise;
    let resultat = await connexion.all('SELECT * FROM tournois');
   
    return resultat;
};

/**
 * Fonction qui permet l'ajout d'un tournois
 * @param {string} nom 
 * @param {string} date 
 * @param {number} capacite 
 * @param {string} description 
 * @returns le dernier id
 */
export const addTournoi = async (nom,date,capacite,description) => {
    let connexion = await connectionPromise;

    let resultat = await connexion.run(
        `INSERT INTO tournois (nom,description, capacite, date_debut) VALUES 
        (?,?,?,?)`,
        [nom,description,capacite,date]
    );

    return resultat.lastID;
};

/**
 * Fonction qui permet de supprimer un tournoi
 * @param {number} id 
 * @returns le id du tournois supprimer
 */
export const supprimerTournoi = async(id)=>{
    let connexion = await connectionPromise;

     await connexion.run(
        `DELETE FROM tournois
        WHERE id_tournois = ${id};`
     );
     return id;
}

/**
 * Fonction qui ajoute un tournois auquel l'utilisateur est inscrit
 * @param {number} id_tournois 
 * @returns id du tournois inscrit
 */
export const addTournoiInscrit = async(id_tournois)=>{
    let connexion = await connectionPromise;

    await connexion.run(
        `INSERT INTO tournois_utilisateur (id_tournois,id_utilisateur) 
        Values (${id_tournois},1)`
            );
    return id_tournois;
}

/**
 * fonction qui retourne tous les tounrois auquel l'utilisateur est inscrit
 * @returns resultat
 */
export const getTournoiInscrit = async ()=>{
    let connexion = await connectionPromise;
    
    let resultat = await connexion.all(
        `select * from tournois t, tournois_utilisateur tu
        where t.id_tournois = tu.id_tournois and tu.id_utilisateur=1`
    );
   return resultat;
}

/**
 * fonction qui retourne tous les ids des tournois auquel l'utilisateur est inscrit
 * @returns id
 */
export const getIds = async ()=>{
        let connexion = await connectionPromise;

        let resultat = await connexion.all(
            `select id_tournois from tournois_utilisateur
            where id_utilisateur = 1`
        );
    return resultat;
}

/**
 * Fonction qui supprime un tournois auquel l'utilisateur est inscrit
 * @param {number} id_tournois 
 */
export const deleteTournoiInscrit = async (id_tournois)=>{
    let connexion = await connectionPromise;

    await connexion.run(
        `DELETE FROM tournois_utilisateur
        WHERE id_tournois = ${id_tournois} and id_utilisateur=1`
    );
}

/**
 * Fonction qui permet de retourner le nombre d'utilisateur inscrit a un tournois.
 * @returns les inscriptions
 */
export const getNombreInscrit = async ()=>{
        let connexion = await connectionPromise;

        let resultat = await connexion.all(
            `select id_tournois, count(id_tournois) as 'nombre'  from tournois_utilisateur
            group by id_tournois`
        );
    return resultat;  
}
