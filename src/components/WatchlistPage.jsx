import { useEffect, useState } from 'react';
import { db, auth } from '../firebase-config';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';

export function WatchlistPage() {

    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        if (!auth.currentUser) {
            alert('Vous devez être connecté pour accéder à votre liste de visionnage');
            return;
        }


        const watchlistRef = collection(db, `users/${auth.currentUser.uid}/watchlist/movies`);
        const q = query(watchlistRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const movies = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setWatchlist(movies);
        })
        return () => unsubscribe();
    }, []);

    return (
        <div className="watchlist">
            <h1>Ma Liste à visionner</h1>
            <ul>
                {watchlist.map(movie => (
                    <li key={movie.id}>
                        <img src={movie.poster} alt={movie.title} />
                        <p>{movie.title}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}