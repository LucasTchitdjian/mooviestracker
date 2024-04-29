import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';

export const handleLogout = () => {
    signOut(auth)
        .then(() => {
            alert('Vous êtes déconnecté');
            window.location.reload();
        })
        .catch(error => {
            console.error('Erreur lors de la déconnexion :', error);
        });
}