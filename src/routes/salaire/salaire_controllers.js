
const req = require("express/lib/request");
const mongoo = require("mongoose")
const Salaire = require("./salaire_model")

const AddSalaire = async (req, res, next) => {
    const salaire = await Salaire.find({user_id: req.body.user_id, date_debut: req.body.date_debut});
    if (salaire.length < 1){
        const new_salaire = new Salaire({
            _id: new mongoo.Types.ObjectId(),
            user_id : req.body.user_id,
            somme :req.body.somme,
            date_debut : req.body.date_debut,
        });
        await Salaire.updateOne({date_fin : "", user_id: req.body.user_id}, {date_fin : req.body.date_debut}) // Update date fin du dernier salaire 
        .then(() => res.status(200).json({message : "Mis à jour ancien salaire avec succès!"}))
        .catch(error => res.status(400).json({erreur : error.message}));
        new_salaire.save()
            .then(() => res.status(200).json({message : "Nouveau salaire ajouté."}))
            .catch(error => res.status(400).json({erreur : error.message}));
    } 
    if (salaire.length >0) {
        res.status(409).json({message : "Salaire déjà defini pour cette date!"});
    }
};

const UpdateSalaire = async (req, res, next) => {
    const salaire = await Salaire.findOne({_id : req.params.id});
    if (!salaire){
        res.status(409).json({message : "Salaire introuvable!"})
    } else {
        await Salaire.updateOne({_id : req.params.id}, {user_id : req.body.user_id, somme :req.body.somme, date_debut : req.body.date_debut,})
        .then(() => res.status(200).json({message : "Salaire modifié."}))
        .catch(error => res.status(400).json({erreur : error.message}))
    }
};

const DeleteSalaire = async (req, res, next) => {
    const salaire = await Salaire.findOne({_id : req.params.id});
    if (!salaire){
        res.status(409).json({message : "Salaire introuvable!"})
    } else {
        await Salaire.deleteOne({_id : req.params.id})
        .then(() => res.status(200).json({message : "Salaire supprimé."}))
        .catch(error => res.status(400).json({erreur : error.message}))
    }
};

const GetSalaire = async (req, res, next) => {
    const id = req.params.id;
    const salaire = await Salaire.findOne({_id: id});
    if (!salaire){
        res.status(409).json({message : "Salaire introuvable"});
    } else {
        return res.status(200).json(salaire);
    }
};

const ListSalaire = async (req, res, next) => {
    await Salaire.find({date_fin: ""}).exec()
        .then((result) => {
            return res.status(200).json(result);
        })
        .catch((error) => {
            res.status(400).json({erreur : error.message})
        })
};

module.exports = {AddSalaire, UpdateSalaire, DeleteSalaire, GetSalaire, ListSalaire}
