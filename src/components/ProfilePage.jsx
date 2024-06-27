import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import './ProfilePage.css';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase-config';
import { RxAvatar } from "react-icons/rx";
import { IoIosArrowForward } from "react-icons/io";

export function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState(null);
    const [profileImage, setProfileImage] = useState(null); // [1] Ajoutez un état pour gérer l'image de profil
    const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    }, []);

    const fetchProfileData = async (uid) => {
        try {
            const userDoc = doc(db, 'users', uid);
            const docSnap = await getDoc(userDoc);
            if (docSnap.exists()) {
                setProfileInfo(docSnap.data());
                setProfileImage(docSnap.data().profilePicture); // [2] Mettez à jour l'état de l'image de profil
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
            alert("Erreur lors de la récupération des données : " + error.message);
        }
    };

    return (
        <div className="profile-page">
            <h1>Informations personnelles</h1>
            <div className="profile-container">
                <div className="infos-container">
                    {/* <div className="row">
                        <input type="file" id="profileImage" accept="image/*" />
                        {profileImage ? (
                            <img src={profileImage} alt="profile" />
                        ) : (
                            <RxAvatar size={100} color="#000" />
                        )}
                    </div> */}
                    {isAuthenticated && profileInfo ? (
                        <>
                            <div className="firstName row">
                                <div className="title value">
                                    <p>Nom: </p>
                                    <p>{profileInfo.firstName}</p>
                                </div>
                                <div className="icon">
                                    <IoIosArrowForward />
                                </div>
                            </div>
                            <div className="lastName row">
                                <div className="title value">
                                    <p>Prénom: </p>
                                    <p>{profileInfo.lastName}</p>
                                </div>
                                <div className="icon">
                                    <IoIosArrowForward />
                                </div>
                            </div>
                            <div className="email row">
                                <div className="title value">
                                    <p>Email: </p>
                                    <p>{profileInfo.email}</p>
                                </div>
                                <div className="icon">
                                    <IoIosArrowForward />
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Please log in to view profile information.</p>
                    )}
                </div>
            </div>
        </div>
    );
}