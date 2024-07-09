// Importations nécessaires de Firebase depuis le fichier firebase-config.js
import { auth } from '../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './RegisterPage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getFirestore, setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Fonction pour créer un utilisateur
const registerUser = async (email, password, firstName, lastName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Insérer les données dans Firestore
    const db = getFirestore();
    if (firstName && lastName && email) {
      await setDoc(doc(db, "users", user.uid), {
        firstName: firstName,
        lastName: lastName,
        email: email,
        profilePicture: null
      });
    }

    toast.success("Votre compte a été créé avec succès", userCredential, { autoclose: 1000 });
  } catch (error) {
    const errorMessage = error.message;
    console.error("Erreur lors de la création de l'utilisateur :", errorMessage);
    // Affichez un message d'erreur à l'utilisateur
  }
};

export function RegisterPage() {
  const navigate = useNavigate();
  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const firstName = document.getElementById('firstname').value;
    const lastName = document.getElementById('lastname').value;
    registerUser(email, password, firstName, lastName)
      .then(() => {
        setTimeout(() => {
          navigate('/');
      }, 3000);
      });
  };

  return (
    <div className="register">
      <ToastContainer />
      <h1>Inscrivez-vous</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input">
          <input type="text" id="firstname" placeholder='PRENOM' required />
        </div>
        <div className="input">
          <input type="text" id="lastname" placeholder='NOM' required />
        </div>
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
