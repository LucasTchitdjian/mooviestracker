import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function LogoutPage({ setUserConnected }) {
    const navigate = useNavigate();

    useEffect(() => {
        toast.success("Vous êtes déconnecté", { autoClose: 1000 });
        setUserConnected(false);
        localStorage.setItem('userConnected', JSON.stringify(false));
        setTimeout(() => {
            navigate('/');
        }, 3000);
    }, [navigate, setUserConnected]);

    return (
        <div className="logout">
            <ToastContainer />
            <h1>Vous êtes déconnecté</h1>
            <h3>Veuillez patientez vous allez être redirigé vers la page d'accueil</h3>
        </div>
    )
}