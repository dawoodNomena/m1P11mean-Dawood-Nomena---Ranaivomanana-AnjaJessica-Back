const res = require("express/lib/response");
const mongoo = require("mongoose")
const Offre = require("./offre_special_model")
const moment = require('moment-timezone');
const Mail_controllers = require('./../../mail/mail_controllers')


const AddOffre = async (req, res, next) => {
    const new_offre = new Offre({
        _id: new mongoo.Types.ObjectId(),
        service_id: req.body.service_id,
        date_debut : moment.tz(req.body.date_debut, 'GMT+3').format(),
        date_fin : moment.tz(req.body.date_fin, 'GMT+3').format(),
        description : req.body.description
    });
    try{
        await new_offre.save();
        Mail_controllers.Mail_new_offre(new_offre);
        res.status(200).json({message : "Offre speciale créée."})
    } catch(error){
        res.status(400).json({erreur: error.message})
    }
};

const UpdateOffre = async (req, res, next) => {
    const offre = await Offre.findOne({_id: req.params.id});
    if (!offre){
        res.status(404).json({message: "Offre introuvable!"});
    } else { 
        await Offre.updateOne({_id: req.params.id}, {service_id: req.body.service_id, date_debut : moment.tz(req.body.date_debut, 'GMT+3').format(), date_fin : moment.tz(req.body.date_fin, 'GMT+3').format(),description : req.body.description})
            .then(() => res.status(200).json({message : "Offre modifié"}))
            .catch(error => res.status(400).json({erreur : error.message}));
    }
};

const DeleteOffre = async (req, res, next) => {
    const offre = await Offre.findOne({_id: req.params.id});
    if (!offre){
        res.status(404).json({message: "Offre introuvable!"});
    } else { 
        await Offre.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message: "Offre supprimé!"}))
            .catch(error => res.status(400).json({erreur : error.message}));
    }
};

const GetOffre = async (req, res, next) => {
    const id = req.params.id;
    const offre = await Offre.findOne({_id: id}).exec();
    console.log(offre)
    if (!offre){
        return res.status(404).json({erreur: "Offre introuvable"})
    } else {
        return res.status(200).json(offre)
    }

};

const ListOffre = async (req, res, next) => {
    await Offre.find().exec()
        .then( async (result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            res.status(400).json({erreur : error.message})
        });
};



module.exports = {AddOffre, UpdateOffre, DeleteOffre, GetOffre, ListOffre};