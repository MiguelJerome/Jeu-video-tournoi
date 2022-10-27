//import connectionPromise from '../model/connexion.js';
//var popupS = require('popups');

async function ajouterTournoi(event) {
    event.preventDefault();
    
    // get les valeurs des inputs du formulaire admin ajouter tournoi
    const nomTournoi = await document.querySelector('#nom-tournoi').value.trim();
    const descriptionTournoi = await document.querySelector('#description-tournoi').value.trim();
    const dateDebutTournoi = await document.querySelector('#date-debut-tournoi').value.trim();
    const capaciteTournoi = await document.querySelector('#capacite-tournoi').value.trim();
/*
    let connexion = await connectionPromise;

    let resultat = await connexion.run(
        `INSERT INTO type_utilisateur (type) VALUES 
        ('regulier1'),
        ('administrateur1');`
    );
*/
   
    //effacer les input du formulaire admin ajouter tournoi
    document.querySelector('#nom-tournoi').value = "sa marche";
    document.querySelector('#description-tournoi').value = "";
    document.querySelector('#date-debut-tournoi').value = "";
    document.querySelector('#capacite-tournoi').value = "";
  
   
  };
  
  document.querySelector('.form-admin-wrapper').addEventListener('submit', ajouterTournoi);