const express = require('express');
const app = express();
require('dotenv').config(); // Charger les variables d'environnement
const admin = require('firebase-admin');

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

// Middleware pour traiter les requêtes JSON
app.use(express.json());

// Accès à la base de données Firestore
const db = admin.firestore();

// Route GET pour tester la connexion à Firestore
app.get('/testFirestore', async (req, res) => {
    try {
        // Ajouter un document à la collection 'users'
        const docRef = db.collection('users').doc(); // Crée un nouveau document
        await docRef.set({
            name: 'John Doe',
            email: 'john.doe@example.com',
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(200).send('Firestore is connected and user document was added!');
    } catch (error) {
        console.error('Error writing document: ', error);
        res.status(500).send('Error connecting to Firestore.');
    }
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
