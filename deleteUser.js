const admin = require('firebase-admin');
require('dotenv').config(); // Charger les variables d'environnement

// Initialiser Firebase Admin SDK avec les informations du compte de service
admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
});

// Fonction pour supprimer un utilisateur par email
async function deleteUserByEmail(email) {
  try {
    const userRecord = await admin.auth().getUserByEmail(email);
    await admin.auth().deleteUser(userRecord.uid);
    console.log(`Utilisateur avec l'email ${email} a été supprimé avec succès.`);
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur : ', error);
  }
}

// Appeler la fonction avec l'email de l'utilisateur à supprimer
const email = "nouvelutilisateur@gmail.com"; // Remplace par l'email que tu veux supprimer
deleteUserByEmail(email);
