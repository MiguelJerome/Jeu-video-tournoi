/**
 * Fonction qui verifie si le nom est valide
 * @param {string} nom 
 * @returns booleen vrai ou faux
 */
const validateNom = (nom) => {
    return typeof(nom) === 'string' && nom.length > 2
                    && nom.length < 50;
}

/**
 * Fonction qui verifie si la description est valide
 * @param {string} description
 * @returns booleen vrai ou faux
 */
const validateDescription = (description) => {
    return typeof(description) === 'string' && description.length > 0
    && description.length < 200;
}

/**
 * Fonction qui verifie si la date est valide
 * @param {date} date
 * @returns booleen vrai ou faux
 */
const validateDate = (date) => {
    return typeof(date) === 'string' && date.length > 0
    && date.length < 50;
}

/**
 * Fonction qui verifie si la capacité est valide
 * @param {number} capacite 
 * @returns booleen vrai ou faux
 */
const validateCapacite = (capacite) => {
    return typeof(capacite) === 'number' && capacite> 0
    && capacite< 16;
}

/**
 * Fonction qui verifie tous
 * @param {object} body 
 * @returns booleen vrai ou faux
 */
export const validate = (body) => {
    return validateNom(body.nom) && validateDescription(body.description) && validateDate(body.date_debut) && validateCapacite(body.capacite);
}


// i put this code in the post of admin and it works;
/*  if(validate(request.body)){
     response.render('admin', {
        titre: 'Administrateur',
        styles: ['/css/admin.css'],
        scripts: ['/js/admin.js'],
        id: await addTournoi(request.body.nom,request.body.date_debut,parseInt(request.body.capacite),request.body.description),
   
    });*/