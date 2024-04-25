import { signInWithEmailAndPassword } from 'firebase/auth';
import './LoginPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase-config';

export function LoginPage() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigation = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log('Connexion réussie');
        alert('Connexion réussie');
        navigation('/');
      })
      .catch(error => {
        setError(error.message);
      });
  }

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