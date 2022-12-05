let formConnexion = document.getElementById('inscription-form-auth');
let inputNomUtilisateur = document.getElementById('input-nom-utilisateur');
let inputPrenomUtilisateur = document.getElementById('input-prenom-utilisateur');
let inputCourriel = document.getElementById('input-courriel-utilisateur');
let inputMotDePasse = document.getElementById('input-mot-de-passe');

formConnexion.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        nom: inputNomUtilisateur.value,
        prenom: inputPrenomUtilisateur.value,
        motDepasse:inputMotDePasse.value,
        courriel:inputCourriel.value,
    };

    console.log(data.motDepasse);

    
    let response = await fetch('/inscription', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });


    if(response.ok) {

        window.location.replace('/connexion');
     
    }
    else if(response.status === 409) {
        // Afficher erreur dans l'interface graphique
        console.log('Utilisateur déjà existant');
    }
    else {
        console.log(response.status);
        console.log('Erreur inconnu');
    }
});
