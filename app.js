const express = require('express');

const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//Permet de se connecter à la base de données
mongoose.connect('mongodb+srv://julien:mdp32@cluster0.j6xyn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  
const app = express();


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //Permet d'accéder a l'API depuis n'importe quelle origine
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Donne l'autorisation d'utiliser certains headers sur l'objet requête
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Permet d'envoyer des requêtes avec ces méthodes
    next(); // Passe l'exécution au middleware suivant
  });

  
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images'))); //Pour chaque requête envoyé à images on sert ce dossier statique images
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;