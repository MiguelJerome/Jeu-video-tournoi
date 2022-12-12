import 'dotenv/config';
import https from 'https';
import { readFile } from 'fs/promises';
import express, { json, request} from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import middlewareSse from './middleware-sse.js';
import { getTournoiUtilisateur, getTournoi, addTournoi,supprimerTournoi,getTournoiInscrit,addTournoiInscrit,getIds,deleteTournoiInscrit,getNombreInscrit } from './model/admin.js';
import { addUtilisateur} from './model/utilisateur.js';
import {validateConnexion,validateInscription,validate} from './validation.js';
import './authentification.js';
/**
 * Création du serveur web
 */
let app = express();

let nombres = await getNombreInscrit();
/**
 * Création de l'engin dans Express
 */
app.engine('handlebars', engine({
    helpers: {
        afficheNombreInscrit:(id_tournois)=>{
            i++;
            for(i ;i<nombres.length;){
                console.log(id_tournois);
                if(nombres[i].id_tournois==id_tournois){
                    return nombres[i].nombre;   
                }
                else{
                    return 0;
                }
            }  
            if(i>=nombres.length){
                i=0;
            }
        }
    }
}));
/**
 * Mettre l'engin handlebars comme engin de rendu
 */
app.set('view engine', 'handlebars');
/**
 * Configuration de handlebars
 */
app.set('views', './views');
/**
 * Créer le constructeur de base de données
 */
const MemoryStore = memorystore(session);
/**
 * Ajout de middlewares
 */
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
app.use(session({
    cookie: { maxAge: 1800000 },
    name: process.env.npm_package_name,
    store: new MemoryStore({ checkPeriod: 1800000 }),
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(middlewareSse());
app.use(express.static('public'));
/**
 * Get sur la route racine
 */
app.get('/', async (request, response) => {
    if(request.user) 
    {
        response.render('acceuil', {
            titre: 'Acceuil',
            styles: ['/css/admin.css'],
            accept: request.session.accept,
            scripts: ['/js/accueil.js'],
            tournois: await getTournoi(), 
            admin:  await getTournoiUtilisateur(),
            adminLogin: request.user?.id_type_utilisateur != 2
        });
    }
    else {
        response.redirect('/connexion');
    }
});
/**
 * Get sur la route /accueil pour avoir tous les tournois
 */
app.get('/acceuil', async (request, response) => {
    if(request.user) 
    {
        response.render('acceuil', {
            titre: 'Acceuil',
            styles: ['/css/admin.css'],
            scripts: ['/js/accueil.js'],
            tournois: await getTournoi(),
            nombres : await getNombreInscrit(),
            user: request.user,
            aAcces: request.user.acces > 0,
            accept: request.session.accept,
            admin:  await getTournoiUtilisateur(),
            adminLogin: request.user?.id_type_utilisateur != 2
        });
    }
    else {
        response.redirect('/connexion');
    }
});
/**
 * Post sur la route /accueil pour s'inscrire a un tournois
 */
app.post('/acceuil', async (request, response) => {
    
    if(!request.user)
    {
        response.status(401).end();
    }
    else{
        let id = await addTournoiInscrit(request.body.id_tournois,request.user.id_utilisateur)
        response.pushJson({
            id_tournois:request.body.id_tournois,
            nom:request.user.nom,
            prenom:request.user.prenom
        }, 'add-inscrit');
    }
});
/**
 * Get sur la route /compte Pour avoir les tournois Inscrits
 */
app.get('/compte', async (request, response) => {

    if(request.user)
    {
        response.render('compte', {
            titre: 'Compte',
            styles: ['/css/admin.css'],
            scripts: ['/js/compte.js'],
            tournois: await getTournoiInscrit(request.user.id_utilisateur),
            admin:  await getTournoiUtilisateur(),  
            user: request.user,
            accept: request.session.accept,
            adminLogin: request.user.id_type_utilisateur != 2
        });
    }
    else {
        response.redirect('/connexion');
    }
});
/**
 * Delete sur la route /compte pour se desinscrire a un tournoi
 */
app.delete('/compte', async (request, response) => {

    if(request.user)
    {
        response.render('compte', {
            titre: 'Compte',
            styles: ['/css/admin.css'],
            accept: request.session.accept,
            scripts: ['/js/compte.js'],
            tournois: await deleteTournoiInscrit(request.body.id_tournois,request.user.id_utilisateur),
            adminLogin: request.user?.id_type_utilisateur != 2
        });

        response.pushJson({
            id_tournois:request.body.id_tournois,
            nom:request.user.nom,
            prenom : request.user.prenom
        }, 'delete-inscrit');
    }
});
/**
 * Get sur la route /admin pour avoir tous les tournois
 */
app.get('/admin', async(request, response) => {
    if(request.user){
    if(request.user.id_type_utilisateur == 2)
    {
        response.render('admin', {
            titre: 'Administrateur',
            styles: ['/css/admin.css'],
            scripts: ['/js/admin.js','/js/admin-form.js'],
            tournois: await getTournoi(),  
            admin:  await getTournoiUtilisateur() , 
            adminUtilisateurTournoi:  await getTournoiUtilisateur() , 
            user: request.user,
            accept: request.session.accept,
            adminLogin: request.user?.id_type_utilisateur != 2
        });
    }
    else{
        response.redirect('/');
    }
}
else{
    response.redirect('/connexion')
}
});

app.get('/nom-inscrits',async(request,response)=>{

    if(request.user)
    {
         response.status(200).json(await getTournoiUtilisateur());
    }
})

app.post('/admin', async (request, response) =>{

    if(request.user.id_type_utilisateur == 2)
    {
        if(validate(request.body)){
            console.log('Okay add tournament');
            console.table(request.body);
            let id = await addTournoi(request.body.nom, request.body.date_debut, request.body.capacite, request.body.description);
            response.pushJson({
                id_tournois:id,
                nom:request.body.nom,
                date_debut:request.body.date_debut,
                capacite:request.body.capacite,
                description:request.body.description
            },  'add-tournoi');        }
        else{
            console.log('error add tournament');
            console.log(request.body);
            response.status(400).end();
       }
    }
});

app.get('/inscription', (request, response) => {

    if(!request.user > 0 )
    {
        response.render('inscription', {
            titre: 'Inscription',
            styles: ['/css/authentification.css'],
            scripts: ['/js/inscription.js'],
            user: request.user,
            accept: request.session.accept
        });  
    }
    else {
        response.redirect('/acceuil');
    } 
});

app.get('/connexion', (request, response) => {
    if(!request.user > 0 )
    {
            response.render('connexion', {
            titre: 'Connexion',
            styles: ['/css/authentification.css'],
            scripts: ['/js/connexion.js'],
            user: request.user,
            accept: request.session.accept,
        });
    }
    else {
        response.redirect('/acceuil');
    }
});
/**
 * Post sur la route /admin pour ajouter un tournois
 */
app.get('/accueil/id', async (req,res)=>{
    let ids = await getIds(req.user.id_utilisateur); 
    res.status(200).json(ids);
});
/**
 * Delete sur la route /admin pour suprimmer un tournoi
 */
app.delete('/admin',async(request,response)=>{
    await supprimerTournoi(request.body.id);
    response.pushJson({
        id_tournois:request.body.id,
    },  'delete-tournoi');
});

app.get('/stream', (request, response) => {

    if(request.user) 
    {
        response.initStream();
    }
    else {
        response.status(401).end();
    }
});

app.post('/accept', (request, response) => {
    request.session.accept = true;
    response.status(200).end();
});
/**
 * l'utilisateur essait de se créer un compte en verifiant
 * la validation de sa tentative d'inscription
 * selon le résultat de la validation de l'inscription,
 * nous devons retourner un message au client
 */
app.post('/inscription', async (request, response, next) => {
    /**
     * On vérifie le le courriel et le mot de passe, nom utilisateur, et prenom utilisateur
     * envoyé sont valides
     */
    if(validateInscription(request.body))
    {
        /**
         * Valider les données reçu du client
         */
        if(true)
        {
            console.log(`   Ajouter un nouveau utilisateur 
                            Incription formulaire value du client:
                            Courriel: ${request.body.courriel} 
                            Mot de passe: ${request.body.motDePasse} 
                            Prenom: ${request.body.prenom} 
                            Nom: ${request.body.nom}
                        `)
                try 
                {
                    /**
                     * Si la validation passe, on crée l'utilisateur
                     */
                    await addUtilisateur(request.body.courriel,request.body.motDePasse,request.body.prenom,request.body.nom);
                    response.status(201).end();
                }
                catch(error) 
                {
                    /**
                     * S'il y a une erreur de SQL, on regarde
                     * si c'est parce qu'il y a conflit
                     * d'identifiant
                     */
                    if(error.code === 'SQLITE_CONSTRAINT') 
                    {
                        response.status(409).end();
                    }
                    else 
                    {
                        next(error);
                    }
                }
        }
    }
    else 
    {
        response.status(400).end();
    }
});
/**
 * lancer l'authentification avec passport pour la connexion
 * selon le résultat de passport, nous devons retourner un message au client
 */
app.post('/connexion', (request, response, next) => {
    
    console.log('connexion');
    /**
     * On vérifie le le courriel et le mot de passe
     * envoyé sont valides
     */
    if(validateConnexion(request.body))
    {
        /**
         * Valider les données reçu du client
         */
        if(true) 
        {
            console.log(`   Etablir une nouvelle connexion 
                                Connexion formulaire value du client:
                                Courriel: ${request.body.courriel} 
                                Mot de passe: ${request.body.motDePasse} 
                            `);
            /**
             * On lance l'authentification avec passport.js
             */
            passport.authenticate('local', (error, utilisateur, info) => 
            {
                if(error) {
                    /**
                     * S'il y a une erreur, on la passe
                     * au serveur
                     */
                    next(error);
                }          
                else if(!utilisateur) {
                    /**
                     * Si la connexion échoue, on envoit
                     * l'information au client avec un code
                     * 401 (Unauthorized)
                     */
                    response.status(401).json(info);
                }
                else {
                    /**
                     * Si tout fonctionne, on ajoute
                     * l'utilisateur dans la session et
                     * on retourne un code 200 (OK)
                     */
                    request.logIn(utilisateur, (error) => {
                        if(error) {
                            next(error);
                        }
                        else {
                            response.status(200).end();
                        }
                    });
                }
            })(request, response, next);   
        }
    }
    else {
        response.status(400).end();
    }
});
/**
 * deconnexion de la page web de l'utilisateur courant 
 */
app.post('/deconnexion', (request, response, next) => {
    /**
     * Déconnecter l'utilisateur
     */
    request.logOut((error) => {
        if(error) {
            next(error);
        }
        else {
            response.redirect('/');
        }
    });
});
/**
 * Démarrage du serveur en mode http
 */
console.info('Serveurs démarré:');
if (process.env.NODE_ENV === 'production') {
    app.listen(process.env.PORT);
    console.info(`http://localhost:${process.env.PORT}`);
}
else {
    /**
     * Sécuriser le serveur
     */
    const credentials = {
        key: await readFile('./security/localhost.key'),
        cert: await readFile('./security/localhost.cert')
    }
    /**
     * Démarrage du serveur en mode https
     */
    https.createServer(credentials, app).listen(process.env.PORT);
    console.info(`https://localhost:${process.env.PORT}`);
}