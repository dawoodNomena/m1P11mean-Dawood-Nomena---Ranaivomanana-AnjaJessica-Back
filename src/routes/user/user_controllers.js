const bcrypt = require("bcrypt");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const mongoo = require("mongoose");
const User = require("./user_model");
const role_user = require("../../static/Role_user")

const Sign_up = async (req, res, next) => {
    User.find({mail : req.body.mail, active:true})
    .exec()
    .then( async (user) => {
        if (user.length > 0) {
            res.status(409).json({
                message:"Mail déjà utilisé!"
            })
        } else {
            bcrypt.hash(req.body.mdp, 10)
            .then( mdp_hash => {
                const new_user = new User({
                    _id : new mongoo.Types.ObjectId(),
                    mail : req.body.mail,
                    nom : req.body.nom,
                    prenom : req.body.prenom,
                    tel : req.body.tel,
                    mdp : mdp_hash,
                    role: role_user.Client,
                });
                new_user
                .save()
                    .then(() => res.status(201).json({message: "Inscription terminée."}))
                    .catch( error => res.status(400).json({ error }));
            })
            .catch( error => res.status(400).json({ error }));
        }
    })
    .catch( error => res.status(400).json({ error }));
};


const Login = (req, res, next) => {
    User.find({mail : req.body.mail, active:true})
    .exec()
        .then(user => {
            if (!user) {
                res.status(401).json({message: "Email ou mot de passe incorrecte!"})
            }
            bcrypt.compare(req.body.mdp, user.mdp, (erreur, result) => {
                if (erreur){
                    console.log(erreur)
                }
                if (result){
                    const auth_token = jwt.sign(
                        {
                            userId : user._id,
                            mail : user.mail,
                            nom : user.nom,
                            role : user.role,
                        },
                        'token_token',
                        { expiresIn : '24h'},
                    )
                    return res.status(200).json({
                        message : "Authentification réussie.",
                        user_info : {userdId : user._id, mail: user.mail, nom: user.nom, role: user.role},
                        token : auth_token,

                    });
                }
                res.status(401).json({ message: 'Authentification refusé!'})
            })
        })
        .catch((err) => {
            res.status(500).json({error : err})
        })
};

const Logout = (req, res, next) => {
    //const token = req.header("auth-token");
    //const userId = req.user.userId
    res.status(200).json({
        userId : null,
        token : null,
    })
};

const AddUser =  async (req, res, next) => {
    const employe = await User.find({mail : req.body.mail, active: true});
    if (employe.lenght > 0){
        res.status(409).json({
            message : "Mail déjà utilisé!"
        });
    }
    else{
        bcrypt.hash('employe123', 10) //mdp par defaut pour employe créé
            .then( mdp_hash => {
                const new_user = new User({
                    _id : new mongoo.Types.ObjectId(),
                    mail : req.body.mail,
                    nom : req.body.nom,
                    prenom : req.body.prenom,
                    tel : req.body.tel,
                    mdp : mdp_hash,
                    role: role_user.Employe,
                });
                new_user
                .save()
                    .then(() => res.status(201).json({message: "Nouvel(le) employé(e)."}))
                    .catch( error => res.status(400).json({ error }));
            })
            .catch( error => res.status(400).json({ error }));
        }
}

const UpdateUser = async (req, res, next) => {
    const user = await User.find({_id :req.params.id, active: true})
    if (!user) {
        res.status(404).json({message : "Utilisateur introuvable!"})
    } else{
        await User.updateOne({_id : req.params.id}, {mail : req.body.mail, nom: req.body.nom, prenom: req.body.prenom, tel: req.body.tel})
        .catch( error => res.status(400).json({ error }))
        res.status(200).json({message: "Utilisateur modifié."})
    }
}

const DeleteUser = async (req, res, next) => {
    const user = await User.find({_id: req.params.id, active: true})
    if (!user) {
        res.status(404).json({message : "Utilisateur introuvable!"})
    } else {
        await User.updateOne({_id: req.params.id}, {active: false})
        .catch(error => res.status(400).json({ error }))
        res.status(200).json({message: "Utilisateur supprimé."})
    }
    
}

module.exports = { Sign_up, Login, Logout, AddUser, UpdateUser, DeleteUser}


