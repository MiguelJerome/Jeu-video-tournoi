/**
 * Fonction qui verifie si le nom est valide
 * @param {string} nom 
 * @returns booleen vrai ou faux
 */
const validateNom = (nom) => {
    return typeof nom === 'string' && !!nom;
};

/**
 * Fonction qui verifie si la description est valide
 * @param {string} description
 * @returns booleen vrai ou faux
 */
const validateDescription = (description) => {
    return typeof(description) === 'string' && description.length > 0
    && description.length < 50;
};

/**
 * Fonction qui verifie si la date est valide
 * @param {date} date
 * @returns booleen vrai ou faux
 */
const validateDate = (date) => {
    return typeof(date) === 'string' 
    && date.length == 10 ;
};

/**
 * Fonction qui verifie si la capacité est valide
 * @param {number} capacite 
 * @returns booleen vrai ou faux
 */
const validateCapacite = (capacite) => {
    return typeof(capacite) === 'number' && capacite> 0
    && capacite < 17;
};

const validateMotDePasse = (motDePasse) => {
    return typeof motDePasse=== 'string' && !!motDePasse;
};

const validatePrenom = (prenom) => {
    return typeof prenom === 'string' && !!prenom;
};

/**
 * Fonction qui verifie tous
 * @param {object} body 
 * @returns booleen vrai ou faux
 */
export const validate = (body) => {
    return validateNom(body.nom) && validateDescription(body.description) && validateDate(body.date_debut) && validateCapacite(body.capacite);
};

const validateCourriel = (courriel) => {
    return typeof courriel === 'string' && 
        !!courriel &&
        courriel.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
};

export const validateInscription = (body) => {
    return validateNom(body.nom) && validatePrenom(body.prenom) && validateCourriel(body.courriel) && validateMotDePasse(body.motDePasse);
};

export const validateConnexion = (body) => {
    return validateCourriel(body.courriel) && validateMotDePasse(body.motDePasse);
};