import React, { useEffect, useState } from 'react';
import './Series.css';
import { Link } from 'react-router-dom';
import { FaPlus, FaCheck, FaStar } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../firebase-config';
import { getDocs, collection, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase-config';

export const addToWatchlistSeries = async (serie, setSeriesAddedToWatchlist) => {

    if (!auth.currentUser) { // Check if user is logged in
        toast.error("Vous devez être connecté pour ajouter des séries à votre watchlist", {
            autoclose: 1000,
        });
        return; // Stop execution if not logged in
    }

    try {
        const serieId = serie.id.toString(); 
        const serieRef = doc(db, 'users', auth.currentUser.uid, 'watchlist', serieId);

        // Récuperer la watchlist depuis local storage
        const userId = auth.currentUser.uid;
        const storedWatchlist = JSON.parse(localStorage.getItem(`${userId}-watchlist`)) || [];

        // Vérifier si le film est déjà dans la watchlist
        if (storedWatchlist.includes(serieId)) {
            toast.warning("Cette série est déjà dans votre watchlist", {
                autoclose: 1000,
            });
            return;
        }

        await setDoc(serieRef, {
            id: serie.id,
            type: 'tv',
            title: serie.title || serie.name,
            poster_path: serie.poster_path,
            overview: serie.overview,
            release_date: serie.release_date || serie.first_air_date,
            timestamp: new Date()
        });
        toast.success("Série ajouté à votre watchlist", {
            autoclose: 100,
        });
        setSeriesAddedToWatchlist(prevState => {
            const newWatchlist = [...prevState, serieId];
            localStorage.setItem('watchlist', JSON.stringify(newWatchlist));
            return newWatchlist;
        });

    } catch (error) {
        console.error('Erreur lors de l\'ajout du film à la watchlist :', error);
        toast.error("Erreur lors de l'ajout à la watchlist", {
            autoclose: 1000,
        });
    }
};

export function Series({ series, setSeries, currentPage, setTotalPages }) {
    const [seriesAddedToWatchlist, setSeriesAddedToWatchlist] = useState([]);

    useEffect(() => {
        const fetchSeriesAndWatchlist = async () => {
            try {
                const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
                const response = await fetch(
                    `https://api.themoviedb.org/3/tv/top_rated?api_key=${tmdbApiKey}&language=fr-FR&page=${currentPage}`
                );
                const data = await response.json();
                setTotalPages(data.total_pages);
                setSeries(data.results);

                if (auth.currentUser) {
                    const watchlistRef = collection(db, 'users', auth.currentUser.uid, 'watchlist');
                    const snapshot = await getDocs(watchlistRef);
                    const watchlistSeries = snapshot.docs.map(doc => doc.data().id.toString());
                    setSeriesAddedToWatchlist(watchlistSeries);
                }
            } catch (error) {
                console.error("Error fetching series:", error);
            }
        };
        fetchSeriesAndWatchlist();
    }, [currentPage, setSeries, setTotalPages]);

    return (
        <div className='series'>
            <ToastContainer />
            <h2>Liste des séries les mieux notées de tous les temps</h2>
            <ul>
                {series.map((serie, index) => (
                    <Link to={`/serie/${serie.id}`} key={index}>
                        <div className="series-container">
                            <div className="left">
                                <div className="card">
                                    <span onClick={(e) => {
                                        e.preventDefault();
                                        addToWatchlistSeries(serie, setSeriesAddedToWatchlist);
                                    }}
                                        className='add-watchlist'
                                        style={Array.isArray(seriesAddedToWatchlist) && seriesAddedToWatchlist.includes(serie.id.toString()) ? { backgroundColor: '#22BB33' } : {}}>
                                        {Array.isArray(seriesAddedToWatchlist) && seriesAddedToWatchlist.includes(serie.id.toString()) ? <FaCheck /> : <FaPlus />}
                                    </span>
                                    <p className='rating'><FaStar /> {serie.vote_average.toFixed(1).replace('.', ',')}</p>
                                    <img src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`} alt={serie.name} />
                                </div>
                            </div>
                            <div className="right">
                                <li className="title">{serie.name}</li>
                                {/* <li>Note: {serie.vote_average.toFixed(1).replace('.', ',')} /10</li> */}
                            </div>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default Series;