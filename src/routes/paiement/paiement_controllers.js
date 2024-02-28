const mongoo = require("mongoose")
const Paiement = require('./paiement_model')
const TypePaiement = require('./type_paiement_model')
const moment = require('moment-timezone');

const Payer = async (req, res, next) => {
    const rdv_id = req.params.id;
    const type_paiement_id = req.body.type;
    const paiement = await Paiement.findOne({rdv_id: rdv_id});
    if(paiement){
        res.json(400).json({message: "Accompte de ce rendez-vous déjà payé!"})
    } else{
        const new_paiement = new Paiement({
            _id: new mongoo.Types.ObjectId(),
            rdv_id: rdv_id,
            type_paiement: req.body.type,
            date: moment.tz(new Date(), 'GMT+3').format(),
            montant: req.body.accompte
        });
        new_paiement.save()
        .then(() => res.status(200).json({message: "Paiement effectué!"}))
        .catch(error => res.status(400).json({erreur: error}));
    }
};

module.exports = {Payer}