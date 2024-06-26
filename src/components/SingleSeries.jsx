import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SingleSeries.css';
import { Link } from 'react-router-dom';
import { FaLongArrowAltLeft, FaCheck, FaPlus } from "react-icons/fa";
import { auth } from '../firebase-config';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase-config';
import { ToastContainer, toast } from 'react-toastify';

const addToWatchlist = async (serie, setSeriesAddedToWatchlist) => {
    if (!auth.currentUser) {
        console.log("No user logged in.");
        toast.error("Vous devez être connecté pour ajouter des séries à votre watchlist", { autoClose: 3000 });
        return;
    }

    try {
        const serieId = serie.id.toString();
        const serieRef = doc(db, 'users', auth.currentUser.uid, 'watchlist', serieId);

        const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

        if (storedWatchlist.includes(serieId)) {
            toast.warning("Cette série est déjà dans votre watchlist", { autoClose: 3000 });
            return;
        }

        await setDoc(serieRef, {  // Use 'serie' instead of 'movie' here
            id: serie.id,
            title: serie.title || serie.name,
            poster_path: serie.poster_path,
            overview: serie.overview,
            release_date: serie.release_date || serie.first_air_date,
            timestamp: new Date()
        });

        setSeriesAddedToWatchlist(prevState => {
            const newWatchlist = [...prevState, serieId];
            localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
            return newWatchlist;
        });

    } catch (error) {
        console.error('Erreur lors de l\'ajout de la série à la watchlist :', error);
        toast.error("Erreur lors de l'ajout à la watchlist", { autoClose: 3000 });
    }
};

function SingleSeries({ series }) {
    const [serieInfos, setSerieInfos] = useState(null);
    const [genreNames, setGenreNames] = useState(null);
    const { id } = useParams();
    const [seriesAddedToWatchlist, setSeriesAddedToWatchlist] = useState([]);

    const notify = () => toast.success("Film ajouté à votre watchlist", {
        autoClose: 3000,
    });
    // Utilise find pour obtenir directement la série désiré. 

    const serie = series.find(serie => serie.id === parseInt(id, 10));

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
        if (rating !== undefined) {
            rating = rating.toFixed(1);
            return rating.toString().replace('.', ',');
        }
    }

    const formatReleaseDate = (releaseDate) => {
        const date = new Date(releaseDate);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
        });
    }

    const genre_ids = serieInfos?.genre_ids;

    useEffect(() => {
        if (!serie) {
            fetch(`https://api.themoviedb.org/3/tv/${serie}?api_key=d7e7ae694a392629f56dea0d38fd160e`)
                .then(response => response.json())
                .then(data => setSerieInfos(data))
                .catch(error => console.error('Erreur lors de la récupération des données de la série:', error));
        } else {
            setSerieInfos(serie);
            const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
            setSeriesAddedToWatchlist(storedWatchlist);
            const fetchGenreNames = async () => {
                const names = await getGenres(serie.genre_ids); // Supposons que genreIds est un tableau d'IDs de genres
                setGenreNames(names); // Mettez à jour l'état avec les noms de genres obtenus
            };
            fetchGenreNames();

            if (auth.currentUser) {
                // Fetch watchlist from Firestore when user is logged in
                const watchlistRef = collection(db, 'users', auth.currentUser.uid, 'watchlist');
                getDocs(watchlistRef)
                    .then(snapshot => {
                        const watchlistSeries = snapshot.docs.map(doc => doc.data().id.toString());
                        setSeriesAddedToWatchlist(watchlistSeries);
                    })
                    .catch(error => {
                        console.error("Error getting watchlist:", error);
                        toast.error("Erreur lors de la récupération de la watchlist", {
                            autoClose: 3000,
                        });
                    });
            } else {
                // Clear watchlist when user is not logged in
                const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
                setSeriesAddedToWatchlist(storedWatchlist);
            }
        }
    }, [id, serie, genreNames, genre_ids]);

    console.log(seriesAddedToWatchlist, "seriesAddedToWatchlist")

    const getGenres = async (genres) => {
        try {
            const response = await fetch(`https://api.themoviedb.org/3/genre/tv/list?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR`);
            const data = await response.json();
            const serieGenres = genres.map(genreId => {
                const genreData = data.genres.find(genre => genre.id === genreId);
                return genreData ? genreData.name : null;
            }).filter(name => name != null); // Filtrer pour enlever les éventuels null
            return serieGenres.join(' | ');
        } catch (error) {
            console.error('Erreur lors de la récupération des genres:', error);
            return ''; // Retourne une chaîne vide ou une valeur par défaut en cas d'erreur
        }
    };

    return (
        <div className="wrapper">
            <ToastContainer />
            <div className="back-btn">
                <Link to="/series"><FaLongArrowAltLeft /> Retour</Link>
            </div>
            <div className='single-series'>
                {serieInfos ? (
                    <>
                        <h2>{serieInfos.name}</h2>
                        <div className="card">
                            <span onClick={(e) => {
                                e.preventDefault();
                                addToWatchlist(serieInfos, setSeriesAddedToWatchlist);
                                notify();
                            }}
                                className='add-watchlist'
                                style={Array.isArray(seriesAddedToWatchlist) && seriesAddedToWatchlist.includes(serieInfos.id.toString()) ? { backgroundColor: '#22BB33' } : {}}>
                                {Array.isArray(seriesAddedToWatchlist) && seriesAddedToWatchlist.includes(serieInfos.id.toString()) ? <FaCheck /> : <FaPlus />}
                            </span>
                            <div className="left">
                                <img src={`https://image.tmdb.org/t/p/w500${serieInfos.poster_path}`} alt={serieInfos.title} />
                            </div>
                            <div className="right">
                                <div className="first-line">
                                    <p>Depuis {formatReleaseDate(serieInfos.first_air_date)}</p>
                                    {/* Vérifier si episode_run_time est défini et a une longueur supérieure à 0 avant de l'utiliser */}
                                    {serieInfos && serieInfos.episode_run_time && serieInfos.episode_run_time.length > 0 ?
                                        <p>{formatRuntime(serieInfos.episode_run_time[0])}</p> // Si vous avez plusieurs durées et voulez toutes les afficher, vous devez ajuster la logique ici
                                        : null}
                                    <p>{genreNames}</p>
                                </div>
                                <div className="second-line">
                                    <div className="rating">
                                        <p>Spectateurs:</p>
                                        <p>{formatRating(serieInfos.vote_average)}</p>
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
                    <p>{serieInfos?.overview}</p>
                </div>
            </div>
        </div>
    );
}

export default SingleSeries;
