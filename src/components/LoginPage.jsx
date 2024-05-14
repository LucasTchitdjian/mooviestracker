import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import './LoginPage.css';
import { auth } from '../firebase-config';

export function LoginPage({ setUserConnected }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
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
      console.log('User logged in:', userCredential.user);
      setUserConnected(true);
      localStorage.setItem('userConnected', JSON.stringify(true));
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message);
    }
  };

  return (
    <div className="login">
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
