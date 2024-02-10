const mongoose = require('mongoose')

const OffreSpeciale = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    service_id: {type: mongoose.Schema.Types.ObjectId, ref:'Service', required: true},
    date_debut : {type: Date, required: true},
    date_fin : {type: Date, required: true},
    description : {type: String, required: true}
})

module.exports = mongoose.model('OffreSpeciale', OffreSpeciale)