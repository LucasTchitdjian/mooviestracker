import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProfilePage.css';

export function ProfilePage({ setUserConnected }) {

    useEffect(() => {

        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
            profileImage.addEventListener('change', function () {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.addEventListener('load', function () {
                        const profileImagePreview = document.getElementById('profileImagePreview');
                        profileImagePreview.src = this.result;
                    });
                    reader.readAsDataURL(file);
                }
            });
        }
    }, []);


    return (
        <div className="profile-page">
            <h1>Mon profil</h1>
            <div className="infos-container">
                <div className="left">
                    <input type="file" id="profileImage" accept="image/*" />
                    <img id="profileImagePreview" alt="" />
                </div>
                <div className="right">
                    <p>Nom: </p>
                    <p>Prénom: </p>
                    <p>Email: </p>
                </div>
            </div>
        </div>
    )
}