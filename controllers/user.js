const bcrypt = require('bcrypt'); //Permet de crypter le mot de passe
const jwt = require('jsonwebtoken'); //Permet de créer et vérifier les tokens d'authentification


const User = require('../models/user');


exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //Permet de hash le password avec un salage de 10 tours
        .then(hash =>{
            const user = new User({ //Créé un nouvel utilisateur
                email: req.body.email,
                password: hash
            });
            user.save() //Sauvegarde dans la base de données
                .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}) //Recherche l'email utilisateur dans la base de données
        .then(user => {
            if(!user){ //S'il n'existe pas alors
                return res.status(401).json({error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password) //Compare le password utilisateur avec celui enregistré dans la base de données
                .then(valid => { 
                    if(!valid){ //Si différent alors
                        return res.status(401).json({error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({ //Sinon on renvoie cet objet
                        userId: user._id,
                        token: jwt.sign(
                            {userId: user._id}, //Données encodés
                            'RANDOM_TOKEN_SECRET', //Clé secrete
                            {expiresIn: '24h'} //Durée d'expiration du token
                        )
                    }); 
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));
};