import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const handleLogout = () => {
    signOut(auth)
        .then(() => {
            toast.success("Vous êtes déconnecté", { autoClose: 1000 });
            window.location.reload();
        })
        .catch(error => {
            console.error('Erreur lors de la déconnexion :', error);
        });

    return (
        <div className="logout">
            <ToastContainer />
            <h1>Vous êtes déconnecté</h1>
            <h3>Veuillez patientez vous allez être redirigé vers la page d'accueil</h3>
        </div>
    )
}