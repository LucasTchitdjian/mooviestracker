import { useEffect, useState } from 'react';
import { db, auth } from '../firebase-config';
import { query, onSnapshot, orderBy, collection, deleteDoc, doc } from 'firebase/firestore';
import './WatchlistPage.css';
import { RxCross2 } from "react-icons/rx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { FaStar } from "react-icons/fa";

export function WatchlistPage() {
    const notify = () => toast.error("Film supprimé de votre watchlist !", {
        autoclose: 1000,
    });
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const userId = auth.currentUser ? auth.currentUser.uid : 'guest';
        const storedWatchlist = JSON.parse(localStorage.getItem(`${userId}-watchlist`)) || [];
        setWatchlist(storedWatchlist);
        if (!auth.currentUser) {
            toast.error("Vous devez être connecté pour voir votre watchlist", {
                autoclose: 1000,
            });
            return;
        }

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

    const deleteMovie = async (movieId) => {
        if (movieId !== 'string') {
            let stringMovieId = movieId.toString();
            const movieRef = doc(db, 'users', auth.currentUser.uid, 'watchlist', stringMovieId);
            try {
                await deleteDoc(movieRef);
                setWatchlist(prevWatchlist => {
                    const updatedWatchlist = prevWatchlist.filter(movie => movie.id !== movieId);
                    const userId = auth.currentUser.uid;
                    localStorage.setItem(`${userId}-watchlist`, JSON.stringify(updatedWatchlist));
                    return updatedWatchlist;
                })
            } catch (error) {
                console.error('Erreur lors de la suppression du film de la watchlist :', error);
            }
        }
    }

    const ratingFormat = (rating) => {
        if (rating !== undefined) {
            return rating.toFixed(1).toString().replace('.', ',');
        } else {
            return 'N/A';
        }
    }

    return (
        <div className="watchlist-wrapper">
            <ToastContainer />
            <h2>Ma Liste à visionner</h2>
            <div className="watchlist-container">
                <ul>
                    {watchlist.map(movie => (
                        <div className="card" key={movie.title}>
                            {movie.type === 'tv' ? (
                                <Link to={`/serie/${movie.id}`}>
                                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                                </Link>
                            ) : (
                                <Link to={`/now-playing/movie/${movie.id}`}>
                                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                                </Link>
                            )}
                            <div className="delete-movies" onClick={(e) => {
                                e.stopPropagation(); // Arrête la propagation de l'événement de clic
                                deleteMovie(movie.id, setWatchlist);
                                notify();
                            }}>
                                <RxCross2 />
                            </div>
                            <p className='rating'><FaStar /> {ratingFormat(movie.rating)}</p>
                        </div>
                    ))}
                </ul>
                {watchlist.length === 0 && (
                    <div className='empty-watchlist'>
                        <p>Votre watchlist est vide, dès maitenant ajoutez films, séries</p>
                        <Link to={`/now-playing`}>Parcourir les nouveaux films</Link>
                        <Link to={`/top-rated-series`}>Parcourir les séries les mieux notés</Link>
                    </div>
                )}
            </div>
        </div>
    );
}