import { Link } from 'react-router-dom';
import './SearchResultsList.css';
import { useEffect } from 'react';
import { FaPlus, FaStar } from "react-icons/fa";
import { addToWatchlistMovies } from '../components/MooviesList';
// import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { auth, db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function SearchResultsList({ movies, setMovies, search, setSearch }) {

    const [moviesAddedToWatchlist, setMoviesAddedToWatchlist] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
                const response = await fetch(
                    `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${search}`
                );
                const data = await response.json();
                setSearch(data.results);

                if (auth.currentUser) {
                    const watchlistRef = collection(db, 'users', auth.currentUser.uid, 'watchlist');
                    const snapshot = await getDocs(watchlistRef);
                    const watchlistMovies = snapshot.docs.map(doc => doc.data().id.toString());
                    setMoviesAddedToWatchlist(watchlistMovies);
                }
            } catch (error) {
                console.error('Erreur lors de la recherche du film ou série:', error);
            }
        };
        fetchSearchResults();
    }, [setSearch, setMovies, search]);

    // Fonction pour trier les films par vote_average décroissant
    const sortMoviesByPopularity = (movies) => {
        return movies.sort((a, b) => b.vote_average - a.vote_average); // Trier par ordre décroissant
    };

    const getSearchResultsType = (movies) => {
        if (movies.length > 0) {
            movies.map((movie) => {
                return movie.type;
            });
        }
    };

    return (
        <div className="search-list">
            <ToastContainer />
            <h2>Recherche</h2>
            <ul>
                {sortMoviesByPopularity(movies).map((moovie) => (
                    <Link to={`/${moovie.type === 'movie' ? 'now-playing' : 'top-rated-series'}/movie/${moovie.id}`} key={moovie.id}>
                        <div className="card">
                            <span onClick={(e) => {
                                e.preventDefault();
                                addToWatchlistMovies(moovie, setMoviesAddedToWatchlist);
                                getSearchResultsType(moovie);
                            }} className='add-watchlist'
                                style={Array.isArray(moviesAddedToWatchlist) && moviesAddedToWatchlist.includes(moovie.id.toString()) ? { backgroundColor: '#22BB33' } : {}}>
                                {Array.isArray(moviesAddedToWatchlist) && moviesAddedToWatchlist.includes(moovie.id.toString()) ? <FaCheck /> : <FaPlus />}</span>
                            <p className='rating'><FaStar /> {moovie.vote_average.toFixed(1).replace('.', ',')}</p>
                            <img src={`https://image.tmdb.org/t/p/w500${moovie.poster_path}`} alt="" />
                            <div className="moovie-info">
                            </div>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    )
}