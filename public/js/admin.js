let buttons = document.querySelectorAll('.btn-supprimer-tournoi');

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

    /**
    * Ajout de l'eventlistener sur les boutons supprimer
    */
    for(let i = 0; i < buttons.length; i++)
    {
        buttons[i].addEventListener('click',()=>{
        supprimerTournoi(buttons[i].dataset.id);
    });
}