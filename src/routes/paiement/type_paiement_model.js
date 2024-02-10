const mongoose = require('mongoose')

const TypePaiement = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {type: String, required:true},
    info: String,
})

module.exports = mongoose.model('TypePaiement', TypePaiement)