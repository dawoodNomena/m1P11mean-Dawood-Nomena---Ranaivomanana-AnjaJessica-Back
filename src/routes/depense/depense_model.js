const mongoose = require('./../../database/dbManager').mongo

const Depense = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    type: {type :String, required:true},
    nom: {type: String, required:true},
    montant: Number,
    date : {type: Date}
})

module.exports = mongoose.model('Depense', Depense)