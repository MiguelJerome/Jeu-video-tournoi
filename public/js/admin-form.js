let form = document.getElementById("form-admin");
/**
 * Nom tournoi: validation du formulaire ajouter tournoi
 */
let inputNomTournoi = document.getElementById("nom-tournoi");
let errorNomTournoi = document.getElementById("error-nom-tournoi");
const validateNomTournoi = () => {
  if (inputNomTournoi.validity.valid) {
    errorNomTournoi.style.display = "none";
  } else if (inputNomTournoi.validity.valueMissing) {
    errorNomTournoi.innerText = "Ce champ est requis";
    errorNomTournoi.style.display = "block";
  }
};

form.addEventListener("submit", validateNomTournoi);
/**
 * Capacite : validation du formulaire ajouter tournoi
 */
let inputCapacite = document.getElementById("capacite-tournoi");
let errorCapacite = document.getElementById("error-capacite");
const validateCapacite = () => {
  if (inputCapacite.validity.valid) {
    errorCapacite.style.display = "none";
  } else if (inputCapacite.validity.valueMissing) {
    errorCapacite.innerText = "Ce champ est requis";
    errorCapacite.style.display = "block";
  } else if (inputCapacite.validity.rangeUnderflow) {
    errorCapacite.innerText = "La valeur doit être supérieure à 0";
    errorCapacite.style.display = "block";
  } else if (inputCapacite.validity.rangeOverflow) {
    errorCapacite.innerText = "La valeur doit être inférieure ou égale à 16";
    errorCapacite.style.display = "block";
  }
};

form.addEventListener("submit", validateCapacite);
/**
 * Date : validation du formulaire ajouter tournoi
 */
let inputDate = document.getElementById("date-debut-tournoi");
let errorDate = document.getElementById("error-date");
const validateDate = () => {
  if (inputDate.validity.valid) {
    errorDate.style.display = "none";
  } else if (inputDate.validity.valueMissing) {
    errorDate.innerText = "Ce champ est requis";
    errorDate.style.display = "block";
  } else if (inputDate.validity.typeMismatch) {
    errorDate.innerText = "Le format est invalide";
    errorDate.style.display = "block";
  }
};

form.addEventListener("submit", validateDate);
/**
 * Description : validation du formulaire ajouter tournoi
 */
let inputDescription = document.getElementById("description-tournoi");
let errorDescription = document.getElementById("error-description");
const validateDescription = () => {
  if (inputDescription.validity.valid) {
    errorDescription.style.display = "none";
  } else if (inputDescription.validity.valueMissing) {
    errorDescription.innerText = "Ce champ est requis";
    errorDescription.style.display = "block";
  } else if (inputDescription.validity.tooShort) {
    errorDescription.innerText = "Le message doit avoir au moins 10 caractères";
    errorDescription.style.display = "block";
  } else if (inputDescription.validity.tooLong) {
    errorDescription.innerText =
      "Le message doit avoir au maximum 50 caractères";
    errorDescription.style.display = "block";
  }
};

form.addEventListener("submit", validateDescription);
/**
 * Soumission : envoyer les inputs du formulaire ajouter tournoi
 * pour etre eventuelle sauver dans la base de données
 */
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    return;
  }

  let data = {
    nom: inputNomTournoi.value,
    description: inputDescription.value,
    date_debut: inputDate.value,
    capacite: parseInt(inputCapacite.value),
  };

  let response = await fetch("/admin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    inputNomTournoi.value = "";
    inputCapacite.value = "";
    inputDate.value = "";
    inputDescription.value = "";
  }
});
/**
 * bouton reset : validation du formulaire ajouter tournoi
 */
const resetSoumission = () => {
  document.location.reload();
  inputNomTournoi.value = "";
  inputCapacite.value = "";
  inputDate.value = "";
  inputDescription.value = "";

  if (inputNomTournoi.validity.valid) {
    errorNomTournoi.style.display = "none";
  } else if (inputNomTournoi.validity.valueMissing) {
    errorNomTournoi.innerText = "Ce champ est requis";
    errorNomTournoi.style.display = "block";
  }

  if (inputDescription.validity.valid) {
    errorDescription.style.display = "none";
  } else if (inputDescription.validity.valueMissing) {
    errorDescription.innerText = "Ce champ est requis";
    errorDescription.style.display = "block";
  }

  if (inputDate.validity.valid) {
    errorDate.style.display = "none";
  } else if (inputDate.validity.valueMissing) {
    errorDate.innerText = "Ce champ est requis";
    errorDate.style.display = "block";
  }

  if (inputCapacite.validity.valid) {
    errorCapacite.style.display = "none";
  } else if (inputCapacite.validity.valueMissing) {
    errorCapacite.innerText = "Ce champ est requis";
    errorCapacite.style.display = "block";
  }
};

form.addEventListener("reset", resetSoumission);

let source = new EventSource("/stream");

source.addEventListener("add-tournoi", (event) => {
  let data = JSON.parse(event.data);
  let adminGrid = document.getElementById("admin-tournoi-live");

  adminGrid.innerHTML += `<div class="grid-example col s12 m6" data-id="${data.id_tournois}">
    <!--ceci est le wrapper carte tournoi-->
    <div class="tournoi-card">
        <!--ceci est le wrapper grid de colonne pour les cartes tournoi-->
        <div class="card">
            <!--ceci est la composante  tournoi info-->
            <!--ceci est le wrapper pour la carte info tournoi-->
            <div class="tournoi-card-info">
            <!--ceci est l'image et le title d un tournoi-->
                <div class="card-image">
                    <img src="/img/2208_w023_n003_2818b_p1_2818.jpg">
                        <span class="card-title">Tournoi Info</span>
                </div>
            <!--ceci est les wrappers pour la carte info tournoi-->
                    <div class ="card-content">
                        <div class=" card-content">   
            <!-- voici les composantes pour montrer que les donnees d un tournoi-->   
                            <!--ceci est le wrapper et les infos pour montrer le id de la table tournoi--> 
                            <div class ="tournoi-info">
                                <p><span>Numero Tournoi:</span>${data.id_tournois}</p>
                            </div>                <!--ceci est le wrapper et les infos pour montrer le nom de la table tournoi--> 
                            <div class ="tournoi-info">
                                <p><span>Nom:</span>${data.nom}</p>
                            </div>                <!--ceci est le wrapper et les infos pour montrer la description de la table tournoi--> 
                            <div class ="tournoi-info">
                                <p><span>Description:</span>${data.description}</p>
                            </div>                <!--ceci est le wrapper et les infos pour montrer la Capacite de la table tournoi--> 
                            <div class ="tournoi-info">
                                <p><span>Capacite:</span>${data.capacite}</p>
                            </div>                <!--ceci est le wrapper et les infos pour montrer la date_debut de la table tournoi--> 
                             <div class ="tournoi-info">
                                <p><span>Date debut:</span>${data.date_debut}</p>
                            </div>            </div>
                    </div>
            </div>                <!--ceci est le wrapper du background pour la carte tournoi-->
            <div class=" card-background  card-content ">
                <!--ceci est le wrapper pour la liste des participants tournois pour la carte tournoi pour la page admin-->
                <div class="message-participant-tournoi card-content">
                    <!--ceci est la liste des participants tournois pour la carte tournoi pour la page admin-->
                    <span>Liste des Participants:</span>
                    <div class="message-participant-tournoi data-id="${data.id_tournois}">
                        <li data-id="${data.id_tournois}" id="card-nom"></li>
                    </div>
                </div>
                <!--ceci est la composante pour le bouton supprimer de la page admin-->
                <!--ceci est le bouton pour supprimer tournoi de la page admin--> 
                <button type="submit" class="btn-supprimer-tournoi pulse" data-id="${data.id_tournois}">Supprimer Tournoi</button>                </div>
        </div>
    </div>
</div>`;
  resetSoumission();
});
