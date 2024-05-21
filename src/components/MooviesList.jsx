import { Link } from 'react-router-dom';
import './MooviesList.css';
import { useEffect } from 'react';
import { FaStar, FaPlay, FaPlus, FaCheck } from "react-icons/fa";
import { db } from '../firebase-config';
import { auth } from '../firebase-config';
import { setDoc, doc } from 'firebase/firestore';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const addToWatchlist = async (movie, setMoviesAddedToWatchlist) => {

    if (!auth.currentUser) { // Check if user is logged in
        console.log("No user logged in.");
        alert('Vous devez être connecté pour ajouter des films à votre watchlist');
        return; // Stop execution if not logged in
    }

    try {
        const movieId = movie.id.toString(); // utiliser l'id du film comme id du document
        const movieRef = doc(db, 'users', auth.currentUser.uid, 'watchlist', movieId);

        // Récuperer la watchlist depuis local storage
        const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        // Vérifier si le film est déjà dans la watchlist
        if (storedWatchlist.includes(movieId)) {
            alert('Ce film est déjà dans votre watchlist');
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
            localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
            return newWatchlist;
        });

    } catch (error) {
        console.error('Erreur lors de l\'ajout du film à la watchlist :', error);
        alert('Erreur lors de l\'ajout du film à la watchlist');
    }
};

export function MooviesList({ currentPage, movies, setMovies, setSeries, setMooviesNowPlaying, setTotalPages, setPage }) {
    const [moviesAddedToWatchlist, setMoviesAddedToWatchlist] = useState([]);

    const notify = () => toast.success("Film ajouté à votre watchlist", { autoClose: 3000 });

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                setPage(data.total_pages);
                setMovies(data.results);
            });
        const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        setMoviesAddedToWatchlist(storedWatchlist);
    }, [setMovies, currentPage, setPage]);

    const handleAddToWatchlist = (movie) => {
        if (auth.currentUser) {
            addToWatchlist(movie, setMoviesAddedToWatchlist)
                .then(() => {
                    notify(); // Call notify after successful addition
                })
                .catch(error => {
                    console.error("Error adding to watchlist:", error);
                    // Optionally, you could display an error toast here
                    toast.error("Erreur lors de l'ajout à la watchlist");
                });
        } else {
            alert('Vous devez être connecté pour ajouter des films à votre watchlist');
        }
    };

    useEffect(() => {

        const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || []; // Récuperer la watchlist depuis local storage
        setMoviesAddedToWatchlist(storedWatchlist); // Mettre à jour le state moviesAddedToWatchlist avec la watchlist

        const fetchMovies = fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                setTotalPages(data.total_pages); // Pour faire passer la props page à Pagination et faire fonctionner la pagination dans l'accueil
                setMooviesNowPlaying(data.results); // Pour faire passer la props mooviesNowPlaying à Trailers et faire fonctionner la page Trailers dans l'accueil
                return data.results.map(movie => ({ ...movie, type: 'movie' })); // Important: retournez le tableau transformé
            });

        const fetchSeries = fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=${currentPage}`)
            .then(response => response.json())
            .then(data => data.results.map(series => ({ ...series, type: 'serie' }))); // Ajoute une propriété 'type' et retourne le tableau transformé

        Promise.all([fetchMovies, fetchSeries])
            .then((results) => {
                const [movies, series] = results;
                const combinedItems = [...movies, ...series];
                setMovies(combinedItems);
                setSeries(series); // Pour faire passer la props series à SingleSeries et faire fonctionner la page détail d'un serie dans l'accueil
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, [setMovies, setSeries, setMooviesNowPlaying, setTotalPages, currentPage]); // Ajoutez setPage si vous utilisez useState pour cela

    const ratingFormat = (rating) => {
        return rating.toFixed(1).toString().replace('.', ',');
    }

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    }

    return (
        <div className="moovies-list">
            <ToastContainer />
            <h2>Liste des films et séries à l'affiche</h2>
            <ul>
                {movies.map((moovie) => (
                    <Link to={`/${moovie.type}/${moovie.id}`} key={moovie.id}>
                        <div className="moovie-container">
                            <div className="left">
                                <div className="card">
                                    <span onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToWatchlist(moovie);
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
                                    <li>{formatDate(moovie.release_date) || formatDate(moovie.first_air_date)}</li>
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