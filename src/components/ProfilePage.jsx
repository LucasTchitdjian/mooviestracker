import { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './ProfilePage.css';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth, storage } from '../firebase-config';
import { IoIosArrowForward } from "react-icons/io";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import DefaultAvatarImg from '../DefaultAvatarImgRemoved.png'; // [1] Importez l'image par défaut
import { FaPen } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";

export function ProfilePage({ setProfileImage, profileImage }) {
    const [profileInfo, setProfileInfo] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [editModeField, setEditMode] = useState(""); // [1] Ajoutez un état pour gérer le mode d'édition
    const [firstName, setFirstName] = useState(""); // [2] Ajoutez un état pour gérer le prénom édité
    const [lastName, setLastName] = useState(""); // [3] Ajoutez un état pour gérer le nom de famille édité
    const [email, setEmail] = useState(""); // [4] Ajoutez un état pour gérer l'email édité

    const fetchProfileData = useCallback(async (uid) => {
        try {
            const userDoc = doc(db, 'users', uid);
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
                setProfileInfo(docSnap.data());
                setProfileImage(docSnap.data().profilePicture || DefaultAvatarImg) // [2] Mettez à jour l'état de l'image de profil
                setFirstName(docSnap.data().firstName); // [3] Mettez à jour l'état du prénom édité
                setLastName(docSnap.data().lastName); // [4] Mettez à jour l'état du nom de famille
                setEmail(docSnap.data().email); // [5] Mettez à jour l'état de l'email
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            alert("Erreur lors de la récupération des données : " + error.message);
        }
    }, [setProfileImage]);

    const updateProfileData = async () => {
        if (profileInfo.firstName !== firstName || profileInfo.lastName !== lastName || profileInfo.email !== email) {
            try {
                updateDoc(doc(db, 'users', auth.currentUser.uid), {
                    firstName: firstName,
                    lastName: lastName,
                    email: email
                });
                setEditMode(""); // [6] Désactivez le mode d'édition
                toast.success("Données mises à jour avec succès", { autoClose: 1000 });
            }
            catch (error) {
                console.error("Erreur lors de la mise à jour des données :", error);
                toast.error("Erreur lors de la mise à jour des données : " + error.message);
            }
        } else {
            setEditMode(""); // [7] Désactivez le mode d'édition
        }
    }


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

    const handleFirstNameChange = (event) => {
        setFirstName(event.target.value);
    }

    const handleLastNameChange = (event) => {
        setLastName(event.target.value);
    }

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    }

    return (
        <div className="profile-page">
            <ToastContainer />
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
                                    {profileImage ? <img src={profileImage} alt="perso avatar" /> : <img src={DefaultAvatarImg} alt="default avatar" />}
                                </div>
                            </div>
                            <div className="firstName row">
                                <div className="title">
                                    <p>Prenom:</p>
                                </div>
                                <div className="value">
                                    {editModeField === 'firstName' ? <>
                                        <input type="text" value={firstName} onChange={handleFirstNameChange} />
                                        <FaCheck onClick={updateProfileData} />
                                    </> :
                                        <p>{firstName}</p>}
                                </div>
                                <div className="icon" onClick={() => handleEditMode("firstName")}>
                                    {editModeField === 'firstName' ? <FaPen /> : <IoIosArrowForward />}
                                </div>
                            </div>
                            <div className="lastName row">
                                <div className="title">
                                    <p>Nom:</p>
                                </div>
                                <div className="value">
                                    {editModeField === 'lastName' ? <>
                                        <input type="text"
                                            value={lastName}
                                            onChange={handleLastNameChange} />
                                        <FaCheck onClick={updateProfileData} />
                                    </> :
                                        <p>{lastName}</p>}
                                </div>
                                <div className="icon" onClick={() => handleEditMode("lastName")}>
                                    {editModeField === 'lastName' ? <FaPen /> : <IoIosArrowForward />}
                                </div>
                            </div>
                            <div className="email row">
                                <div className="title">
                                    <p>Email:</p>
                                </div>
                                <div className="value">
                                    {editModeField === 'email' ? <>
                                        <input type="email"
                                            value={email}
                                            onChange={handleEmailChange} />
                                        <FaCheck onClick={updateProfileData} />
                                    </> :
                                        <p>{email}</p>}
                                </div>
                                <div className="icon" onClick={() => handleEditMode("email")}>
                                    {editModeField === 'email' ? <FaPen /> : <IoIosArrowForward />}
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