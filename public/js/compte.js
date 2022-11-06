let desinscrires = document.querySelectorAll('.btn-desinscrire-tournoi');

/**
 * Fonction qui desinscrit l'utilisateur a un tournois
 * @param {number} id_tournois 
 */
async function desinscription(id_tournois){
    let data = {
        id_tournois:id_tournois
    }
    
    let response = await fetch('/compte', {
        method: 'DELETE',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
    });
  
    if(response.ok){
        document.location.reload();
    }
}

//Ajout des eventslisteners sur les boutons desinscrires
for(let i = 0 ;i < desinscrires.length;i++)
{
    desinscrires[i].addEventListener('click',()=>{
        desinscription(desinscrires[i].dataset.id)
     })
}