const Sauce = require('../models/sauce');
const fs = require('fs'); //Permet d'avoir accès aux différentes opérations liées au système de fichiers
const { error } = require('console');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce); //Récupère l'objet json de la sauce
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //Génère l'URL de l'image en créant une chaîne dynamique de l'URL
    });
    sauce.save()
    .then(() => res.status(201).json({message:'Sauce enregistrée'}))
    .catch(error => res.status(400).json({error}));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? // si on trouve un fichier dans la requête alors
    {
        ...JSON.parse(req.body.Sauce), //on récupère l'objet json
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //et on modifie l'image URL
    } : { ...req.body} //sinon on prend le corps de la requête
    Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id }) //Modifie l'ancienne sauce avec la nouvelle
        .then(() => res.status(200).json({message:'Sauce modifiée'}))
        .catch(error => res.status(400).json({error}));
}

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //Recherche la sauce avec cet Id
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1]; //Récupère le nom du fichier précisément
        fs.unlink(`images/${filename}`, () => { //Supprime l'image du dossier images
            Sauce.deleteOne({ _id: req.params.id }) //Supprime cette sauce identifiée avec cet Id
                .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
                .catch(error => res.status(400).json({error}));
        });
    })
    .catch(error => res.status(500).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) //Recherche la sauce avec cet Id
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({error}));
}

exports.getAllSauce =(req, res, next) => {
    Sauce.find() //Recherche toutes les sauces
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
}