let buttons = document.querySelectorAll('.btn-supprimer-tournoi');


async function ajouterTournoiServeur(event) {
    event.preventDefault();
    
    // get les valeurs des inputs du formulaire admin ajouter tournoi
    const nomTournoi = await document.querySelector('#nom-tournoi').value.trim();
    const descriptionTournoi = await document.querySelector('#description-tournoi').value.trim();
    const dateDebutTournoi = await document.querySelector('#date-debut-tournoi').value.trim();
    const capaciteTournoi = await document.querySelector('#capacite-tournoi').value.trim();

    //Les donnees a jouter au serveur
    let data = {
        nom:nomTournoi,
        date_debut:dateDebutTournoi,
        capacite : capaciteTournoi,
        description:descriptionTournoi
    }

    let response = await fetch('/admin', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok){
        document.location.reload();
        let data = await response.json();
    }

    //effacer les input du formulaire admin ajouter tournoi
    document.querySelector('#nom-tournoi').value = "";
    document.querySelector('#description-tournoi').value = "";
    document.querySelector('#date-debut-tournoi').value = "";
    document.querySelector('#capacite-tournoi').value = "";
};

  /**
   * Suprimer un tournoi
   * @param {Number} id 
   */
async function supprimerTournoi(id){
    let data = {
        id:id
    }

    let response = await fetch('/admin', {
        method: 'DELETE',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok){
        document.location.reload();
        let data = await response.json();
    }
}
  
document.querySelector('.form-admin-wrapper').addEventListener('submit', ajouterTournoiServeur);
    for(let i = 0; i < buttons.length; i++)
    {
        buttons[i].addEventListener('click',()=>{
        supprimerTournoi(buttons[i].dataset.id);
    });
}