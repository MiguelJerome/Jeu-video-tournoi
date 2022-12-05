let formAuth = document.getElementById('form-auth');

// Nom usager: validation du formulaire connexion usager
let inputCourriel = document.getElementById('input-courriel-utilisateur');
let errorCourrielUsager = document.getElementById('error-courriel-authentification');

const validateNomUsager = () => {
    if(inputCourriel.validity.valid) {
        errorCourrielUsager.style.display = 'none';
    }
    else if(inputCourriel.validity.valueMissing) {
        errorCourrielUsager.innerText = 'Ce champ est requis';
        errorCourrielUsager.style.display = 'block';
    }
};

formAuth.addEventListener('submit', validateNomUsager);

let inputMotDePasse = document.getElementById('input-mot-de-passe');
let errorMotDePasseUsager = document.getElementById('error-MotDePasse-authentification');

const validateMotDePasseUsager = () => {
    if(inputMotDePasse.validity.valid) {
        errorMotDePasselUsager.style.display = 'none';
    }
    else if(inputMotDePasse.validity.valueMissing) {
        errorMotDePasseUsager.innerText = 'Ce champ est requis';
        errorMotDePasseUsager.style.display = 'block';
    }
};

formAuth.addEventListener('submit', validateMotDePasseUsager);


formAuth.addEventListener('submit', async (event) => {
    event.preventDefault();

    if(!formAuth.checkValidity()){
        return;
    }

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
    await document.location.reload(); 
}

    if(response.ok) {
        await document.location.replace('/');  
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
