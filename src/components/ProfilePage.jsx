import { useEffect, useState, useCallback } from "react";
import 'react-toastify/dist/ReactToastify.css';
import './ProfilePage.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, storage } from '../firebase-config';
import { IoIosArrowForward } from "react-icons/io";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import DefaultAvatarImg from '../DefaultAvatarImgRemoved.png'; // [1] Importez l'image par défaut
import { FaPen } from "react-icons/fa";

export function ProfilePage({ setProfileImage, profileImage}) {
    const [profileInfo, setProfileInfo] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [editModeField, setEditMode] = useState(""); // [1] Ajoutez un état pour gérer le mode d'édition

    const fetchProfileData = useCallback(async (uid) => {
        try {
            const userDoc = doc(db, 'users', uid);
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
                setProfileInfo(docSnap.data());
                setProfileImage(docSnap.data().profilePicture || DefaultAvatarImg) // [2] Mettez à jour l'état de l'image de profil
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            alert("Erreur lors de la récupération des données : " + error.message);
        }
    }, [setProfileImage]);

    
    useEffect(() => {
        // Listen for authentication state changes
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setIsAuthenticated(true);
                await fetchProfileData(user.uid);
            } else {
                setIsAuthenticated(false);
                console.log('User is not authenticated');
            }
        });

        return () => unsubscribe();
    }, [fetchProfileData]);

    const handleImageUpload = async (event) => {
        const file = event.target.files[0]; // Obtenir le fichier sélectionné
        if (file) { // Vérifier si un fichier a été sélectionné
            const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`); // Créer une référence de stockage pour le fichier
            await uploadBytes(storageRef, file); // Télécharger le fichier dans Firebase Storage
            const url = await getDownloadURL(storageRef); // Obtenir l'URL de téléchargement du fichier
            setProfileImage(url); // Mettre à jour l'état de l'image de profil
            await updateDoc(doc(db, 'users', auth.currentUser.uid), { profilePicture: url }); // Mettre à jour l'URL de l'image de profil dans Firestore
        }
    }

    const handleEditMode = (fieldType) => {
        setEditMode(fieldType);
    }

    console.log(editModeField);

        return (
            <div className="profile-page">
                <h1>Informations personnelles</h1>
                <p>Infos sur vous et vos préferences</p>
                <div className="profile-container">
                    <div className="infos-container">
                        {isAuthenticated && profileInfo ? (
                            <>
                                <div className="profilePicture row">
                                    <div className="title">
                                        <p>Photo de profil:</p>
                                    </div>
                                    <div className="value">
                                        <p>Une photo de profil permet de personnaliser votre compte</p>
                                    </div>
                                    <div className="icon" onClick={() => document.getElementById('profileImageInput').click()}>
                                        {profileImage ? <img src={profileImage} alt="perso avatar" /> : <img src={DefaultAvatarImg} alt="default avatar"/>}
                                    </div>
                                </div>
                                <div className="firstName row">
                                    <div className="title">
                                        <p>Prenom:</p>
                                    </div>
                                    <div className="value">
                                        <p>{profileInfo.firstName}</p>
                                    </div>
                                    <div className="icon" onClick={() => handleEditMode("firstName")}>
                                        {editModeField === 'firstName' ? <FaPen /> : <IoIosArrowForward /> }
                                    </div>
                                </div>
                                <div className="lastName row">
                                    <div className="title">
                                        <p>Nom:</p>
                                    </div>
                                    <div className="value">
                                        <p>{profileInfo.lastName}</p>
                                    </div>
                                    <div className="icon" onClick={() => handleEditMode("lastName")}>
                                    {editModeField === 'lastName' ? <FaPen /> : <IoIosArrowForward /> }
                                    </div>
                                </div>
                                <div className="email row">
                                    <div className="title">
                                        <p>Email:</p>
                                    </div>
                                    <div className="value">
                                        <p>{profileInfo.email}</p>
                                    </div>
                                    <div className="icon" onClick={() => handleEditMode("email")}>
                                    {editModeField === 'email' ? <FaPen /> : <IoIosArrowForward /> }
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>Please log in to view profile information.</p>
                        )}
                        <input
                            type="file"
                            id="profileImageInput"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={handleImageUpload} />
                    </div>
                </div>
            </div>
        );
}