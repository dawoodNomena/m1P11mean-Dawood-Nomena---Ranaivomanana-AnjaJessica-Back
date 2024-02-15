const mongoose = require('./../../database/dbManager').mongo

const Rdv_details = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    service_id: { type : mongoose.Schema.Types.ObjectId, ref: 'Service', required:true },
    rdv_id : { type : mongoose.Schema.Types.ObjectId, ref: 'Rdv', required:true },
})

module.exports = mongoose.model('Rdv_details', Rdv_details)