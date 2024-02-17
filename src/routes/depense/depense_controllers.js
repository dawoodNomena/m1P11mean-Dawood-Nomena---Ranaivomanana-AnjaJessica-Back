const mongoo = require("mongoose")
const Depense = require("./depense_model")

const AddDepense = async (req,res,next) => {
    const new_depense = new Depense({
        _id : new mongoo.Types.ObjectId(),
        type: req.body.type,
        nom: req.body.nom,
        montant: req.body.montant,
        date : req.body.date
    });
    new_depense
    .save()
        .then(() =>  res.status(201).json({message: "Dépense créée!"}))
        .catch( error => res.status(400).json({erreur : error.message}))
};

const UpdateDepense = async (req, res, next) => {
    const depense = await Depense.find({_id : req.params.id});
    if (!depense){
        res.status(404).json({message: "Dépense introuvable!"});
    } else {
        await Depense.updateOne({_id : req.params.id}, {type: req.body.type,nom: req.body.nom,montant: req.body.montant,date : req.body.date})
            .then(() => res.status(200).json({message : "Dépense modifiée"}))
            .catch((error) => res.status(400).json({erreur : error.message}))
    }
};

const DeleteDepense = async (req, res, next) => {
    const depense = await Depense.find({_id : req.params.id});
    if (!depense){
        res.status(404).json({message: "Dépense introuvable!"});
    } else {
        await Depense.deleteOne({_id: req.params.id})
            .then(() => res.status(200).json({message : "Dépense supprimée"}))
            .catch((error) => res.status(400).json({erreur : error.message}))
    }
};

const GetDepense = async (req, res, next) => {
    const id = req.params.id;
    const depense = await Depense.find({_id : id});
    if (!depense){
        return res.status(404).json({message: "Dépense inexistante!"});
    } else {
        return res.status(200).json(depense);
    }
};

const ListDepense = async (req,res,next) => {
    await Depense.find().exec()
        .then((result) => {
            return res.status(200).json(result)
        })
        .catch((error) => {
            res.status(400).json({erreur: error.message})
        });
};


module.exports = {AddDepense, UpdateDepense, DeleteDepense, GetDepense, ListDepense}