import 'dotenv/config';
import express, { json } from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import { getTournoi, addTournoi,supprimerTournoi,getTournoiInscrit,addTournoiInscrit,getIds,deleteTournoiInscrit,getNombreInscrit } from './model/admin.js';
import { addUtilisateur } from './model/utilisateur.js';
import {validate} from './validation.js';
import './authentification.js';

// Création du serveur web
let app = express();

let i = -1;
let nombres = await getNombreInscrit();
// Création de l'engin dans Express
app.engine('handlebars', engine({
    helpers: {
        afficheNombreInscrit:(id_tournois)=>{
            i++;
            for(i ;i<nombres.length;){
                console.log(id_tournois);
                if(nombres[i].id_tournois==id_tournois){
                    return nombres[i].nombre   
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

// Mettre l'engin handlebars comme engin de rendu
app.set('view engine', 'handlebars');

// Configuration de handlebars
app.set('views', './views');

// Créer le constructeur de base de données
const MemoryStore = memorystore(session);

// Ajout de middlewares
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
app.use(express.static('public'));
// Get sur la route racine
app.get('/', async (request, response) => {
    response.render('acceuil', {
        titre: 'Acceuil',
        styles: ['/css/admin.css'],
        accept: request.session.accept,
        scripts: ['/js/accueil.js'],
        tournois: await getTournoi(), 
    });
});

//Get sur la route /accueil pour avoir tous les tournois
app.get('/acceuil', async (request, response) => {
    response.render('acceuil', {
        titre: 'Acceuil',
        styles: ['/css/admin.css'],
        accept: request.session.accept,
        scripts: ['/js/accueil.js'],
        tournois: await getTournoi(),
        nombres : await getNombreInscrit()
    });
});

//Post sur la route /accueil pour s'inscrire a un tournois
app.post('/acceuil', async (request, response) => {
    response.render('acceuil', {
        titre: 'Accueil',
        styles: ['/css/admin.css'],
        scripts: ['/js/accueil.js'],
        id: await addTournoiInscrit(request.body.id_tournois),
    });
});

//Get sur la route /compte Pour avoir les tournois Inscrits
app.get('/compte', async (request, response) => {
    response.render('compte', {
        titre: 'Compte',
        styles: ['/css/admin.css'],
        accept: request.session.accept,
        scripts: ['/js/compte.js'],
        tournois: await getTournoiInscrit(),
    });
});

//Delete sur la route /compte pour se desinscrire a un tournoi
app.delete('/compte', async (request, response) => {
    response.render('compte', {
        titre: 'Compte',
        styles: ['/css/admin.css'],
        accept: request.session.accept,
        scripts: ['/js/compte.js'],
        tournois: await deleteTournoiInscrit(request.body.id_tournois),
    });
});

//Get sur la route /admin pour avoir tous les tournois
app.get('/admin', async(request, response) => {
    response.render('admin', {
        titre: 'Administrateur',
        styles: ['/css/admin.css'],
        accept: request.session.accept,
        scripts: ['/js/admin.js','/js/admin-form.js'],
        tournois: await getTournoi(),  
    });
});

app.post('/admin', async (request, response) =>{
    if(validate(request.body)){
        console.log('Okay add tournament');
        console.log(request.body);
        addTournoi(request.body.nom, request.body.date_debut, request.body.capacite, request.body.description);
        response.status(200).end();
    }
    else{
        console.log('error add tournament');
        console.log(request.body);
        response.status(400).end();
   }
});

app.get('/inscription', (request, response) => {
    response.render('authentification', {
        titre: 'Inscription',
        styles: ['/css/authentification.css'],
        scripts: ['/js/inscription.js'],
        accept: request.session.accept
    });
});

app.get('/connexion', (request, response) => {
    response.render('authentification', {
        titre: 'Connexion',
        styles: ['/css/authentification.css'],
        scripts: ['/js/connexion.js'],
        accept: request.session.accept
    });
});

//Post sur la route /admin pour ajouter un trounois
app.get('/accueil/id', async (req,res)=>{
    let ids = await getIds(); 
    res.status(200).json(ids);
});

//Delete sur la route /admin pour suprimmer un tournoi
app.delete('/admin',async(request,response)=>{
    response.render('admin', {
        titre: 'Administrateur',
        styles: ['/css/admin.css'],
        accept: request.session.accept,
        scripts: ['/js/admin.js'],  
        tournois: await getTournoi(),
        id:await supprimerTournoi(request.body.id),
    });
});
app.post('/accept', (request, response) => {
    request.session.accept = true;
    response.status(200).end();
});

app.post('/inscription', async (request, response, next) => {
    // Valider les données reçu du client
    if(true) {
        try {
            await addUtilisateur(request.body.courriel, request.body.motDePasse);
            response.status(201).end();
        }
        catch(error) {
            if(error.code === 'SQLITE_CONSTRAINT') {
                response.status(409).end();
            }
            else {
                next(error);
            }
        }
    }
    else {
        response.status(400).end();
    }
});

app.post('/connexion', (request, response, next) => {
    // Valider les données reçu du client
    console.log('connexion');

    if(true) {
        passport.authenticate('local', (error, utilisateur, info) => {
            if(error) {
                next(error);
            }
            else if(!utilisateur) {
                response.status(401).json(info);
            }
            else {
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
    else {
        response.status(400).end();
    }
});

app.post('/deconnexion', (request, response, next) => {
    request.logOut((error) => {
        if(error) {
            next(error);
        }
        else {
            response.redirect('/');
        }
    });
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.log(`Serveur démarré: http://localhost:${process.env.PORT}`);