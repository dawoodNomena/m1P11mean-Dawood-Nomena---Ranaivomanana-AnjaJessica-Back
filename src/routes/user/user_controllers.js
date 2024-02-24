const bcrypt = require("bcrypt");
const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const mongoo = require("mongoose");
const User = require("./user_model");
const role_user = require("../../static/Role_user")
const moment = require('moment-timezone');
const Rdv = require('./../rdv/rdv_model');
const Service = require('./../service/service_model')
const Rdv_controllers = require('./../rdv/rdv_controllers');
const Permission = require('./../permission/permission_model')
const RdvState = require('./../../static/Etat_rdv')
const {addHours, format} = require('date-fns');

const Sign_up = async (req, res, next) => {
    User.find({mail : req.body.mail, active:true})
    .exec()
    .then( async (user) => {
        if (user.length > 0) {
            res.status(409).json({
                message:"Mail déjà utilisé!"
            })
        } else {
            bcrypt.hash(req.body.mdp, 1)
            .then( async mdp_hash => {
                const new_user = new User({
                    _id : new mongoo.Types.ObjectId(),
                    mail : req.body.mail,
                    nom : req.body.nom,
                    prenom : req.body.prenom,
                    tel : req.body.tel,
                    mdp : mdp_hash,
                    role: role_user.Client,
                    active: true,
                });
                new_user
                .save()
                    .then(() => res.status(201).json({message: "Inscription terminée."}))
                    .catch( error => res.status(400).json({ erreur_save: error.message }));
            })
            .catch( error => res.status(400).json({ erreur_encrypt : error.message }));
        }
    })
    .catch( error => res.status(400).json({ erreur_find : error.message }));
};


const Login = (req, res, next) => {
    User.find({mail : req.body.mail, active:true})
    .exec()
        .then((user) => {
            console.log(user[0].mdp)
            if (user.lenght <1) {
                return res.status(401).json({message: "Email ou mot de passe incorrecte!"})
            } else {
                bcrypt.compare(req.body.mdp, user[0].mdp, (erreur, result) => {
                    console.log(result)
                    if (erreur){
                        console.log(erreur)
                    }
                    if (result){
                        const auth_token = jwt.sign(
                            {
                                userId : user[0]._id,
                                mail : user[0].mail,
                                nom : user[0].nom,
                                role : user[0].role,
                            },
                            'token_token',
                            { expiresIn : '24h'},
                        )
                        return res.status(200).json({
                            message : "Authentification réussie.",
                            user_info : {userdId : user[0]._id, mail: user[0].mail, nom: user[0].nom, role: user[0].role},
                            token : auth_token,

                        });
                    }
                    res.status(401).json({ message: 'Authentification refusé!'})
                })
            }
        })
        .catch((err) => {
            res.status(500).json({error : err.message})
        })
};

const Logout = (req, res, next) => {
    //const token = req.header("auth-token");
    //const userId = req.user.userId
    delete req.header("auth-token")
    return res.status(200).json({
        message : "Utilisateur déconnecté."
    })
};

const GetUser = async (req, res, next) => {
    const id = req.user.userId
    const user = await User.find({_id: id, active: true});
    console.log(id)
    if (user.length < 1){
        return res.status(404).json({message : "Utilisateur introuvable!"})
    }else{
        return res.status(200).json({user})
    }
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
};

const UpdateUser = async (req, res, next) => {
    const user = await User.find({_id :req.params.id, active: true})
    if (!user) {
        res.status(404).json({message : "Utilisateur introuvable!"})
    } else{
        await User.updateOne({_id : req.params.id}, {mail : req.body.mail, nom: req.body.nom, prenom: req.body.prenom, tel: req.body.tel})
        .then( () => res.status(200).json({message: "Utilisateur modifié."}))
        .catch( error => res.status(400).json({ error }))
    }
};


const DeleteUser = async (req, res, next) => {
    const user = await User.find({_id: req.params.id, active: true})
    if (!user) {
        res.status(404).json({message : "Utilisateur introuvable!"})
    } else {
        await User.updateOne({_id: req.params.id}, {active: false})
        .then(() => res.status(200).json({message: "Utilisateur supprimé."}))
        .catch(error => res.status(400).json({ error }))
    };
}


const List_employe_dispo = async (req, res, next) =>{
    const date_debut = moment.tz(req.body.date,'GMT+3').format();
    let duree = 0;
    const details = req.body.rdv_details;
    for(let i=0;i<details.length;i++){
        var service = await Service.findOne({_id: details[i]})
        duree = duree + service.duree;
    } 
    const date_fin = addHours(date_debut, duree)
    return res.status(200).json( await Employe_disponible(date_debut, date_fin));
};

const Employe_disponible = async (date_1, date_2) =>{
    date_1 = new Date(date_1);
    date_2 = new Date(date_2);

    date_filtre_1 = new Date(format(date_1, 'yyyy-MM-dd'))
    date_filtre_2 = new Date(addHours(date_filtre_1, 24))

    //Rdv
    const Rdv_by_date = await Rdv.find({etat : RdvState.Rdv, date:{ $gte: date_filtre_1,$lt : date_filtre_2} });
    const employe_en_rdv = [];
    for(let i=0; i<Rdv_by_date.length;i++){
        duree_rdv = await Rdv_controllers.TotalDureeRdv(Rdv_by_date[i]);
        date_fin_rdv = new Date(addHours(Rdv_by_date[i].date, duree_rdv));

        if(date_1 < Rdv_by_date[i].date){ // date avant date debut de rdv
            if(date_2 > Rdv_by_date[i].date && date_2 < date_fin_rdv){ //Date aprs date debut rdv et date avant date fin rdv
                employe_en_rdv.push(Rdv_by_date[i].employe_id)
            }
        }
        if (date_1 >= Rdv_by_date[i].date){ // date apres ou egal debut rdv
            if(date_2 < date_fin_rdv){ // date fin avant ou egale fin rv
                employe_en_rdv.push(Rdv_by_date[i].employe_id)
            }
        }

    }
    //Permission
    const Permission_by_date = await Permission.find({ date: {$gte: date_filtre_1, $lt: date_filtre_2}}).exec();
    const employe_en_permission = [];
    for(let i=0; i<Permission_by_date.length; i++)
    {
        date_fin_permission = new Date(addHours(Permission_by_date[i].date, Permission_by_date[i].duree))
        
        if (date_1 < Permission_by_date[i].date){ //date avant date debut permission
            if (date_2 > Permission_by_date[i].date && date_2 < date_fin_permission){ //date fin apres date debut permission et date fin avant date fin permission
                employe_en_permission.push(Permission_by_date[i].employe_id)
            }
        }
        if (date_1 >= Permission_by_date[i].date){ //date aprs date debut permission
            if(date_2 <= date_fin_permission){ //date fin avant date fin permission
                employe_en_permission.push(Permission_by_date[i].employe_id)
            }
        }
    }
    List_user_dispo = await User.find({_id : {$nin: employe_en_permission, $nin: employe_en_rdv}, role: role_user.Employe})
    return List_user_dispo;
}

const getMoisIndex = (string_mois) => {
    list_mois = [
        { 'janvier': 0 },{ 'février': 1 },{ 'mars': 2 },{ 'avril': 3 },{ 'mai': 4 },{ 'juin': 5 },{ 'juillet': 6 }, { 'août': 7 },{ 'septembre': 8 },{ 'octobre': 9 },{ 'novembre': 10 },{ 'décembre': 11 }
    ];
    for(let i=0; i<list_mois.length; i++ )
    {
        mois = list_mois[i];
        if( Object.keys(mois)[0] === string_mois){
            return mois[string_mois]
        }
    }
};

const temps_moyen_travail = async (req,res,next) =>{
    const mois = req.body.mois;
    const annee = parseInt(req.body.annee);
    const date_debut_mois = new Date(annee, parseInt(getMoisIndex(mois)), 1);
    const date_fin_mois = new Date(annee, getMoisIndex(mois)+1, 0);

    const dureeTravailFixe = 24*8*60*60*1000; //duree de travail fixe en millisecond (8h par jour et 24j par mois)
    const list_employe = await User.find({active: true, role: role_user.Employe});
    const list_permission = await Permission.find({date: {$gt: date_debut_mois, $lte: date_fin_mois}});
    const Total_travail = list_employe.map(employe => {
        const Total_permission = list_permission.filter(permission => permission.employe_id.toString() === employe._id.toString())
        .reduce((total, permission) => total + permission.duree, 0);
        const duree_travail = (dureeTravailFixe - Total_permission)/24;
        return duree_travail/60/60/1000;
    })
    return res.json(Total_travail)
}


module.exports = { Sign_up, Login, Logout, GetUser, AddUser, UpdateUser, DeleteUser, Employe_disponible, List_employe_dispo, temps_moyen_travail}


