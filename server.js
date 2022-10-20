import 'dotenv/config';
import express, { json } from 'express';
import { engine } from 'express-handlebars';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
//import connectionPromise from './model/connection.js';
import {  } from './model/todo.js';

// Création du serveur web
let app = express();

// Création de l'engin dans Express
app.engine('handlebars', engine({
    helpers: {
        afficheArgent: (nombre) => nombre && nombre.toFixed(2) + ' $'
        /*{
            if(nombre){
                return nombre.toFixed(2) + ' $';
            }
            else {
                return null;
            }
        }*/
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
    response.render('todo', {
        titre: 'Todo',
        styles: ['/css/todo.css'],
        scripts: ['/js/todo.js']/*,
        todos: await getTodos(),
        argent: 213
        */
    });
})

app.get('/apropos', (request, response) => {
    response.render('apropos', {
        titre: 'À propos'
    });
})

app.post('/api/todo', async (request, response) =>{
   /* let id = await addTodo(request.body.texte);*/
    response.status(201).json({id: id});
});

app.patch('/api/todo', async (request, response) => {
   /* await checkTodo(request.body.id);*/
    response.status(200).end();
});

// Démarrage du serveur
app.listen(process.env.PORT);
console.log('Serveur démarré: http://localhost:' + process.env.PORT);
