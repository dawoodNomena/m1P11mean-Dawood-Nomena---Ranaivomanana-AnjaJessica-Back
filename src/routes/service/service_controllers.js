
const mongoo = require("mongoose")
const Service = require("./service_model")


const GetService = (req,res,next) => {
    const id = req.params.id;
    const service = Service.find({_id : id, active: true});
    if (!service){
        res.status(404).json({message: "Service inexistant!"});
    } else {
        res.status(200).json({service});
    }

};

const CreateService = async (req, res, next) => {
    const service = await Service.find({nom: req.params.nom, active : true});
    if (service.length > 0){ 
        res.status(409).json({
            message : "Service déjà existant!"
        });
    } else {
        const new_service = new Service({
            _id: mongoo.Types.ObjectId(),
            nom: req.params.nom,
            prix: req.params.prix,
            description: req.params.description,
            duree: req.params.duree,
            commission: req.params.commission,
            categorie: req.params.categorie,
        });
        new_service
            .save()
                .then(() => res.status(201).json({message: "Service créée!"}))
                .catch( error => res.status(400).json({error}));
    }
};

const UpdateService = async (req, res, next) => {
    const service = await Service.find({_id: req.params.id});
    if (!service){
        res.status(404).json({message: "Service inexistant!"});
    } else {
        await Service.updateOne({_id : req.params.id}, {nom: req.body.nom,prix: req.body.prix,description: req.body.description,duree: req.body.duree,commission: req.body.commission,categorie: req.body.categorie,})
            .then(() => res.status(200).json({message : "Service modifié."}))
            .catch(error => res.status(400).json({error}))
    }
};

const DeleteService = async (req,res,next) => {
    const service = await Service.find({_id: req.params.id, active: true});
    if (!service){
        res.status(404).json({message : "Service introuvable!"})
    } else {
        await Service.updateOne({_id: req.params.id}, {active: false})
            .then(() => res.status(200).json({message: "Service supprimé!"}))
            .catch((error) => res.status(400).json({error}));
    }
};


const ListServiceByCategorie = async (req, res, next) =>{
    const categorie = req.params.categorie;
    if (!categorie){
        await Service.find({active: true}).exec()
            .then((result) =>{
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(400).json({message: error.toString()})
            });
    } else {
        await Service.find({categorie: categorie, active: true}).exec()
            .then((result) => {
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(400).json({
                    message: error.toString();
                })
            })
    }
};



module.exports = {GetService, CreateService, UpdateService, DeleteService, ListServiceByCategorie}