const mongoo = require("mongoose")
const Preference_employe = require("./preference_employe_model")
const Preference_service = require("./preference_service_model")

//Preference service
const AddPreferenceService = async (req,res,next) => {
    const pref_serv = await Preference_service.find({client_id : req.user.userId, service_id: req.body.service_id});
    if (pref_serv.length >0){
        return res.status(409).json({message : "Ce service est déjà dans votre préférence!"})
    } else {
        const new_pref_service = new Preference_service({
            _id: new mongoo.Types.ObjectId(),
            client_id: req.user.userId,
            service_id : req.body.service_id
        });
        new_pref_service.save()
            .then(() => res.status(200).json({message: "Ce service a été ajouté à votre préférence."}))
            .catch((error) => res.status(400).json({erreur : error.message}));
    }
};

const ListPreferenceServiceByClient = async (req, res, next) => {
    const client_id = req.user.userId;
    await Preference_service.find({client_id: client_id}).exec()
        .then((preference) => {
            return res.status(200).json(preference)
        })
        .catch((error) => {
            res.status(400).json({erreur: error.message})
        });
};



//Preference_employe

const AddPreferenceEmploye = async (req,res,next) => {
    const pref_emp = await Preference_employe.find({client_id : req.user.userId, employe_id: req.body.employe_id});
    if (pref_emp.length > 0){
        return res.status(409).json({message : "Cet employé est déjà dans votre préférence"})
    } else {
        const new_pref_employe = new Preference_employe({
            _id: new mongoo.Types.ObjectId(),
            client_id: req.user.userId,
            employe_id : req.body.employe_id
        });
        new_pref_employe.save()
            .then(() => res.status(200).json({message: "Cet employé a été ajouté à votre préférence."}))
            .catch((error) => res.status(400).json({erreur : error.message}));
    }
};

const ListPreferenceEmployeByClient = async (req, res, next) => {
    const client_id = req.user.userId;
    await Preference_employe.find({client_id: client_id}).exec()
        .then((preference) => {
            return res.status(200).json(preference)
        })
        .catch((error) => {
            res.status(400).json({erreur: error.message})
        });
};

module.exports = {AddPreferenceService, ListPreferenceServiceByClient ,AddPreferenceEmploye, ListPreferenceEmployeByClient};
