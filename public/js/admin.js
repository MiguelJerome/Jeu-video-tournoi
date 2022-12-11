let buttons = document.querySelectorAll('.btn-supprimer-tournoi');
let cardDivs = document.querySelectorAll('#card-nom');
let nomIsncrits = document.querySelectorAll('#card-nom p');
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
       
        for(let i = 0;i<data.length;i++){
            for(let  j =0; j<cardDivs.length;j++){
             
                if(cardDivs[j].dataset.id == data[i].id_tournois)
                {    
                    let p = document.createElement('p');
                    p.innerText = `${data[i].prenom}  ${data[i].nom}`;
                    p.classList.add('name');
                    p.dataset.id = data[i].id_tournois;
                    cardDivs[j].append(p); 
                    i == data[i].id_tournois;     
                }    
            }
        }
    } 
}

getInscrits();

async function addNomInscritLive(id_tournois,prenom,nom){  
    let p = document.createElement('p');
    p.dataset.id = id_tournois;
    p.innerText = prenom+" "+nom;
    p.classList.add('name')
    console.log(id_tournois)
    console.log(cardDivs[id_tournois-1])
    for(let i = 0;i<cardDivs.length;i++){
        if(cardDivs[i].dataset.id==id_tournois){
            cardDivs[i].append(p);
        }
    }
}

let source =  new EventSource('/stream');

source.addEventListener('add-inscrit', (event) => {
    let data = JSON.parse(event.data);
    console.log(data)
    addNomInscritLive(data.id_tournois,data.prenom,data.nom);
});

async function deleteNomLive(id,nom,prenom,mesNoms){
   for(let i = 0;i<mesNoms.length;i++){
    console.warn(`${mesNoms[i].dataset.id}==${id}`);
    console.warn(mesNoms[i].dataset.id==id);
    if(mesNoms[i].dataset.id ==id&&mesNoms[i].innerText ==`${prenom} ${nom}`){
        mesNoms[i].remove();
    }
   
   }
}

    source.addEventListener('delete-inscrit', (event) => {
        let data = JSON.parse(event.data);
        let mesNoms = document.querySelectorAll('p.name');
        deleteNomLive(data.id_tournois,data.nom,data.prenom,mesNoms);
    });

function deleteTournoiLive(id){

    let grid = document.querySelectorAll('.grid-example');

    for(let i=0;i<grid.length;i++){
        if(grid[i].dataset.id===id){
            grid[i].remove();
        }
    }
}

source.addEventListener('delete-tournoi', (event) => {
    let data = JSON.parse(event.data);
    deleteTournoiLive(data.id_tournois)
});
