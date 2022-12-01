// Reference avec le bouton inscrire et le bouton desinscricre
let inscrires = document.querySelectorAll('.btn-inscription-tournoi');
let desincrire = document.querySelectorAll('.btn-desinscrire-tournoi');

//Fonction qui permet de soumettre le formulaire d'inscription
async function disableButton(){
    let response = await fetch('/accueil/id');

    if(response.ok){
        let data = await response.json();
            for(let i = 0;i<data.length;i++){
             for(let j = 0; j<inscrires.length;j++){
                    let id = data[i].id_tournois;
                    if(id==inscrires[j].dataset.id){
                        inscrires[j].disabled = true;
                         inscrires[j].innerText = "INCRIT";
                    }
             }
        }
    }
}

/**
 * Fonction qui inscrit l'utilisateur a un cours.
 * @param {number} id_tournois 
 */
async function inscription(id_tournois){
      
    let data = {
      id_tournois:id_tournois
    };
  
    let response = await fetch('/acceuil', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
  });

  if(response.ok){
    let data = await response.json();
  }
}

/**
 * Ajout des eventslistenener sur les boutons inscriptions
 */
for(let i = 0;i<inscrires.length;i++)
{
    inscrires[i].addEventListener('click',()=>{
        inscription(inscrires[i].dataset.id);
        inscrires[i].style.backgroundColor = "gray";
        inscrires[i].disabled = true;
        inscrires[i].innerText = "INCRIT";
    });
}

await disableButton();