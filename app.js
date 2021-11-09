const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

require("dotenv").config()

//Permet de se connecter à la base de données
mongoose.connect(process.env.MONGO_DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
  

const app = express(); //initialise express

app.use(helmet()); //Helmet aide à protéger l'application de certaines des vulnérabilités bien connues du Web en configurant de manière appropriée des en-têtes HTTP.

app.use(mongoSanitize()); //Nettoie les données fournies par l'utilisateur pour éviter l'injection d'opérateurs MongoDB.

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*"); //Permet d'accéder a l'API depuis n'importe quelle origine
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"); //Donne l'autorisation d'utiliser certains headers sur l'objet requête
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS"); //Permet d'envoyer des requêtes avec ces méthodes
    next(); // Passe l'exécution au middleware suivant
  });

  
app.use(express.json()); //Remplace body-parser et analyse donc le corps de la requête

app.use("/images", express.static(path.join(__dirname, 'images'))); //Pour chaque requête envoyé à images on sert ce dossier statique images
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;