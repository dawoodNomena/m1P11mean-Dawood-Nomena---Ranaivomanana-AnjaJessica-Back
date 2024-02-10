const mongoose = require('mongoose')

const Permission = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    employe_id : { type : mongoose.Schema.Types.ObjectId, ref: 'User', required:true },
    date : {type : Date, required: true},
    duree : { type: String, default:'Permission'}
})

module.exports = mongoose.model('Permission', Permission)