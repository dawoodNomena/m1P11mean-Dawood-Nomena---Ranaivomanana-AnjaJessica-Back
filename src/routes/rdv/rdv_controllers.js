
const mongoo = require("mongoose")
const Rdv = require("./rdv_model")
const Details_rdv = require('./../rdv_details/rdv_details_model')
const Service = require('./../service/service_model')
const User = require('./../user/user_model')
const moment = require('moment-timezone');
const EtatRdv = require('./../../static/Etat_rdv')
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


module.exports = {AddRdv, TerminerRdv, ListByClient, ListByEmploye, TotalDureeRdv, ListTaskByEmploye, Nombre_reservation}