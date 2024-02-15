const mongoose = require('./../../database/dbManager').mongo

const PreferenceService = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    client_id: { type : mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
    service_id : { type : mongoose.Schema.Types.ObjectId, ref: 'Service', required:true },
})

module.exports = mongoose.model('PreferenceService', PreferenceService)