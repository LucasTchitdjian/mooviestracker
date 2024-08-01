import React, { useEffect } from 'react';
import './Moovies.css';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { FaPlus, FaCheck, FaStar } from "react-icons/fa";
import { addToWatchlistMovies } from './MooviesList'; // Assuming you have addToWatchlist in MooviesList
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalContext } from '../context/GlobalContext';

const Moovies = ({ movies, setMovies, currentPage, setPage }) => {

    const { moviesAddedToWatchlist, setMoviesAddedToWatchlist } = useContext(GlobalContext);

    useEffect(() => {
        const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${tmdbApiKey}&language=fr-FR&page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                setPage(data.total_pages);
                setMovies(data.results);
            });
    }, [setMovies, currentPage, setPage]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Date inconnue";
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('fr-FR', options).format(date);
    };

    const handleAddToWatchlist = (moovie) => {
        addToWatchlistMovies(moovie, setMoviesAddedToWatchlist);
    }

    return (
        <div className='moovies'>
            <ToastContainer />
            <h2>Liste des films les mieux notés de tous les temps</h2>
            <ul>
                {movies.map((moovie, index) => (
                    <Link to={`/top-rated/movie/${moovie.id}`} key={moovie.id} index={index}>
                        <div className="moovies-container">
                            <div className="left">
                                <div className="card">
                                    <span onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToWatchlist(moovie);
                                    }}
                                        className='add-watchlist'
                                        style={moviesAddedToWatchlist.includes(moovie.id.toString()) ? { backgroundColor: '#22BB33' } : {}}>
                                        {moviesAddedToWatchlist.includes(moovie.id.toString()) ? <FaCheck /> : <FaPlus />}
                                    </span>
                                    <p className='rating'><FaStar /> {moovie.vote_average.toFixed(1).replace('.', ',')}</p>
                                    <img src={`https://image.tmdb.org/t/p/w500${moovie.poster_path}`} alt={moovie.title} />
                                </div>
                            </div>
                            <div className="right">
                                <div className="first-col">
                                    <li class name='title'>{moovie.title || moovie.name}</li>
                                    <span className='release-date'>Sortie <strong>{formatDate(moovie.release_date)}</strong></span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
                }
            </ul>
        </div>
    );
};

export default Moovies;