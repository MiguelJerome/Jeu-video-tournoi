let form = document.getElementById('form-admin');

// Nom tournoi
let inputNomTournoi = document.getElementById('nom-tournoi');
let errorNomTournoi = document.getElementById('error-nom-tournoi');
const validateNomTournoi = () => {
    if(inputNomTournoi.validity.valid) {
        errorNomTournoi.style.display = 'none';
    }
    else if(inputNomTournoi.validity.valueMissing) {
        errorNomTournoi.innerText = 'Ce champ est requis';
        errorNomTournoi.style.display = 'block';
    }
}

form.addEventListener('submit', validateNomTournoi);

// Capacite
let inputCapacite = document.getElementById('capacite-tournoi');
let errorCapacite = document.getElementById('error-capacite');
const validateCapacite = () => {
    if(inputCapacite.validity.valid) {
        errorCapacite.style.display = 'none';
    }
    else if(inputCapacite.validity.valueMissing) {
        errorCapacite.innerText = 'Ce champ est requis';
        errorCapacite.style.display = 'block';
    }
    else if(inputCapacite.validity.rangeUnderflow) {
        errorCapacite.innerText = 'La valeur doit être supérieure à 0';
        errorCapacite.style.display = 'block';
    }
    else if(inputCapacite.validity.rangeOverflow) {
        errorCapacite.innerText = 'La valeur doit être inférieure ou égale à 16';
        errorCapacite.style.display = 'block';
    }
}

form.addEventListener('submit', validateCapacite);

// Date
let inputDate = document.getElementById('date-debut-tournoi');
let errorDate = document.getElementById('error-date');
const validateDate = () => {
    if(inputDate.validity.valid) {
        errorDate.style.display = 'none';
    }
    else if(inputDate.validity.valueMissing) {
        errorDate.innerText = 'Ce champ est requis';
        errorDate.style.display = 'block';
    }
    else if(inputDate.validity.typeMismatch) {
        errorDate.innerText = 'Le format est invalide';
        errorDate.style.display = 'block';
    }
    
}

form.addEventListener('submit', validateDate);

// Description
let inputDescription = document.getElementById('description-tournoi');
let errorDescription = document.getElementById('error-description');
const validateDescription = () => {
    if(inputDescription.validity.valid) {
        errorDescription.style.display = 'none';
    }
    else if(inputDescription.validity.valueMissing) {
        errorDescription.innerText = 'Ce champ est requis';
        errorDescription.style.display = 'block';
    }
    else if(inputDescription.validity.tooShort) {
        errorDescription.innerText = 'Le message doit avoir au moins 10 caractères';
        errorDescription.style.display = 'block';
    }
    else if(inputDescription.validity.tooLong) {
        errorDescription.innerText = 'Le message doit avoir au maximum 50 caractères';
        errorDescription.style.display = 'block';
    }
}

form.addEventListener('submit', validateDescription);

// Soumission
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if(!form.checkValidity()){
        return;
    }

    let data = {
        nom: inputNomTournoi.value,
        description: inputDescription.value,
        date_debut: inputDate.value,
        capacite: parseInt(inputCapacite.value),
    }

    let response = await fetch('/admin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });

    if(response.ok) {
        document.location.reload();
        inputNomTournoi.value = '';
        inputCapacite.value = '';
        inputDate.value = '';
        inputDescription.value = '';
    }
});
