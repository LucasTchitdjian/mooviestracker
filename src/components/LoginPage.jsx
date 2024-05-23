import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import './LoginPage.css';
import { auth } from '../firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function LoginPage({ setUserConnected }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // [1] Ajouter un état pour gérer les erreurs
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        toast.success("Vous êtes connecté", { autoClose: 3000 });
        setUserConnected(true);
        localStorage.setItem('userConnected', JSON.stringify(true));
        navigate('/');
      } else {
        setUserConnected(false);
        localStorage.setItem('userConnected', JSON.stringify(false));
      }
    });
    return () => unsubscribe();
  }, [navigate, setUserConnected]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Vous êtes connecté", userCredential, { autoClose: 3000 });
      setUserConnected(true);
      localStorage.setItem('userConnected', JSON.stringify(true));
      navigate('/');
    } catch (error) {
      toast.error("Erreur lors de la connexion", error, { autoClose: 3000 });
      console.error('Login error:', error);
      setError(error.message);
  };
}

  return (
    <div className="login">
      <ToastContainer />
      <h1>Connectez-vous</h1>
      <div className="form">
        <form onSubmit={handleLogin}>
          <div className="input">
            <input
              type="email"
              id="email"
              placeholder='EMAIL'
              value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="input">
            <input
              type="password"
              id="password"
              placeholder='MOT DE PASSE'
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">Se connecter</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  )
}
