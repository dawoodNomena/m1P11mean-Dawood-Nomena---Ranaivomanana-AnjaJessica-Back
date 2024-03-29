const mongoose = require('./../../database/dbManager').mongo

const Service = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    nom : {type: String, required: true},
    prix : { type: Number, required: true},
    description : String,
    duree: {type: Number, required: true},
    commission: { type: Number, required:true},
    categorie: { type : String, required:true},
    active: { type: Boolean, default:true}
})

module.exports = mongoose.model('Service', Service)