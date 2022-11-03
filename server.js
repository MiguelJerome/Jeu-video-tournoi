import 'dotenv/config';
import express, { json } from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { getTournoi, addTournoi,supprimerTournoi,getTournoiInscrit,addTournoiInscrit,getIds,deleteTournoiInscrit,getNombreInscrit } from './model/admin.js';

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
                console.log(id_tournois)
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
        scripts: ['/js/accueil.js'],
        tournois: await getTournoi(), 
    });
})

app.get('/acceuil', async (request, response) => {
    response.render('acceuil', {
        titre: 'Acceuil',
        styles: ['/css/admin.css'],
        scripts: ['/js/accueil.js'],
        tournois: await getTournoi(),
        nombres :await getNombreInscrit()
    });
})

app.post('/acceuil', async (request, response) => {
    response.render('acceuil', {
        titre: 'Accueil',
        styles: ['/css/admin.css'],
        scripts: ['/js/accueil.js'],
        id:await addTournoiInscrit(request.body.id_tournois),

    });
})

app.get('/compte', async (request, response) => {
    response.render('compte', {
        titre: 'Compte',
        styles: ['/css/admin.css'],
        scripts: ['/js/compte.js'],
        tournois: await getTournoiInscrit(),

    });
})

app.delete('/compte', async (request, response) => {
    response.render('compte', {
        titre: 'Compte',
        styles: ['/css/admin.css'],
        scripts: ['/js/compte.js'],
        tournois: await deleteTournoiInscrit(request.body.id_tournois),

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

app.get('/accueil/id', async (req,res)=>{
    let ids = await getIds(); 
    res.status(200).json(ids);
});

app.delete('/admin',async(request,response)=>{
    response.render('admin', {
        titre: 'Administrateur',
        styles: ['/css/admin.css'],
        scripts: ['/js/admin.js'],  
        tournois: await getTournoi(),
        id:await supprimerTournoi(request.body.id),
    });
})

// Démarrage du serveur
app.listen(process.env.PORT);
console.log(`Serveur démarré: http://localhost:${process.env.PORT}`);