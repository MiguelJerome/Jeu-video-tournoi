let buttons = document.querySelectorAll('.btn-supprimer-tournoi');
let cardDivs = document.querySelectorAll('#card-nom');

  /**
   * Suprimer un tournoi
   * @param {Number} id 
   */
async function supprimerTournoi(id){
    let data = {
        id:id
    };

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



async function getInscrits(){
    let response = await fetch('/nom-inscrits');
    
    if(response.ok){
        let data =await  response.json();
        
        for( let i = 0;i<data.length;i++){
            for(let  j =0;j<cardDivs.length;j++){
                
                if(cardDivs[j].dataset.id == data[i].id_tournois){
                    
                    let p = document.createElement('p');
                    p.innerText = `${data[i].prenom}  ${data[i].nom}`;
                    cardDivs[j].append(p);      
                }
            }
        }
    }
    
}

getInscrits();



async function addNomInscritLive(id_tournois,prenom,nom){
    
    
    let p = document.createElement('p');
    p.innerText = await prenom;
    p.innerText = await nom;
    cardDivs[id_tournois-1].append(p);
    console.log(cardDivs[id_tournois])
   
}


let source =  new EventSource('/stream');

source.addEventListener('add-inscrit', (event) => {
    let data = JSON.parse(event.data);
    addNomInscritLive(data.id_tournois,data.prenom,data.nom);
});
