
const mongoo = require("mongoose")
const Permission = require("./permission_model")
const moment = require('moment-timezone');


const AddPermission = (req, res, next) => {
    const new_permission = new Permission({
        _id: new mongoo.Types.ObjectId(),
        employe_id : req.user.userId,
        date : moment.tz(req.body.date, 'GMT+3').format(),
        duree : req.body.duree
    });
    new_permission
    .save()
        .then(() =>  res.status(201).json({message: "Permission créée!"}))
        .catch( error => res.status(400).json({erreur : error.message}))
};

module.exports = {AddPermission};