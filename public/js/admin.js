async function ajouterTournoi(event) {
    event.preventDefault();
  
    // get les valeurs des inputs du formulaire admin ajouter tournoi
    const nomTournoi = await document.querySelector('#nom-tournoi').value.trim();
    const descriptionTournoi = await document.querySelector('#description-tournoi').value.trim();
    const dateDebutTournoi = await document.querySelector('#date-debut-tournoi').value.trim();
    const capaciteTournoi = await document.querySelector('#capacite-tournoi').value.trim();

    //effacer les input du formulaire admin ajouter tournoi
    document.querySelector('#nom-tournoi').value = "";
    document.querySelector('#description-tournoi').value = "";
    document.querySelector('#date-debut-tournoi').value = "";
    document.querySelector('#capacite-tournoi').value = "";
   
}
  
  document.querySelector('.form-admin-wrapper').addEventListener('submit', ajouterTournoi);