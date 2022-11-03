let desinscrires = document.querySelectorAll('.btn-desinscrire-tournoi');

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

for(let i = 0 ;i<desinscrires.length;i++)
{
    desinscrires[i].addEventListener('click',()=>{
        desinscription(desinscrires[i].dataset.id)
     })
}