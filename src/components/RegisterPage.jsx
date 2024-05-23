// Importations nécessaires de Firebase depuis le fichier firebase-config.js
import { auth } from '../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './RegisterPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { redirect } from 'react-router-dom';

// Fonction pour créer un utilisateur
const registerUser = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      toast.success("Votre compte a été créé avec succès", userCredential, { autoClose: 3000 });
      // Vous pouvez ici rediriger l'utilisateur ou afficher un message de succès
      redirect('/login');
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
      <ToastContainer />
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
