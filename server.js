import 'dotenv/config';
import express, { json} from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import session from 'express-session';
import memorystore from 'memorystore';
import passport from 'passport';
import middlewareSse from './middleware-sse.js';
import { getTournoiUtilisateur, getTournoi, addTournoi,supprimerTournoi,getTournoiInscrit,addTournoiInscrit,getIds,deleteTournoiInscrit,getNombreInscrit } from './model/admin.js';
import { addUtilisateur, getUtilisateurByCourriel } from './model/utilisateur.js';
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
console.log(await getTournoiUtilisateur());
// Get sur la route racine
app.get('/', async (request, response) => {
    if(request.user) {
    response.render('acceuil', {
        titre: 'Acceuil',
        styles: ['/css/admin.css'],
        accept: request.session.accept,
        scripts: ['/js/accueil.js'],
        tournois: await getTournoi(), 
        admin:  await getTournoiUtilisateur(),
       
    });
}
else {
    response.redirect('/connexion');
}
});
console.log(await getTournoiUtilisateur());
//Get sur la route /accueil pour avoir tous les tournois
app.get('/acceuil', async (request, response) => {
    if(request.user) {
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

//Post sur la route /accueil pour s'inscrire a un tournois

app.post('/acceuil', async (request, response) => {
    if(request.user){
        response.render('acceuil', {
            titre: 'Accueil',
            styles: ['/css/admin.css'],
            scripts: ['/js/accueil.js'],
            id: await addTournoiInscrit(request.body.id_tournois),
            
        });    
    }
});

//Get sur la route /compte Pour avoir les tournois Inscrits
app.get('/compte', async (request, response) => {

    if(request.user){

        response.render('compte', {
            titre: 'Compte',
            styles: ['/css/admin.css'],
            scripts: ['/js/compte.js'],
            tournois: await getTournoiInscrit(),
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

//Delete sur la route /compte pour se desinscrire a un tournoi
app.delete('/compte', async (request, response) => {

    if(request.user){

        response.render('compte', {
            titre: 'Compte',
            styles: ['/css/admin.css'],
            accept: request.session.accept,
            scripts: ['/js/compte.js'],
            tournois: await deleteTournoiInscrit(request.body.id_tournois),
        });
    }
});

//Get sur la route /admin pour avoir tous les tournois
app.get('/admin', async(request, response) => {
    if(request.user.id_type_utilisateur == 2){
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
        response.redirect('/connexion');
    }

});

app.post('/admin', async (request, response) =>{

    if(request.user.id_type_utilisateur == 2){

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
    }
});

app.get('/inscription', (request, response) => {

        response.render('inscription', {
            titre: 'Inscription',
            styles: ['/css/authentification.css'],
            scripts: ['/js/inscription.js'],
            user: request.user,
            accept: request.session.accept
        });
        
            
      
    
});

app.get('/connexion', (request, response) => {
    response.render('connexion', {
        titre: 'Connexion',
        styles: ['/css/authentification.css'],
        scripts: ['/js/connexion.js'],
        user: request.user,
        accept: request.session.accept,
        adminLogin: request.user?.id_type_utilisateur != 2
    });
});

//Post sur la route /admin pour ajouter un trounois
app.get('/accueil/id', async (req,res)=>{
    let ids = await getIds(); 
    res.status(200).json(ids);
});

//Delete sur la route /admin pour suprimmer un tournoi
app.delete('/admin',async(request,response)=>{

    if(request.user.id_type_utilisateur == 2){

        response.render('admin', {
            titre: 'Administrateur',
            styles: ['/css/admin.css'],
            accept: request.session.accept,
            scripts: ['/js/admin.js'],  
            tournois: await getTournoi(),
            id:await supprimerTournoi(request.body.id),
        });
    }
});

app.get('/stream', (request, response) => {
    if(request.user) {
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

app.post('/inscription', async (request, response, next) => {
    // Valider les données reçu du client
    
    if(true) {
        try {
            await addUtilisateur(request.body.courriel,request.body.motDepasse,request.body.prenom,request.body.nom);
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