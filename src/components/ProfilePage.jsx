import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';
import './ProfilePage.css';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../firebase-config';

export function ProfilePage() {
    const [profileInfo, setProfileInfo] = useState(null);
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
            <h1>Mon profil</h1>
            <div className="infos-container">
                <div className="left">
                    <input type="file" id="profileImage" accept="image/*" />
                    <img id="profileImagePreview" alt="" />
                </div>
                {isAuthenticated && profileInfo ? (
                    <div className="right">
                        <p>Nom: {profileInfo.firstName}</p>
                        <p>Prénom: {profileInfo.lastName}</p>
                        <p>Email: {profileInfo.email}</p>
                    </div>
                ) : (
                    <p>Please log in to view profile information.</p>
                )}
            </div>
        </div>
    );
}