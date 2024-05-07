import { useEffect, useState } from 'react';
import { db, auth } from '../firebase-config';
import { query, onSnapshot, orderBy, collection } from 'firebase/firestore'; // 'collection' removed if not used directly
import { Link } from 'react-router-dom';
import { FaPlay } from "react-icons/fa";
import './WatchlistPage.css';

export function WatchlistPage() {
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        if (!auth.currentUser) {
            alert('Vous devez être connecté pour accéder à votre liste de visionnage');
            return;
        }

        // Using the new SDK syntax for accessing Firestore collections
        const watchlistRef = collection(db, "users", auth.currentUser.uid, "watchlist");
        const q = query(watchlistRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const movies = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setWatchlist(movies);
        });

        return () => unsubscribe();
    }, []);

    // const ratingFormat = (rating) => {
    //     return rating.toFixed(1).toString().replace('.', ',');
    // }

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    }

    return (
        <div className="watchlist">
            <h2>Ma Liste à visionner</h2>
            <ul>
                {watchlist.map(movie => (
                    <Link to={`/movie/${movie.id}`} key={movie.id}>
                        <div className="moovie-container">
                            <div className="left">
                                <div className="card">
                                    <li key={movie.id}>
                                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                                    </li>
                                </div>
                            </div>
                            <div className="right">
                                <div className="first-col">
                                    <li className='title'>{movie.title || movie.name}</li>
                                    <li>{formatDate(movie.release_date) || formatDate(movie.first_air_date)}</li>
                                </div>
                                <div className="second-col">
                                    <a className='play-btn' href="youtube.com">
                                        <FaPlay />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    );
}
