let formAuth = document.getElementById('form-auth');
let inputNomUtilisateur = document.getElementById('input-nom-utilisateur');
let inputPrenomUtilisateur = document.getElementById('input-prenom-utilisateur');
let inputCourriel = document.getElementById('input-courriel-utilisateur');
let inputMotDePasse = document.getElementById('input-mot-de-passe');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        nomUtilisateur: inputNomUtilisateur.value,
        prenomUtilisateur: inputNomUtilisateur.value,
        courriel: inputCourriel.value,
        motDePasse: inputMotDePasse.value
    };

    let response = await fetch('/inscription', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        window.location.replace('/connexion');
        inputNomUtilisateur.value = '';
        inputMotDePasse.value = '';
        inputPrenomUtilisateur.value = '';
        inputMotDePasse.value = '';
    }
    else if(response.status === 409) {
        // Afficher erreur dans l'interface graphique
        console.log('Utilisateur déjà existant');
    }
    else {
        console.log('Erreur inconnu');
    }
});
