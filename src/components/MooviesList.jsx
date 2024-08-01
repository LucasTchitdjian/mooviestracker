import { Link } from 'react-router-dom';
import './MooviesList.css';
import { useContext, useEffect } from 'react';
import { FaStar, FaPlus, FaCheck } from "react-icons/fa";
import { db } from '../firebase-config';
import { auth } from '../firebase-config';
import { setDoc, doc} from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GlobalContext } from '../context/GlobalContext';

export const addToWatchlistMovies = async (movie, setMoviesAddedToWatchlist) => {
    if (!auth.currentUser) {
        toast.error("Vous devez être connecté pour ajouter des films à votre watchlist", {
            autoclose: 1000,
        });
        return;
    }

    try {
        const movieId = movie.id.toString();
        const movieRef = doc(db, 'users', auth.currentUser.uid, 'watchlist', movieId);

        const userId = auth.currentUser.uid;
        const storedWatchlist = JSON.parse(localStorage.getItem(`${userId}-watchlist`)) || [];

        if (storedWatchlist.includes(movieId)) {
            toast.warning("Ce film est déjà dans votre watchlist", {
                autoclose: 1000,
            });
            return;
        }

        await setDoc(movieRef, {
            id: movie.id,
            type: 'movie',
            title: movie.title || movie.name,
            poster_path: movie.poster_path,
            overview: movie.overview,
            release_date: movie.release_date || movie.first_air_date,
            timestamp: new Date()
        });
        toast.success("Film ajouté à votre watchlist", {
            autoclose: 100,
        });
        setMoviesAddedToWatchlist(prevState => {
            const newWatchlist = [...prevState, movieId];
            localStorage.setItem(`${userId}-watchlist`, JSON.stringify(newWatchlist));
            return newWatchlist;
        });

    } catch (error) {
        console.error('Erreur lors de l\'ajout du film à la watchlist :', error);
        toast.error("Erreur lors de l'ajout à la watchlist", {
            autoclose: 1000,
        });
    }
};

export function MooviesList({ currentPage, movies, setMovies, setTotalPages }) {
    const { moviesAddedToWatchlist, setMoviesAddedToWatchlist } = useContext(GlobalContext);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
                const response = await fetch(
                    `https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdbApiKey}&language=fr-FR&page=${currentPage}`
                );
                const data = await response.json();
                setTotalPages(data.total_pages);
                setMovies(data.results);

            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        fetchMovies(); 
    }, [currentPage, setMovies, setTotalPages]);

    const handleAddToWatchlist = (movie) => {
        addToWatchlistMovies(movie, setMoviesAddedToWatchlist);
    }

    const ratingFormat = (rating) => {
        if (rating !== undefined) {
            return rating.toFixed(1).toString().replace('.', ',');
        } else {
            return 'N/A';
        }
    }

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(date).toLocaleDateString('fr-FR', options);
    }

    return (
        <div className="moovies-list">
            <ToastContainer />
            <h2>Liste des films à l'affiche</h2>
            <ul>
                {movies.map((movie, index) => (
                    <Link to={`/now-playing/movie/${movie.id}`} key={index}>
                        <div className="moovie-container">
                            <div className="left">
                                <div className="card">
                                    <span onClick={(e) => {
                                        e.preventDefault();
                                        handleAddToWatchlist(movie);
                                    }} 
                                    className='add-watchlist' 
                                    style={moviesAddedToWatchlist.includes(movie.id.toString()) ? { backgroundColor: '#22BB33'} : {}}>
                                        {moviesAddedToWatchlist.includes(movie.id.toString()) ? <FaCheck/> : <FaPlus />}</span>
                                    <p className='rating'><FaStar /> {ratingFormat(movie.vote_average)}</p>
                                    {movie.poster_path !== null ? <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" /> : <img src="https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg" alt="" />}
                                    <div className="moovie-info">
                                    </div>
                                </div>
                            </div>
                            <div className="right">
                                <div className="first-col">
                                    <li className='title'>{movie.title || movie.name}</li>
                                    <span className='release-date'>Sortie <strong>{formatDate(movie.release_date)}</strong></span>
                                    {/* <li>{formatDate(moovie.release_date) || formatDate(moovie.first_air_date)}</li> */}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    )
}