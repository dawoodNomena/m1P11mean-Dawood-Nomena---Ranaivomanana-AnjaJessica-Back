const mongoose = require('./../../database/dbManager').mongo

const User = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    mail : {type : String, required: true},
    nom : {type: String, required: true},
    prenom : {type: String},
    tel : {type: String, required:true},
    mdp : {type: String, required:true, min:6},
    role : {type: String, default: 'ROLE_EMPLOYE'},
    active : {type: Boolean, default: true}
})

module.exports = mongoose.model('User', User)