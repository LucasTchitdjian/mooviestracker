import { Link } from 'react-router-dom';
import './SearchResultsList.css';
import { useEffect } from 'react';
import { FaPlus, FaStar } from "react-icons/fa";
import { addToWatchlist } from '../components/MooviesList';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';

export function SearchResultsList({ movies, setMovies, search, setSearch }) {

    const notify = () => toast.success("Film ajouté à votre watchlist", {
        autoclose: 1000,
    });
    const [moviesAddedToWatchlist, setMoviesAddedToWatchlist] = useState([]);

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=d7e7ae694a392629f56dea0d38fd160e&query=${search}`)
            .then(response => response.json())
            .then(data => setSearch(data.results))
            .catch(error => console.error('Erreur lors de la recherche du film:', error));

        const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        setMoviesAddedToWatchlist(storedWatchlist);

    }, [setSearch, setMovies, search]);

    // Fonction pour trier les films par vote_average décroissant
    const sortMoviesByPopularity = (movies) => {
        return movies.sort((a, b) => b.vote_average - a.vote_average); // Trier par ordre décroissant
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
                                addToWatchlist(moovie, setMoviesAddedToWatchlist);
                                notify();
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