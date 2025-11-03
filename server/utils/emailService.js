const SibApiV3Sdk = require('sib-api-v3-sdk');
require('dotenv').config();

// Configuration Brevo avec la clé API
const client = SibApiV3Sdk.ApiClient.instance;
client.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

// Initialisation des API Brevo
const contactsApi = new SibApiV3Sdk.ContactsApi();
const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

// ✉️ Modèles d’e-mails HTML (en français)
const emailTemplates = {
  welcome: (email) => ({
    subject: 'Bienvenue dans notre newsletter !',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="background: linear-gradient(to right, #FFB86C, #FF6B6B); padding: 15px; border-radius: 5px 5px 0 0; text-align: center;">
          <h1 style="color: #000; margin: 0;">Bienvenue dans notre newsletter !</h1>
        </div>
        <div style="padding: 20px;">
          <p>Bonjour,</p>
          <p>Merci de vous être inscrit à notre newsletter 🎉</p>
          <p>Nous sommes ravis de pouvoir vous partager nos dernières actualités, projets et conseils.</p>
          <p>Vous serez désormais informé en avant-première de nos nouveautés et annonces importantes.</p>
          <p>À très bientôt,</p>
          <p>L’équipe du Portfolio</p>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 0 0 5px 5px; text-align: center; font-size: 12px; color: #666;">
          <p>Si vous souhaitez vous désabonner, cliquez <a href="#">ici</a>.</p>
        </div>
      </div>
    `
  }),

  newProject: (email, project) => ({
    subject: 'Nouveau projet ajouté : ' + project.title,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <div style="background: linear-gradient(to right, #FFB86C, #FF6B6B); padding: 15px; border-radius: 5px 5px 0 0; text-align: center;">
          <h1 style="color: #000; margin: 0;">Nouveau projet disponible !</h1>
        </div>
        <div style="padding: 20px;">
          <p>Bonjour,</p>
          <p>Nous sommes heureux de vous annoncer la publication d’un nouveau projet sur notre portfolio :</p>
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <h2 style="color: #333; margin-top: 0;">${project.title}</h2>
            <p>${project.description}</p>
            ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" style="max-width: 100%; border-radius: 5px;">` : ''}
          </div>
          <p>Découvrez tous les détails sur notre site !</p>
          <p>À bientôt,<br>L’équipe du Portfolio</p>
        </div>
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 0 0 5px 5px; text-align: center; font-size: 12px; color: #666;">
          <p>Si vous ne souhaitez plus recevoir ces notifications, cliquez <a href="#">ici</a>.</p>
        </div>
      </div>
    `
  })
};

// 📨 Envoi de l’e-mail de bienvenue via Brevo
const sendWelcomeEmail = async (email) => {
  try {
    try {
      await contactsApi.createContact({
        email,
        listIds: [2] // Remplace 2 par ton ID de liste Brevo
      });
    } catch (err) {
      if (err.response?.body?.code === 'duplicate_parameter') {
        console.log(`ℹ️ ${email} est déjà inscrit dans Brevo`);
      } else {
        throw err;
      }
    }

    const template = emailTemplates.welcome(email);
    const response = await emailApi.sendTransacEmail({
      sender: { email: 'barakarim0128@gmail.com', name: 'Équipe Portfolio' },
      to: [{ email }],
      subject: template.subject,
      htmlContent: template.html
    });

    console.log('✅ E-mail de bienvenue envoyé via Brevo :', response.messageId);
    return { success: true, messageId: response.messageId };
  } catch (error) {
    console.error('❌ Erreur lors de l’envoi de l’e-mail de bienvenue via Brevo :', error.response?.body || error);
    return { success: false, error: error.message };
  }
};

// 📨 Envoi d’un e-mail de “nouveau projet” à tous les abonnés
const sendNewProjectEmail = async (subscribers, project) => {
  try {
    const results = [];

    for (const subscriber of subscribers) {
      const template = emailTemplates.newProject(subscriber.email, project);
      const response = await emailApi.sendTransacEmail({
        sender: { email: 'barakarim0128@gmail.com', name: 'Équipe Portfolio' },
        to: [{ email: subscriber.email }],
        subject: template.subject,
        htmlContent: template.html
      });

      results.push({ email: subscriber.email, messageId: response.messageId });
    }

    console.log(`✅ E-mails “nouveau projet” envoyés à ${results.length} abonnés`);
    return { success: true, results };
  } catch (error) {
    console.error('❌ Erreur lors de l’envoi des e-mails “nouveau projet” via Brevo :', error.response?.body || error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendNewProjectEmail
};
