const express = require('express');
const app = express();
require('dotenv').config(); // Charger les variables d'environnement
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

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

// Initialiser Firestore
const db = admin.firestore();

// Middleware pour traiter les requêtes JSON
app.use(express.json());

// Configurer Nodemailer pour l'envoi d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Fonction pour envoyer un email
function sendEmailToAdmin(userEmail) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL, // Email de l'admin
    subject: 'Nouvel utilisateur inscrit',
    text: `Un nouvel utilisateur s'est inscrit avec l'email : ${userEmail}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Erreur lors de l\'envoi de l\'email : ', error);
    } else {
      console.log('Email envoyé : ' + info.response);
    }
  });
<<<<<<< HEAD

  //Sign-in route
// app.post('/signin', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Get user by email
//     const userRecord = await admin.auth().getUserByEmail(email);

//     // Compare the password (in a real-world case, you'd hash and compare)
//     const userPasswordHash = userRecord.passwordHash; // Assume this is stored securely
//     const isPasswordValid = bcrypt.compareSync(password, userPasswordHash); // Replace this with actual logic for password check

//     if (!isPasswordValid) {
//       return res.status(401).send({ message: 'Email ou mot de passe incorrect.' });
//     }

//     // Sign-in successful
//     res.status(200).send({ message: 'Connexion réussie', user: userRecord });
//   } catch (error) {
//     if (error.code === 'auth/user-not-found') {
//       return res.status(404).send({ message: 'Utilisateur non trouvé.' });
//     }
//     console.error('Erreur lors de la connexion : ', error);
//     res.status(500).send({ message: 'Erreur lors de la connexion' });
//   }
// });
  
  
  // Lancer le serveur
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
  });
}

// Route pour inscrire un utilisateur
app.post('/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const role = 'user';
  const status = 'pending';
  const registrationDate = new Date();

  try {
    // Vérifier si l'utilisateur existe déjà dans Firestore
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    if (!snapshot.empty) {
      return res.status(400).send({ message: 'L\'email existe déjà.' });
    }

    // Enregistrer l'utilisateur dans la collection "users"
    const newUser = {
      firstName,
      lastName,
      email,
      password, // Note : il est recommandé de hasher le mot de passe avant de le sauvegarder
      role,
      status,
      registrationDate
    };

    await usersRef.add(newUser);

    // Envoyer un email à l'admin après l'inscription
    sendEmailToAdmin(email);

    res.status(201).send({ message: 'Utilisateur inscrit avec succès', user: newUser });
  } catch (error) {
    console.error('Erreur lors de l\'inscription : ', error);
    res.status(500).send({ message: 'Erreur lors de l\'inscription' });
  }
});

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
