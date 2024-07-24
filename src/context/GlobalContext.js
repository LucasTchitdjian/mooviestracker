import { createContext, useState, useEffect } from "react";
import { auth, db } from '../firebase-config';
import { getDocs, collection } from 'firebase/firestore';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [moviesAddedToWatchlist, setMoviesAddedToWatchlist] = useState([]);
    const [seriesAddedToWatchlist, setSeriesAddedToWatchlist] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchWatchlist = async () => {
            if (auth.currentUser) {
                const watchlistRef = collection(db, 'users', auth.currentUser.uid, 'watchlist');
                const snapshot = await getDocs(watchlistRef);
                const moviesWatchlist = snapshot.docs
                    .filter(doc => doc.data().type === 'movie')
                    .map(doc => doc.data().id.toString());
                const seriesWatchlist = snapshot.docs
                    .filter(doc => doc.data().type === 'tv')
                    .map(doc => doc.data().id.toString());

                setMoviesAddedToWatchlist(moviesWatchlist);
                setSeriesAddedToWatchlist(seriesWatchlist);
            }
        };

        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
                fetchWatchlist();
            } else {
                setUser(null);
                setMoviesAddedToWatchlist([]);
                setSeriesAddedToWatchlist([]);
            }
        });
    }, []);

    return (
        <GlobalContext.Provider value={{
            user,
            moviesAddedToWatchlist,
            setMoviesAddedToWatchlist,
            seriesAddedToWatchlist,
            setSeriesAddedToWatchlist
        }}>
            {children}
        </GlobalContext.Provider>
    );
};