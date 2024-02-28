const mongoose = require('./../../database/dbManager').mongo

const Rdv = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    client_id: { type : mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
    employe_id : { type : mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
    date : {type : Date, required: true},
    etat : { type: String, default:'Rdv'}
})

module.exports = mongoose.model('Rendez_vous', Rdv)