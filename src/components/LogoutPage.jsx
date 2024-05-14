import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function LogoutPage({ setUserConnected }) {
    const navigate = useNavigate();

    useEffect(() => {
        setUserConnected(false);
        localStorage.setItem('userConnected', JSON.stringify(false));
        setTimeout(() => {
            navigate('/');
        }, 3000);
    }, [navigate, setUserConnected]);

    return (
        <div className="logout">
            <h1>Vous êtes déconnecté</h1>
            <h3>Veuillez patientez vous allez être redirigé vers la page d'accueil</h3>
        </div>
    )
}