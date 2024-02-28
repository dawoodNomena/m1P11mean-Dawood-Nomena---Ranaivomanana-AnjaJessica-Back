const Client = require('./../routes/user/user_model')
const Service = require('./../routes/service/service_model')
const RoleUser = require('./../static/Role_user')
const Rdv = require('./../routes/rdv/rdv_model')
const RdvState = require('./../static/Etat_rdv')
const nodemailer = require('nodemailer');
const moment = require('moment-timezone');
const cron = require('node-cron');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_MAIL_AUTH,
        pass: process.env.USER_MAIL_PASS
    }
});

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
        await transporter.sendMail(data, function (error, info) {
            if (error) {
                console.error(erreur);
                res.status(500).send('Erreur lors de l\'envoi de l\'e-mail');
              } else {
                console.log('E-mail envoyé : ' + info.response);
                res.send('E-mail envoyé avec succès');
              }
        });
    }
};

const  differenceEnJours = (date1, date2) => {
    const millisecondesDate1 = date1.getTime();
    const millisecondesDate2 = date2.getTime();
    
    const differenceMillisecondes = Math.abs(millisecondesDate2 - millisecondesDate1);
    
    const differenceEnJours = differenceMillisecondes / (1000 * 60 * 60 * 24);
    
    return differenceEnJours;
  }

const Mail_notif_rdv = async (rdv) => {
    const today = moment.tz(new Date(), 'GMT+3').format()
    list_rdv = Rdv.find({state: RdvState.Rdv})
    for(let i=1;list_rdv.length;i++){
        difference = differenceEnJours(today, list_rdv[i].date)
        if (difference == 1){
            client = Client.findOne({client_id: list_rdv[i].client_id});
            employe = nt.findOne({employe_id: list_rdv[i].employe_id})
            const data = {
                from: 'Salon de beauté <salon_de_beaute@mean.io>',
                to: list_client[i].mail,
                subject: 'Notification rappel rendez-vous!',
                html: `
                    <p> Bonjour ${client.prenom+' '+client.nom} ! </p>
                    </br>
                    <p>Vous avez rendez-vous avec ${employe.prenom+' '+employe.nom} </p>
                    <p>Pour tout changement, veuillez nous contacter</p>
                    </br>
                    <p>Cordialement,</p>
                    <p>L'équipe</p>
                `
            };
            await transporter.sendMail(data, function (error, info) {
                if (error) {
                    console.error(erreur);
                    res.status(500).send('Erreur lors de l\'envoi de l\'e-mail');
                  } else {
                    console.log('E-mail envoyé : ' + info.response);
                    res.send('E-mail envoyé avec succès');
                  }
            });
        }
    }
    console.log('date_aujourdhui : ' + today)
};

cron.schedule('0 06 * * *', () => { // 6h du mat
    envoyerEmail();
  }, {
    timezone: 'Africa/Nairobi' // Indiquez le fuseau horaire pour la planification
  });

module.exports = {Mail_new_offre, Mail_notif_rdv}
