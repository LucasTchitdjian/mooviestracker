import { Link } from 'react-router-dom';
import './MooviesList.css';
import { useEffect } from 'react';
import { FaStar, FaPlay, FaPlus, FaCheck } from "react-icons/fa";
import { db } from '../firebase-config';
import { auth } from '../firebase-config';
import { setDoc, doc, getDocs, collection } from 'firebase/firestore';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const addToWatchlist = async (movie, setMoviesAddedToWatchlist) => {

    if (!auth.currentUser) { // Check if user is logged in
        console.log("No user logged in.");
        toast.error("Vous devez être connecté pour ajouter des films à votre watchlist", {
            autoClose: 3000,
        });
        return; // Stop execution if not logged in
    }

    try {
        const movieId = movie.id.toString(); // utiliser l'id du film comme id du document
        const movieRef = doc(db, 'users', auth.currentUser.uid, 'watchlist', movieId);

        // Récuperer la watchlist depuis local storage
        const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        // Vérifier si le film est déjà dans la watchlist
        if (storedWatchlist.includes(movieId)) {
            toast.warning("Ce film est déjà dans votre watchlist", {
                autoClose: 3000,
            });
            return;
        }

        await setDoc(movieRef, {
            id: movie.id,
            title: movie.title || movie.name,
            poster_path: movie.poster_path,
            overview: movie.overview,
            release_date: movie.release_date || movie.first_air_date,
            timestamp: new Date()
        });
        setMoviesAddedToWatchlist(prevState => {
            const newWatchlist = [...prevState, movieId];
            toast.success("Film ajouté à votre watchlist", {
                autoClose: 3000,
            });
            localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
            return newWatchlist;
        });

    } catch (error) {
        console.error('Erreur lors de l\'ajout du film à la watchlist :', error);
        toast.error("Erreur lors de l'ajout à la watchlist", {
            autoClose: 3000,
        });
    }
};

export function MooviesList({ currentPage, movies, setMovies, setTotalPages, setPage }) {
    const [moviesAddedToWatchlist, setMoviesAddedToWatchlist] = useState([]);

    useEffect(() => {
        const fetchMoviesAndWatchlist = async () => {
            try {
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/now_playing?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=${currentPage}`
                );
                const data = await response.json();
                setTotalPages(data.total_pages);
                setMovies(data.results);

                if (auth.currentUser) {
                    const watchlistRef = collection(db, 'users', auth.currentUser.uid, 'watchlist');
                    const snapshot = await getDocs(watchlistRef);
                    const watchlistMovies = snapshot.docs.map(doc => doc.data().id.toString());
                    setMoviesAddedToWatchlist(watchlistMovies);
                } 
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        fetchMoviesAndWatchlist(); 
    }, [currentPage, setMovies, setTotalPages]);    

      console.log(moviesAddedToWatchlist, "moviesAddedToWatchlist   ")

    const ratingFormat = (rating) => {
        return rating.toFixed(1).toString().replace('.', ',');
    }

    // const formatDate = (date) => {
    //     const options = { year: 'numeric', month: 'long', day: 'numeric' };
    //     return new Date(date).toLocaleDateString('fr-FR', options);
    // }

    return (
        <div className="moovies-list">
            <ToastContainer />
            <h2>Liste des films à l'affiche</h2>
            <ul>
                {movies.map((moovie) => (
                    <Link to={`/now-playing/movie/${moovie.id}`} key={moovie.id}>
                        <div className="moovie-container">
                            <div className="left">
                                <div className="card">
                                    <span onClick={(e) => {
                                        e.preventDefault();
                                        addToWatchlist(moovie, setMoviesAddedToWatchlist);
                                    }} className='add-watchlist' style={Array.isArray(moviesAddedToWatchlist) && moviesAddedToWatchlist.includes(moovie.id.toString()) ? { backgroundColor: '#22BB33' } : {}}>{Array.isArray(moviesAddedToWatchlist) && moviesAddedToWatchlist.includes(moovie.id.toString()) ? <FaCheck /> : <FaPlus />}</span>
                                    <p className='rating'><FaStar /> {ratingFormat(moovie.vote_average)}</p>
                                    {moovie.poster_path !== null ? <img src={`https://image.tmdb.org/t/p/w500${moovie.poster_path}`} alt="" /> : <img src="https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg" alt="" />}
                                    <div className="moovie-info">
                                    </div>
                                </div>
                            </div>
                            <div className="right">
                                <div className="first-col">
                                    <li className='title'>{moovie.title || moovie.name}</li>
                                    {/* <li>{formatDate(moovie.release_date) || formatDate(moovie.first_air_date)}</li> */}
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
    )
}