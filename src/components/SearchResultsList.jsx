import { Link, useLocation } from 'react-router-dom';
import './SearchResultsList.css';
import { useEffect, useContext } from 'react';
import { FaPlus, FaStar, FaCheck } from "react-icons/fa";
import { addToWatchlistMovies } from '../components/MooviesList';
import { addToWatchlistSeries } from '../components/Series';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalContext } from '../context/GlobalContext';

export function SearchResultsList({ movies, setMovies, searchTerm, setSearchTerm }) {

    const { moviesAddedToWatchlist, setMoviesAddedToWatchlist, seriesAddedToWatchlist, setSeriesAddedToWatchlist } = useContext(GlobalContext);
    const location = useLocation();

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
                const query = new URLSearchParams(location.search).get('query');
                if (!query) return;
                setSearchTerm(query);
                const response = await fetch(
                    `https://api.themoviedb.org/3/search/multi?api_key=${tmdbApiKey}&query=${searchTerm}`
                );
                const data = await response.json();
                setMovies(data.results);
            } catch (error) {
                console.error('Erreur lors de la recherche du film ou série:', error);
            }
        };
        fetchSearchResults();
    }, [location.search, setMovies, setSearchTerm, searchTerm]);

    // Fonction pour trier les films par vote_average décroissant
    const sortMoviesByPopularity = (movies) => {
        return movies.sort((a, b) => b.vote_average - a.vote_average); // Trier par ordre décroissant
    };

    const handleAddToWatchlist = (item) => {
        if (item.type === 'movie') {
            addToWatchlistMovies(item, setMoviesAddedToWatchlist);
        } else {
            addToWatchlistSeries(item, setSeriesAddedToWatchlist);
        }
    };

    return (
        <div className="search-list">
            <ToastContainer />
            <h2>Recherche</h2>
            <ul>
                {sortMoviesByPopularity(movies).map((moovie) => (
                    <Link
                        to={{
                            pathname: `/search/${moovie.media_type}/${moovie.id}`,
                            search: `?query=${searchTerm}`,
                            state: { from: location }
                        }}
                        key={moovie.id}
                    >
                        <div className="card">
                            <span onClick={(e) => {
                                e.preventDefault();
                                handleAddToWatchlist(moovie);
                            }} className='add-watchlist'
                                style={(moovie.type === 'movie' && moviesAddedToWatchlist.includes(moovie.id.toString())) || (moovie.media_type === 'tv' && seriesAddedToWatchlist.includes(moovie.id.toString())) ? { backgroundColor: '#22BB33' } : {}}>
                                {(moovie.type === 'movie' && moviesAddedToWatchlist.includes(moovie.id.toString())) || (moovie.media_type === 'tv' && seriesAddedToWatchlist.includes(moovie.id.toString())) ? <FaCheck /> : <FaPlus />}
                            </span>
                            <p className='rating'>
                                {moovie.vote_average !== undefined ? (
                                    <>
                                        <FaStar /> {moovie.vote_average.toFixed(1).replace('.', ',')}
                                    </>
                                ) : 'N/A'} {/* Afficher N/A si vote_average est indéfini */}
                            </p>
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
