
const mongoo = require("mongoose")
const Rdv = require("./rdv_model")
const Details_rdv = require('./../rdv_details/rdv_details_model')
const Service = require('./../service/service_model')
const moment = require('moment-timezone');
const EtatRdv = require('./../../static/Etat_rdv')

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


module.exports = {AddRdv, TerminerRdv, ListByClient, ListByEmploye, TotalDureeRdv}