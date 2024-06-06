import React, { useEffect, useState } from 'react';
import './Series.css';
import { Link } from 'react-router-dom';
import { FaPlus, FaCheck, FaStar } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from '../firebase-config';
import { getDocs, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

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

const Series = ({ series, setSeries, currentPage, setPage }) => {
    const [seriesAddedToWatchlist, setSeriesAddedToWatchlist] = useState([]);

    const notify = () => toast.success("Film ajouté à votre watchlist", {
        autoClose: 3000,
    });

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                setPage(data.total_pages); // Pour faire passer la props page à Pagination et faire fonctionner la pagination dans l'accueil
                setSeries(data.results);
            });
        const storedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        setSeriesAddedToWatchlist(storedWatchlist);

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
    }, [setSeries, setPage, currentPage]);

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
                                        addToWatchlist(serie, setSeriesAddedToWatchlist);
                                        notify();
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