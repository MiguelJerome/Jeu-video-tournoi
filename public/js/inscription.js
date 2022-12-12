let formInscription = document.getElementById('inscription-form-auth');
/**
 * nom usager: validation du formulaire inscription usager
 */
let inputNomUtilisateur = document.getElementById('input-nom-utilisateur');
let errorNomUtilisateur = document.getElementById('error-nom-authentification');

const validateNomUtilisateur = () => {
    if(inputNomUtilisateur.validity.valid) {
        errorNomUtilisateur.style.display = 'none';
    }
    else if(inputNomUtilisateur.validity.valueMissing) {
        errorNomUtilisateur.innerText = 'Ce champ est requis';
        errorNomUtilisateur.style.display = 'block';
    }
};

formInscription.addEventListener('submit', validateNomUtilisateur);
/**
 * prenom usager: validation du formulaire inscription usager
 */
let inputPrenomUtilisateur = document.getElementById('input-prenom-utilisateur');
let errorPrenomUtilisateur = document.getElementById('error-prenom-authentification');

const validatePrenomUtilisateur = () => {
    if(inputPrenomUtilisateur.validity.valid) {
        errorPrenomUtilisateur.style.display = 'none';
    }
    else if(inputPrenomUtilisateur.validity.valueMissing) {
        errorPrenomUtilisateur.innerText = 'Ce champ est requis';
        errorPrenomUtilisateur.style.display = 'block';
    }
};

formInscription.addEventListener('submit', validatePrenomUtilisateur);
/**
 * courriel usager: validation du formulaire inscription usager
 */
let inputCourriel = document.getElementById('input-courriel-utilisateur');
let errorCourrielUsager = document.getElementById('error-courriel-authentification');

const validateCourrielUsager = () => {
    if(inputCourriel.validity.valid) {
        errorCourrielUsager.style.display = 'none';
    }
    else if(inputCourriel.validity.valueMissing) {
        errorCourrielUsager.innerText = 'Ce champ est requis';
        errorCourrielUsager.style.display = 'block';
    }
    else if(inputCourriel.validity.typeMismatch) {
        errorCourrielUsager.innerText = 'Ce champ n est pas valide comme email';
        errorCourrielUsager.style.display = 'block';
    }
};

formInscription.addEventListener('submit', validateCourrielUsager);
/**
 * Mot de passe de l'usager: validation du formulaire inscription usager
 */
let inputMotDePasse = document.getElementById('input-mot-de-passe');
let errorMotDePasseUsager = document.getElementById('error-MotDePasse-authentification');

const validateMotDePasseUsager = () => {
    if(inputMotDePasse.validity.valid) {
        errorMotDePasseUsager.style.display = 'none';
    }
    else if(inputMotDePasse.validity.valueMissing) {
        errorMotDePasseUsager.innerText = 'Ce champ est requis';
        errorMotDePasseUsager.style.display = 'block';
    }
};

formInscription.addEventListener('submit', validateMotDePasseUsager);
/**
 * Soumission : envoyer les inputs du formulaire inscription
 * pour etre eventuelle sauver dans la base de donnee
 */
formInscription.addEventListener('submit', async (event) => {
    event.preventDefault();

    if(!formInscription.checkValidity()){
        return;
    }
    /**
     * Les noms des variables doivent être les mêmes
     * que celles spécifié dans les configuration de
     * passport dans le fichier "authentification.js"
     */
    let data = {
        nom: inputNomUtilisateur.value,
        prenom: inputPrenomUtilisateur.value,
        motDePasse:inputMotDePasse.value,
        courriel:inputCourriel.value,
    };

    if(inputNomUtilisateur && inputPrenomUtilisateur && inputCourriel && inputMotDePasse)
    {
        let response = await fetch('/inscription', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }); 

        if(response.ok) {
            /**
             * Si l'authentification est réussi, on
             * redirige vers la page connexion
             */
            window.location.replace('/Connexion');
        }
        else if(response.status === 409) {
            /**
             * Si l'authentification ne réussi pas, on
             * a le message d'erreur dans l'objet "data"
             * Afficher erreur dans l'interface graphique
             */
            console.log('Utilisateur déjà existant');
        }
        else {
            console.log(response.status);
            console.log('Erreur inconnu');
        }
    }
});
/**
 * bouton reset : validation du formulaire inscription usager
 */
const resetSoumission = () => {
    document.location.reload();
    inputNomUtilisateur.value = '';
    inputPrenomUtilisateur.value = '';
    inputCourriel.value = '';
    inputMotDePasse.value = '';
    
    if(inputNomUtilisateur.validity.valid) {
        errorNomUtilisateur.style.display = 'none';
    }
    else if(inputNomUtilisateur.validity.valueMissing) {
        errorNomUtilisateur.innerText = 'Ce champ est requis';
        errorNomUtilisateur.style.display = 'block';
    }

    if(inputPrenomUtilisateur.validity.valid) {
        errorPrenomUtilisateur.style.display = 'none';
    }
    else if(inputPrenomUtilisateur.validity.valueMissing) {
        errorPrenomUtilisateur.innerText = 'Ce champ est requis';
        errorPrenomUtilisateur.style.display = 'block';
    }

    if(inputCourriel.validity.valid) {
        errorCourrielUsager.style.display = 'none';
    }
    else if(inputCourriel.validity.valueMissing) {
        errorCourrielUsager.innerText = 'Ce champ est requis';
        errorCourrielUsager.style.display = 'block';
    }

    if(inputMotDePasse.validity.valid) {
        errorMotDePasseUsager.style.display = 'none';
    }
    else if(inputMotDePasse.validity.valueMissing) {
        errorMotDePasseUsager.innerText = 'Ce champ est requis';
        errorMotDePasseUsager.style.display = 'block';
    }
};

formInscription.addEventListener('reset', resetSoumission);
