let formAuth = document.getElementById('form-auth');
let inputNomUtilisateur = document.getElementById('input-nom-utilisateur');
let inputMotDePasse = document.getElementById('input-mot-de-passe');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        courriel: inputNomUtilisateur.value,
        motDePasse: inputMotDePasse.value
    };

    console.log(data);

    let response = await fetch('/connexion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

   console.log(response);

    if(response.ok) {
        window.location.replace('/');
        
    }
    else if(response.status === 401) {
        let info = await response.json();

        // Afficher erreur dans l'interface graphique
        console.log(info);
    }
    else {
        console.log('Erreur inconnu');
    }
});
