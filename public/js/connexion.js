let formAuth = document.getElementById("form-auth");
/**
 * courriel usager: validation du formulaire connexion usager
 */
let inputCourriel = document.getElementById("input-courriel-utilisateur");
let errorCourrielUsager = document.getElementById(
  "error-courriel-authentification"
);

const validateCourrielUsager = () => {
  if (inputCourriel.validity.valid) {
    errorCourrielUsager.style.display = "none";
  } else if (inputCourriel.validity.valueMissing) {
    errorCourrielUsager.innerText = "Ce champ est requis";
    errorCourrielUsager.style.display = "block";
  } else if (inputCourriel.validity.typeMismatch) {
    errorCourrielUsager.innerText = "Ce champ n est pas valide comme email";
    errorCourrielUsager.style.display = "block";
  }
};

formAuth.addEventListener("submit", validateCourrielUsager);
/**
 * Mot de passe de l'usager: validation du formulaire connexion usager
 */
let inputMotDePasse = document.getElementById("input-mot-de-passe");
let errorMotDePasseUsager = document.getElementById(
  "error-MotDePasse-authentification"
);

const validateMotDePasseUsager = () => {
  if (inputMotDePasse.validity.valid) {
    errorMotDePasseUsager.style.display = "none";
  } else if (inputMotDePasse.validity.valueMissing) {
    errorMotDePasseUsager.innerText = "Ce champ est requis";
    errorMotDePasseUsager.style.display = "block";
  }
};

formAuth.addEventListener("submit", validateMotDePasseUsager);
/**
 * Soumission : envoyer les inputs du formulaire connexion
 * pour donner la permission d'acces au page du site Web
 */
formAuth.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!formAuth.checkValidity()) {
    return;
  }
  /**
   * Les noms des variables doivent être les mêmes
   * que celles spécifié dans les configuration de
   * passport dans le fichier "authentification.js"
   */
  let data = {
    courriel: inputCourriel.value,
    motDePasse: inputMotDePasse.value,
  };

  if (inputCourriel && inputMotDePasse) {
    let response = await fetch("/connexion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      /**
       * Si l'authentification est réussi, on
       * redirige vers la page root
       */
      document.location.replace("/");
      document.location.reload();
    } else if (response.status === 401) {
      /**
       * Si l'authentification ne réussi pas, on
       *  a le message d'erreur dans l'objet "data"
       */
      let info = await response.json();
      let p = document.createElement("p");
      p.innerText = info.erreur;
      p.style.color = "red";
      /**
       * Afficher erreur dans l'interface graphique
       */
      formAuth.append(p);
      console.log(info.erreur);
    } else {
      console.log("Erreur inconnu");
    }
  }
});
/**
 * bouton reset : validation du formulaire connexion usager
 */
const resetSoumission = () => {
  document.location.reload();
  inputCourriel.value = "";
  inputMotDePasse.value = "";

  if (inputCourriel.validity.valid) {
    errorCourrielUsager.style.display = "none";
  } else if (inputCourriel.validity.valueMissing) {
    errorCourrielUsager.innerText = "Ce champ est requis";
    errorCourrielUsager.style.display = "block";
  }

  if (inputMotDePasse.validity.valid) {
    errorMotDePasseUsager.style.display = "none";
  } else if (inputMotDePasse.validity.valueMissing) {
    errorMotDePasseUsager.innerText = "Ce champ est requis";
    errorMotDePasseUsager.style.display = "block";
  }
};

formAuth.addEventListener("reset", resetSoumission);
