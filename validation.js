const validateNom = (nom) => {
    return typeof(nom) === 'string' && nom.length > 2
                    && nom.length < 50;
}
const validateDescription = (description) => {
    return typeof(description) === 'string' && description.length > 0
    && description.length < 200;
}

const validateDate = (date) => {
    return typeof(date) === 'string' && date.length > 0
    && date.length < 50;
}


const validateCapacite = (capacite) => {
    return typeof(capacite) === 'number' && capacite> 0
    && capacite< 16;
}

export const validate = (body) => {
    return validateNom(body.nom) && validateDescription(body.description) && validateDate(body.date_debut) && validateCapacite(body.capacite);
}


// i put this code in the post of admin and it works;
/*  if(validate(request.body)){
     response.render('admin', {
        titre: 'Administrateur',
        styles: ['/css/admin.css'],
        scripts: ['/js/admin.js'],
        id: await addTournoi(request.body.nom,request.body.date_debut,parseInt(request.body.capacite),request.body.description),
   
    });*/