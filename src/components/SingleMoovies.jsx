import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import './SingleMoovies.css';
import { FaLongArrowAltLeft, FaCheck, FaPlus } from "react-icons/fa";
import { auth } from '../firebase-config';
import { getDocs, collection } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import { db } from '../firebase-config';
import { addToWatchlistMovies } from './MooviesList';

function SingleMoovies({ movies }) {
    const [moovieInfos, setMoovieInfos] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [moviesAddedToWatchlist, setMoviesAddedToWatchlist] = useState([]);
    const [trailer, setTrailer] = useState(null);

    const notify = () => toast.success("Film ajouté à votre watchlist", { autoclose: 1000 });

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const collectionUrl = searchParams.get('collection');

    // Déterminez le chemin de retour en fonction de la collection
    let backPath = '/'; // Chemin par défaut
    if (collectionUrl === 'now-playing') {
        backPath = '/now-playing';
    } else if (collectionUrl === 'top-rated') {
        backPath = '/top-rated';
    } else {
        // Si la collection n'est pas spécifiée, utilisez le chemin actuel comme chemin de retour
        backPath = location.pathname.split('/').slice(0, -1).join('/');
    }

    // Déterminez le lien à afficher en fonction du backPath 
    let linkTo = "/"; // Chemin par défaut vers la page d'accueil
    if (backPath.startsWith('/now-playing')) {
        linkTo = '/now-playing';
    } else if (backPath.startsWith('/top-rated')) {
        linkTo = '/top-rated';
    }

    // Utilise find pour obtenir directement le film désiré.
    const movie = movies.find(movie => movie.id === parseInt(id, 10));

    // Formater la date ici si movie existe
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
    };

    const formatRuntime = (runtime) => {
        if (runtime > 60) {
            const hours = Math.floor(runtime / 60);
            const minutes = runtime % 60;
            return `${hours}h${minutes}min`;
        } else {
            return `${runtime}min`;
        }
    }

    const formatRating = (rating) => {
        rating = rating.toFixed(1);
        return rating.toString().replace('.', ',');
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
                await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}`) // Requête pour obtenir les informations du film
                    .then(response => response.json())
                    .then(data => {
                        setMoovieInfos(data);
                        setLoading(false);
                    });
                
                const userId = auth.currentUser ? auth.currentUser.uid : 'guest';
                const storedWatchlist = JSON.parse(localStorage.getItem(`${userId}-watchlist`)) || [];
                setMoviesAddedToWatchlist(storedWatchlist);

                if (auth.currentUser) {
                    // Fetch watchlist from Firestore when user is logged in
                    const watchlistRef = collection(db, 'users', auth.currentUser.uid, 'watchlist');
                    getDocs(watchlistRef)
                        .then(snapshot => {
                            const watchlistMovies = snapshot.docs.map(doc => doc.data().id.toString());
                            setMoviesAddedToWatchlist(watchlistMovies);
                        })
                        .catch(error => {
                            console.error('Erreur lors de la récupération de la watchlist :', error);
                            toast.error("Erreur lors de la récupération de la watchlist", { autoclose: 1000 });
                        });
                } else {
                    // Clear watchlist when user is not logged in
                    const userId = auth.currentUser ? auth.currentUser.uid : 'guest';
                    const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
                    setMoviesAddedToWatchlist(storedWatchlist);
                }

                const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos?api_key=${tmdbApiKey}`) // Requête pour obtenir la bande annonce du film
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.results && data.results.length > 0) {
                            const trailer = data.results.find(video => video.type === 'Trailer');
                            if (trailer) {
                                setTrailer(trailer);
                                return trailer.key;
                            }
                        }
                        return null;
                    });
                return response;
            } catch (error) {
                console.error('Erreur lors de la récupération des informations du film :', error);
                toast.error("Erreur lors de la récupération des informations du film", { autoclose: 1000 });
            }
        };
        fetchData();
    }, [id]);

    const movieGenres = moovieInfos && moovieInfos.genres.map(genre => genre.name).join(', ');

    if (loading) {
        return <p>Chargement...</p>;
    }

    const displayedMovie = moovieInfos || movie;

    return (
        <div className="wrapper">
            <ToastContainer />
            <div className="back-btn">
                <Link to={linkTo}><FaLongArrowAltLeft /> Retour</Link>
            </div>
            <div className='single-moovies'>
                <div className="movie-infos">
                    {displayedMovie ? (
                            <>
                            <h2>{displayedMovie.title}</h2>
                            <div className="card">
                                <span onClick={(e) => {
                                    e.preventDefault();
                                    addToWatchlistMovies(displayedMovie);
                                    notify();
                                }} className='add-watchlist' style={Array.isArray(moviesAddedToWatchlist) && moviesAddedToWatchlist.includes(displayedMovie.id.toString()) ? { backgroundColor: '#22BB33' } : {}}>{Array.isArray(moviesAddedToWatchlist) && moviesAddedToWatchlist.includes(displayedMovie.id.toString()) ? <FaCheck /> : <FaPlus />}</span>
                                <div className="left">
                                    <img src={`https://image.tmdb.org/t/p/w500${displayedMovie.poster_path}`} alt={displayedMovie.title} />
                                </div>
                                <div className="right">
                                    <div className="first-line">
                                        <p>{formatDate(displayedMovie.release_date)} <span>en salle</span></p>
                                        <p>{formatRuntime(displayedMovie?.runtime)}</p>
                                        <p>{movieGenres ? movieGenres : ""}</p>
                                    </div>
                                    <div className="second-line">
                                        <div className="rating">
                                            <p>Spectateurs:</p>
                                            <p>{formatRating(displayedMovie.vote_average)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <p>Film non trouvé.</p>
                    )}
                    <div className="synopsis">
                        <h3>Synopsis</h3>
                        <p>{displayedMovie?.overview || "Pas de synopsis"}</p>
                    </div>
                </div>
                <div className="video">
                    <h3>Bande annonce</h3>
                    {trailer ? (
                        <iframe width="560" height="315" src={`https://www.youtube.com/embed/${trailer.key}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                    ) : (
                        <p>Pas de bande annonce disponible</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SingleMoovies;