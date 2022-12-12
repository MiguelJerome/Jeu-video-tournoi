import { compare } from "bcrypt";
import passport from 'passport';
import { Strategy } from "passport-local";
import { getUtilisateurByCourriel } from "./model/utilisateur.js";

/**
 * Configuration générale de la stratégie.
 * On indique ici qu'on s'attends à ce que le client
 * envoit un variable "courriel" et "motDePasse" au
 * serveur pour l'authentification.
 */
let config = {
    usernameField: 'courriel',
    passwordField: 'motDePasse'
};
/**
 * Configuration de quoi faire avec l'identifiant
 * et le mot de passe pour les valider
 */
passport.use(new Strategy(config, async (courriel, motDePasse, done) => {
        /**
         * S'il y a une erreur avec la base de données,
         * on retourne l'erreur au serveur
         */
    try {
        /**
         * On va chercher l'utilisateur dans la base
         * de données avec son identifiant, le
         * courriel ici
         */
        let utilisateur = await getUtilisateurByCourriel(courriel);
        /**
         * Si on ne trouve pas l'utilisateur, on
         * retourne que l'authentification a échoué
         * avec un message
         */
        if(!utilisateur) {
            return done(null, false, { erreur: 'erreur_nom_utilisateur' });
        }
        /**
         * Si on a trouvé l'utilisateur, on compare
         * son mot de passe dans la base de données
         * avec celui envoyé au serveur. On utilise
         * une fonction de bcrypt pour le faire
         */ 
        let valide = await compare(motDePasse, utilisateur.mot_passe);
        /**
         * Si les mot de passe ne concorde pas, on
         * retourne que l'authentification a échoué
         * avec un message
         */
        if(!valide) {
            return done(null, false, { erreur: 'erreur_mot_de_passe' });
        }
        /**
         * Si les mot de passe concorde, on retourne
         * l'information de l'utilisateur au serveur
         */
        return done(null, utilisateur);
    }
    catch(error) {
        return done(error);
    }
}));

passport.serializeUser((utilisateur, done) => {
    done(null, utilisateur.courriel);
});

passport.deserializeUser(async (courriel, done) => {
    try {
        let utilisateur = await getUtilisateurByCourriel(courriel);
        done(null, utilisateur);
    }
    catch(error) {
        done(error);
    }
});
