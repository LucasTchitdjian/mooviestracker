// Importations nécessaires de Firebase depuis le fichier firebase-config.js
import { auth } from '../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Fonction pour créer un utilisateur
const registerUser = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Utilisateur créé
      const user = userCredential.user;
      console.log("Utilisateur créé :", user);
      // Vous pouvez ici rediriger l'utilisateur ou afficher un message de succès
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.error("Erreur lors de la création de l'utilisateur :", errorMessage);
      // Affichez un message d'erreur à l'utilisateur
    });
};

export function RegisterPage() {
  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    registerUser(email, password);
  };

  return (
    <div className="register">
      <h1>Inscrivez-vous</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input">
          <input type="email" id="email" placeholder='EMAIL' required />
        </div>
        <div className="input">
          <input type="password" id="password" placeholder='MOT DE PASSE' required />
        </div>
        <button type="submit">Créer mon compte</button>
      </form>
    </div>
  );
}
