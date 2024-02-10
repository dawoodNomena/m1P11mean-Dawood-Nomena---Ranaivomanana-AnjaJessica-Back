const mongoose = require('mongoose')

const PreferenceEmployee = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    client_id: { type : mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
    employe_id : { type : mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
})

module.exports = mongoose.model('PreferenceEmployee', PreferenceEmployee)