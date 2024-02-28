const mongoose = require('./../../database/dbManager').mongo

const Paiement = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    rdv_id: {type: mongoose.Schema.Types.ObjectId, ref:'Rdv', required: true},
    type_paiement : {type: mongoose.Schema.Types.ObjectId, ref:'TypePaiement', required: true},
    date : {type: Date, required: true},
    montant : {type: Number, required: true}
})

module.exports = mongoose.model('Paiement', Paiement)