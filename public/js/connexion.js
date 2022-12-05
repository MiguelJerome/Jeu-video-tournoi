let formAuth = document.getElementById('form-auth');
let inputCourriel = document.getElementById('input-courriel-utilisateur');
let inputMotDePasse = document.getElementById('input-mot-de-passe');

formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    let data = {
        courriel: inputCourriel.value,
        motDePasse: inputMotDePasse.value
    };

if(inputCourriel && inputMotDePasse)
{
    let response = await fetch('/connexion', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

    if(response.ok) { 
        document.location.replace('/acceuil');  
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
