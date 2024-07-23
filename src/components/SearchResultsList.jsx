import { Link } from 'react-router-dom';
import './SearchResultsList.css';
import { useEffect } from 'react';
import { FaPlus, FaStar } from "react-icons/fa";
import { addToWatchlistMovies } from '../components/MooviesList';
import { addToWatchlistSeries } from '../components/Series';
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
    const [seriesAddedToWatchlist, setSeriesAddedToWatchlist] = useState([]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
                const response = await fetch(
                    `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&query=${search}`
                );
                const data = await response.json();
                setSearch(data.results);

                const userId = auth.currentUser ? auth.currentUser.uid : 'guest';
                const storedMoviesWatchlist = JSON.parse(localStorage.getItem(`${userId}-watchlist`)) || [];
                const storedSeriesWatchlist = JSON.parse(localStorage.getItem(`${userId}-watchlist`)) || [];
                
                setMoviesAddedToWatchlist(storedMoviesWatchlist);
                setSeriesAddedToWatchlist(storedSeriesWatchlist);

                if (auth.currentUser) {
                    const watchlistRef = collection(db, 'users', auth.currentUser.uid, 'watchlist');
                    const snapshot = await getDocs(watchlistRef);
                    const moviesWatchlist = snapshot.docs.filter(doc => doc.data().type === 'movie').map(doc => doc.data().id.toString());
                    const seriesWatchlist = snapshot.docs.filter(doc => doc.data().type === 'tv').map(doc => doc.data().id.toString());

                    setMoviesAddedToWatchlist(moviesWatchlist);
                    setSeriesAddedToWatchlist(seriesWatchlist);

                    localStorage.setItem(`${userId}-watchlist`, JSON.stringify(moviesWatchlist));
                    localStorage.setItem(`${userId}-watchlist`, JSON.stringify(seriesWatchlist));
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

    const handleAddToWatchlist = (item) => {
        const userId = auth.currentUser ? auth.currentUser.uid : 'guest';
        if (item.type === 'movie') {
            addToWatchlistMovies(item, setMoviesAddedToWatchlist);
            const updatedMoviesWatchlist = [...moviesAddedToWatchlist, item.id.toString()];
            setMoviesAddedToWatchlist(updatedMoviesWatchlist);
            localStorage.setItem(`${userId}-movies-watchlist`, JSON.stringify(updatedMoviesWatchlist));
        } else if (item.type === 'tv') {
            addToWatchlistSeries(item, setSeriesAddedToWatchlist);
            const updatedSeriesWatchlist = [...seriesAddedToWatchlist, item.id.toString()];
            setSeriesAddedToWatchlist(updatedSeriesWatchlist);
            localStorage.setItem(`${userId}-series-watchlist`, JSON.stringify(updatedSeriesWatchlist));
        }
    };

    console.log(moviesAddedToWatchlist, "moviesAddedToWatchlist");

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
                                handleAddToWatchlist(moovie);
                            }} className='add-watchlist'
                                style={(moovie.type === 'movie' && moviesAddedToWatchlist.includes(moovie.id.toString())) || (moovie.type === 'tv' && seriesAddedToWatchlist.includes(moovie.id.toString())) ? { backgroundColor: '#22BB33' } : {}}>
                                {(moovie.type === 'movie' && moviesAddedToWatchlist.includes(moovie.id.toString())) || (moovie.type === 'tv' && seriesAddedToWatchlist.includes(moovie.id.toString())) ? <FaCheck /> : <FaPlus />}
                            </span>
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