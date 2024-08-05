import { Link } from 'react-router-dom';
import './SearchResultsList.css';
import { useEffect, useContext, useState } from 'react';
import { FaPlus, FaStar, FaCheck } from "react-icons/fa";
import { addToWatchlistMovies } from '../components/MooviesList';
import { addToWatchlistSeries } from '../components/Series';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalContext } from '../context/GlobalContext';

export function SearchResultsList({ movies, setMovies }) {
    //searchTerm Passe pas ce que j'ecrit dans la barre de recherche

    const { moviesAddedToWatchlist, setMoviesAddedToWatchlist, seriesAddedToWatchlist, setSeriesAddedToWatchlist } = useContext(GlobalContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (searchTerm) {
            const fetchSearchResults = async () => {
                try {
                    const response = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&query=${searchTerm}&page=1&include_adult=false`);
                    const data = await response.json();
                    setSearchResults(data.results);
                }
                catch (error) {
                    console.error(error);
                }
            }
            fetchSearchResults();
        }
    }, [searchTerm]);


    const handleAddToWatchlist = (item) => {
        if (item.type === 'movie') {
            addToWatchlistMovies(item, setMoviesAddedToWatchlist);
        } else {
            addToWatchlistSeries(item, setSeriesAddedToWatchlist);
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <div className="search-list">
            <ToastContainer />
            <div className="search-form">
                <form className='search-form'>
                    <input value={searchTerm} onChange={handleSearchChange} type="text" placeholder="Rechercher un film ou une série" />
                </form>
            </div>
            <ul>
                {searchResults.map((result) => (
                    <Link to={`/search/${result.media_type}/${result.id}`} key={result.id}>
                        <div className="card">
                            <span onClick={(e) => {
                                e.preventDefault();
                                handleAddToWatchlist(result);
                            }} className='add-watchlist'
                                style={(result.type === 'movie' && moviesAddedToWatchlist.includes(result.id.toString())) || (result.media_type === 'tv' && seriesAddedToWatchlist.includes(result.id.toString())) ? { backgroundColor: '#22BB33' } : {}}>
                                {(result.type === 'movie' && moviesAddedToWatchlist.includes(result.id.toString())) || (result.media_type === 'tv' && seriesAddedToWatchlist.includes(result.id.toString())) ? <FaCheck /> : <FaPlus />}
                                { /* Affichez l'icône appropriée en fonction de l'état de la liste de suivi */}
                            </span>
                            <p className='rating'>
                                <FaStar /> {result.vote_average ? result.vote_average.toFixed(1).replace('.', ',') : 'N/A'}
                            </p>
                            <img src={`https://image.tmdb.org/t/p/w500${result.poster_path}`} alt={result.title || result.name} />
                            <div className="moovie-info">
                                <p>{result.title || result.name}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    )
}
