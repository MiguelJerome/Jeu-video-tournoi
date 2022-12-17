import { hash } from "bcrypt";

/**
 * Fonction qui verifie si le nom est valide
 * @param {string} nom
 * @returns booleen vrai ou faux
 */
const validateNom = (nom) => {
  return typeof nom === "string" && !!nom;
};

/**
 * Fonction qui verifie si la description est valide
 * @param {string} description
 * @returns booleen vrai ou faux
 */
const validateDescription = (description) => {
  return (
    typeof description === "string" &&
    description.length > 0 &&
    description.length < 50
  );
};

/**
 * Fonction qui verifie si la date est valide
 * @param {date} date
 * @returns booleen vrai ou faux
 */
const validateDate = (date) => {
  return typeof date === "string" && date.length == 10;
};

/**
 * Fonction qui verifie si la capacité est valide
 * @param {number} capacite
 * @returns booleen vrai ou faux
 */
const validateCapacite = (capacite) => {
  return typeof capacite === "number" && capacite > 0 && capacite < 17;
};

/**
 * Fonction qui verifie si la mot de pase est valide
 * @param {motDePasse}  motDePasse)
 * @returns booleen vrai ou faux
 */
const validateMotDePasse = (motDePasse) => {
  return typeof motDePasse === "string" && !!motDePasse;
};

/**
 * Fonction qui verifie si le prenom est valide
 * @param {prenom}  prenom
 * @returns booleen vrai ou faux
 */
const validatePrenom = (prenom) => {
  return typeof prenom === "string" && !!prenom;
};

/**
 * Fonction qui verifie la validation des datas obtenu a partir des inputs du formulaire ajouter tournoi
 * @param {object} body
 * @returns booleen vrai ou faux
 */
export const validate = (body) => {
  return (
    validateNom(body.nom) &&
    validateDescription(body.description) &&
    validateDate(body.date_debut) &&
    validateCapacite(body.capacite)
  );
};

/**
 * Fonction qui verifie si le courriel est valide
 * @param {courriel}  courriel
 * @returns booleen vrai ou faux
 */
const validateCourriel = (courriel) => {
  return (
    typeof courriel === "string" &&
    !!courriel &&
    courriel.match(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
  );
};

/**
 * Fonction qui verifie la validation des datas obtenu a partir des inputs du formulaire inscription
 * @param {object} body
 * @returns booleen vrai ou faux
 */
export const validateInscription = (body) => {
  return (
    validateNom(body.nom) &&
    validatePrenom(body.prenom) &&
    validateMotDePasse(body.motDePasse) &&
    validateCourriel(body.courriel)
  );
};

/**
 * Fonction qui verifie la validation des datas obtenu a partir des inputs du formulaire connexion
 * @param {object} body
 * @returns booleen vrai ou faux
 */
export const validateConnexion = (body) => {
  return validateCourriel(body.courriel) && validateMotDePasse(body.motDePasse);
};
