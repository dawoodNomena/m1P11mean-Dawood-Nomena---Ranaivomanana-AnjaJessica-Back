const mongoose = require('./../../database/dbManager').mongo

const Salaire = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user_id : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    somme : {type: Number, required:true},
    date_debut : {type: Date, required:true},
    date_fin : Date
})

module.exports = mongoose.model('Salaire', Salaire)