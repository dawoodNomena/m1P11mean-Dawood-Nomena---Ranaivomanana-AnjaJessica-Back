const mailgun = require("mailgun-js");
const config_mail = require('./../static/Mail_config')
const Client = require('./../routes/user/user_model')
const Service = require('./../routes/service/service_model')
const RoleUser = require('./../static/Role_user')
const email = mailgun({domain : config_mail.domain, apiKey: config_mail.api_key})

const Mail_new_offre = async (offre) => {
    const list_client = await Client.find({role: RoleUser.Client, active: true}).exec();
    const service = await Service.findOne({_id : offre.service_id});
    for(let i=0;i<list_client.length;i++){

        const data = {
            from: 'Salon de beauté <salon_de_beaute@mean.io>',
            to: list_client[i].mail,
            subject: 'Notification nouvel offre spécial',
            html: `
                <p> Bonjour ${list_client[i].prenom+' '+list_client[i].nom} ! </p>
                </br>
                <p>Nous vous informons pour cet nouvel offre spécial : </p>
                <p>- Service concerné : ${service.nom} (${service.categorie})</p>
                <p>- Offre : ${offre.description}</p>
                <p>- Date: du ${offre.date_debut} au ${offre.date_fin}
                </br>
                <p>Cordialement,</p>
                <p>L'équipe</p>
            `
        };
        await email.messages().send(data, function (error, body) {
            console.log(body);
        });
    }
};

module.exports = {Mail_new_offre}
