
const mongoo = require("mongoose")
const Rdv = require("./rdv_model")
const Details_rdv = require('./../rdv_details/rdv_details_model')
const Service = require('./../service/service_model')
const Depense = require('./../depense/depense_model')
const User = require('./../user/user_model')
const Salaire = require('./../salaire/salaire_model')
const moment = require('moment-timezone');
const EtatRdv = require('./../../static/Etat_rdv')
const TypeDepense = require('./../../static/Type_depense')
const UserRole = require('./../../static/Role_user')
const {addHours, format} = require('date-fns');

const AddRdv = async (req, res, next) => {
    const date = moment.tz(req.body.date, 'GMT+3').format();
    const rdv = await Rdv.find({employe_id: req.body.employe_id, date: date}).exec();
    if (rdv.length > 0){
        res.status(400).json({message : "Employé déjà occupé à cette heure"})
    } else {
        const new_rdv = new Rdv({
            _id: new mongoo.Types.ObjectId(),
            client_id: req.body.client_id,
            employe_id : req.body.employe_id,
            date : date
        });
        new_rdv.save();
        console.log(new_rdv)
        details = req.body.rdv_details;
        if (details.length > 0){
            for(let i=0;i<details.length;i++){
                new_details = new Details_rdv({
                    _id: new mongoo.Types.ObjectId(),
                    service_id: details[i],
                    rdv_id : new_rdv._id.toString(),
                });
                console.log(new_details)
                new_details.save();
            }
        }
        res.status(200).json({message: "Rendez-vous enregistré."})
    }
};

const TerminerRdv = async (req, res, next) => {
    const rdv_id = req.params.id;
    const rdv = await Rdv.findOne({_id: rdv_id});
    if (!rdv){
        return res.status(409).json({message: "Rdv inexistant!"});
    } else {
        await Rdv.updateOne({_id: rdv_id}, {etat: EtatRdv.Termine})
        .then(() => res.status(200).json({message: "Rdv terminé."}))
        .catch(error => res.status(400).json({erreur: error.message}))
    }

};

const ListByClient = async (req, res, next) => {
    const user_id = req.user.userId;
    await Rdv.find({client_id: user_id}).sort({date: 1}).exec()
        .then(async (result) => {
            const return_array = []
            for(let i=0;i<result.length;i++){
                const rdv_details = await Details_rdv.find({rdv_id: result[i]._id}).exec();
                var retour = {
                    rdv : result[i],
                    rdv_details : rdv_details
                }
                return_array.push(retour);
            }
            res.status(200).json(return_array)
        })
        .catch((error) => {
            res.status(400).json({erreur: error.message});
        })
};

const GetOne = async (req, res, next) => {
    const id = req.params.id;
    const rdv = await Rdv.findOne({_id: id});
    const details = await Details_rdv.find({rdv_id: rdv._id}).populate('service_id');
    const list_details = details.map(item =>{
        return {"nom_service": item.service_id.nom, "duree": item.service_id.duree, "prix": item.service_id.prix}
    });
    res.status(200).json({"rdv": rdv, "rdv_details": list_details});
};

const TotalDureeRdv = async (rdv) => {
    const details = await Details_rdv.find({rdv_id: rdv._id}).exec()
    let somme = 0;
    for(let i=0;i<details.length;i++){
        var service = await Service.findOne({_id: details[i].service_id.toString()})
        somme = somme + service.duree;
    } 
    return somme
};

const ListByEmploye = async (req, res, next) => {
    const user_id = req.user.userId;
    await Rdv.find({employe_id: user_id}).sort({date: 1}).exec()
        .then(async (result) => {
            //res.status(200).json(result);
            const return_array = []
            for(let i=0;i<result.length;i++){
                var duree = await TotalDureeRdv(result[i])
                console.log(duree)
                var retour = {
                    rdv : result[i],
                    "total_duree": duree
                }
                return_array.push(retour);
            }
            res.status(200).json(return_array)
        })
        .catch((error) => {
            res.status(400).json({erreur: error.message});
        });
};

const ListTaskByEmploye = async (req, res, next) => {
    var date_1 = new Date(); 
    var date_2 = new Date();
    if(!req.body.date_1 && !req.body.date_2){
        date_1 = new Date(2020, 0,1);
        date_2 = new Date(2030, 11, 31);
    }
    else if (req.body.date_1 && !req.body.date_2){
        date_1 = new Date(format(new Date(req.body.date_1), 'yyyy-MM-dd'))
        date_2 = new Date(addHours(date_1, 24));
    }
    else if (req.body.date_1 && req.body.date_2){
        date_1 = new Date(format(new Date(req.body.date_1), 'yyyy-MM-dd'));
        date_2 = new Date(format(new Date(req.body.date_2), 'yyyy-MM-dd'));
    }

    const user_id = req.user.userId;

    const list = await Details_rdv.find()
    .populate('service_id')
    .populate({
        path: 'rdv_id',
        match: {employe_id: user_id, etat: EtatRdv.Termine, date: {$gte: date_1, $lt: date_2} }
    }).exec();
    list_filtered = list.filter(item => item.rdv_id !== null);
    let sommeCommission = 0;
    const suivi = list_filtered.map(details_rdv => {
        if(details_rdv.rdv_id !== null){
            const commission = details_rdv.service_id.prix * details_rdv.service_id.commission / 100;
            sommeCommission = sommeCommission+ commission;
            return {'client_id': details_rdv.rdv_id.client_id, 'date': details_rdv.rdv_id.date, 'service_id': details_rdv.service_id.nom, 'commission': commission}
        }
    });
    return res.status(200).json({suivi, sommeCommission})
};

const Nombre_reservation = async (req, res, next) =>{
    var date_1 = new Date(); 
    var date_2 = new Date();
    if(!req.body.date_1 && !req.body.date_2){
        date_1 = new Date(2020, 0,1);
        date_2 = new Date(2030, 11, 31);
    }
    else if (req.body.date_1 && !req.body.date_2){
        date_1 = new Date(format(new Date(req.body.date_1), 'yyyy-MM-dd'))
        date_2 = new Date(addHours(date_1, 24));
    }
    else if (req.body.date_1 && req.body.date_2){
        date_1 = new Date(format(new Date(req.body.date_1), 'yyyy-MM-dd'));
        date_2 = new Date(format(new Date(req.body.date_2), 'yyyy-MM-dd'));
    }

    const list = await Details_rdv
    .aggregate([
        {
            $group: {
                _id : {service_id :"$service_id"},
                nombre: {$sum : 1},
                rdv_id : { $first: "$rdv_id"}
            }
        },
        {
            $lookup: {
                from: "rendez_vous",
                localField: "rdv_id",
                foreignField: "_id",
                as: "rdv"
            }
        },
        {
            $match: { "rdv.date" : {$gte: date_1, $lt: date_2}}
        },
        {
            $lookup: {
              from: "services",
              localField: "_id.service_id",
              foreignField: "_id",
              as: "service"
            }
        },
        {
            $unwind: "$service" 
        }
    ]).exec();

    var nombre_reservation = [];
    for(let i=0;i<list.length; i++){
        nombre_reservation.push({
            "service": `${list[i].service.nom} (${list[i].service.categorie})`,
            "nombre": list[i].nombre,
        })
    }
    return res.status(200).json(nombre_reservation);

};

const getMoisIndex = (string_mois) => {
    list_mois = [
        { 'janvier': 0 },{ 'fevrier': 1 },{ 'mars': 2 },{ 'avril': 3 },{ 'mai': 4 },{ 'juin': 5 },{ 'juillet': 6 }, { 'aout': 7 },{ 'septembre': 8 },{ 'octobre': 9 },{ 'novembre': 10 },{ 'decembre': 11 }
    ];
    for(let i=0; i<list_mois.length; i++ )
    {
        mois = list_mois[i];
        if( Object.keys(mois)[0] === string_mois){
            return mois[string_mois]
        }
    }
};

const Chiffre_affaire = async (req,res, next) => {
    const mois = req.body.mois;
    const annee = parseInt(req.body.annee);
    const date_debut_mois = new Date(annee, parseInt(getMoisIndex(mois)), 1);
    const date_fin_mois = new Date(annee, getMoisIndex(mois)+1, 0);

    const list_rdv_details = await Details_rdv.find();
    const list_rdv = await Rdv.find({date: {$gte: date_debut_mois, $lt: date_fin_mois}, etat: EtatRdv.Termine});
    const list_service = await Service.find();

    const chiffreAffairesParDate = {};
    list_rdv_details.forEach(details => {
        const rdv = list_rdv.find(r => r._id.toString() === details.rdv_id.toString());
        if (rdv) {
            const date = rdv.date.toISOString().substring(0, 10); 

            const ca = list_service.filter(service => details.service_id.toString() === service._id.toString())
                //.reduce((total, service) => total + (service.prix - (service.commission/100)), 0); // CA miala commission
                .reduce((total, service) => total + service.prix, 0); //CA complet
            
            if (!chiffreAffairesParDate[date]) {
                chiffreAffairesParDate[date] = 0;
            }
            chiffreAffairesParDate[date] += ca;
        }
    });
    res.status(200).json(chiffreAffairesParDate)
};

const Benefice_mensuel = async (req, res, next) =>{
    const mois = req.body.mois;
    const annee = parseInt(req.body.annee);
    const date_debut_mois = new Date(annee, parseInt(getMoisIndex(mois)), 1);
    const date_fin_mois = new Date(annee, getMoisIndex(mois)+1, 0);

    //Total chiffre affaire
    const list_rdv_details = await Details_rdv.find();
    const list_rdv = await Rdv.find({date: {$gte: date_debut_mois, $lt: date_fin_mois}, etat: EtatRdv.Termine});
    const list_service = await Service.find();
    const chiffreAffairesTotal = list_rdv_details.reduce((total, details) => {
        const rdv = list_rdv.find(r => r._id.toString() === details.rdv_id.toString());
        if (rdv && rdv.date >= date_debut_mois && rdv.date < date_fin_mois) {
            const ca = list_service.filter(service => details.service_id.toString() === service._id.toString())
                .reduce((caTotal, service) => caTotal + (service.prix - (service.commission / 100)), 0); // efa miala ato commission
            return total + ca;
        }
        return total;
    }, 0);

    //Total depense
    const list_depense_fixe = await Depense.find({type: TypeDepense.Fixe});
    const list_depense_du_mois = await Depense.find({type: TypeDepense.Non_Fixe, date:{$gte: date_debut_mois, $lt: date_fin_mois}});
    const list_employe_active = await User.find({active: true, role: UserRole.Employe});
    const list_salaire = await Salaire.find({date_fin: ""});
    const depense_fixe = list_depense_fixe.reduce((total, depense) => total + depense.montant, 0);
    const depense_non_fixe = list_depense_du_mois.reduce((total, depense) => total + depense.montant, 0)
    var total_salaire = list_employe_active.map(employe => {
        const salaire = list_salaire.filter(salaire => salaire.user_id.toString() === employe._id.toString())
        .reduce((total, salaire) => total + salaire.somme, 0);
        return salaire
    });
    total_salaire = total_salaire.reduce((total, item) => total + item, 0)
    const totalDepense = depense_fixe + depense_non_fixe+ total_salaire;

    const benefice = chiffreAffairesTotal - totalDepense;


    res.status(200).json({"benefice": benefice, "total_ca": chiffreAffairesTotal, "charge_fixe": depense_fixe, "depense":depense_non_fixe, "total_salaire": total_salaire, "total_depense": totalDepense })
};


module.exports = {AddRdv, TerminerRdv, ListByClient, ListByEmploye, TotalDureeRdv, ListTaskByEmploye, Nombre_reservation, Chiffre_affaire, Benefice_mensuel, GetOne}