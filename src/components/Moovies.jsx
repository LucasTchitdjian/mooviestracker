import React, { useEffect } from 'react';
import './Moovies.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaPlus, FaCheck } from "react-icons/fa";
import { addToWatchlist } from './MooviesList'; // Assuming you have addToWatchlist in MooviesList
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../firebase-config';

const Moovies = ({ movies, setMovies, currentPage, setPage }) => {

    const handleAddToWatchlist = (movie) => {
        if (auth.currentUser) { // Check if user is logged in
            addToWatchlist(movie, setMoviesAddedToWatchlist);
            notify();
        } else {
            alert('Vous devez être connecté pour ajouter des films à votre watchlist');
        }
    };

    const notify = () => toast.success("Film ajouté à votre watchlist", {
        autoClose: 3000,
    });
    const [moviesAddedToWatchlist, setMoviesAddedToWatchlist] = useState([]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return "Date inconnue";
        }
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('fr-FR', options).format(date);
    };

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                setPage(data.total_pages); // Pour faire passer la props page à Pagination et faire fonctionner la pagination dans l'accueil
                setMovies(data.results);
            });
        const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        setMoviesAddedToWatchlist(storedWatchlist);
    }, [setMovies, currentPage, setPage]);

    return (
        <div className='moovies'>
            <ToastContainer />
            <h2>Liste des films les mieux notés de tous les temps</h2>
            <ul>
                {movies.map((moovie, index) => (
                    <Link to={`/movie/${moovie.id}`} key={moovie.id} index={index}>
                        <div className="moovies-container">
                            <div className="left">
                                <div className="card">
                                    <span onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToWatchlist(moovie);
                                    }}
                                        className='add-watchlist'
                                        style={Array.isArray(moviesAddedToWatchlist) && moviesAddedToWatchlist.includes(moovie.id.toString()) ? { backgroundColor: '#22BB33' } : {}}>
                                        {Array.isArray(moviesAddedToWatchlist) && moviesAddedToWatchlist.includes(moovie.id.toString()) ? <FaCheck /> : <FaPlus />}
                                    </span>
                                    <img src={`https://image.tmdb.org/t/p/w500${moovie.poster_path}`} alt={moovie.title} />
                                </div>
                            </div>
                            <div className="right">
                                <li className='title'>{moovie.title}</li>
                                <li>Date de sortie: {formatDate(moovie.release_date)}</li>
                                <li>Spectateurs {moovie.vote_average.toFixed(1).replace('.', ',')}</li>
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