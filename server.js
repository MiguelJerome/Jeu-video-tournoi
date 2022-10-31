import 'dotenv/config';
import express, { json } from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { getTournoi, addTournoi,supprimerTournoi } from './model/admin.js';

// Création du serveur web
let app = express();

// Création de l'engin dans Express
app.engine('handlebars', engine());

// Mettre l'engin handlebars comme engin de rendu
app.set('view engine', 'handlebars');

// Configuration de handlebars
app.set('views', './views');

// Ajout de middlewares
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(json());
app.use(express.static('public'));

// Programmation de routes
app.get('/', async (request, response) => {
    response.render('acceuil', {
        titre: 'Acceuil',
        styles: ['/css/admin.css'],
        tournois: await getTournoi(),  
    });
})

app.get('/acceuil', async (request, response) => {
    response.render('acceuil', {
        titre: 'Acceuil',
        styles: ['/css/admin.css'],
        tournois: await getTournoi(),
    });
})

app.get('/compte', async (request, response) => {
    response.render('compte', {
        titre: 'Compte',
        styles: ['/css/admin.css'],
        tournois: await getTournoi()
    });
})

app.get('/admin', async(request, response) => {
    response.render('admin', {
        titre: 'Administrateur',
        styles: ['/css/admin.css'],
        scripts: ['/js/admin.js'],
        tournois: await getTournoi(),
    });
})


app.post('/admin', async (request, response) =>{
     response.render('admin', {
        titre: 'Administrateur',
        styles: ['/css/admin.css'],
        scripts: ['/js/admin.js'],
        id: await addTournoi(request.body.nom,request.body.date_debut,request.body.capacite,request.body.description),   
    });
});

app.delete('/admin',async(request,response)=>{
    response.render('admin', {
        titre: 'Administrateur',
        styles: ['/css/admin.css'],
        scripts: ['/js/admin.js'],  
        tournois: await getTournoi(),
        id:await supprimerTournoi(request.body.id)
    });
})

// Démarrage du serveur
app.listen(process.env.PORT);
console.log(`Serveur démarré: http://localhost:${process.env.PORT}`);
