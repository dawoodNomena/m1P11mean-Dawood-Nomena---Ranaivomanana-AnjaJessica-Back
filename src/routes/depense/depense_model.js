const mongoose = require('./../../database/dbManager').mongo

const Depense = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: String,
    nom: {type: String, required:true},
    montant: Number,
    date : {type: Date, required: true}
})

module.exports = mongoose.model('Depense', Depense)