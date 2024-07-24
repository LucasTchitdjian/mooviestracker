import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import './SingleSeries.css';
import { FaLongArrowAltLeft, FaCheck, FaPlus } from "react-icons/fa";
import { ToastContainer } from 'react-toastify';
import { addToWatchlistSeries } from './Series';
import { GlobalContext } from '../context/GlobalContext';

function SingleSeries() {
    const [serieInfos, setSerieInfos] = useState(null);
    const [genreNames, setGenreNames] = useState(null);
    const { id } = useParams();
    const { seriesAddedToWatchlist, setSeriesAddedToWatchlist } = React.useContext(GlobalContext);

    const location = useLocation();
    const navigate = useNavigate();
    const searchQuery = new URLSearchParams(location.search).get('query');
    const from = location.state?.from || { pathname: '/' };

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
        if (!releaseDate) return '';
        const date = new Date(releaseDate);
        return date.toLocaleDateString('fr-FR', {
            year: 'numeric',
        });
    }

    useEffect(() => {
        const fetchSingleSerie = async () => {
            try {
                const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
                const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${tmdbApiKey}`);
                const data = await response.json();
                setSerieInfos(data);

                if (data.genres) {
                    const genres = data.genres.map(genre => genre.name).join(', ');
                    setGenreNames(genres);
                }
            } catch (error) {
                console.error('Erreur lors de la récupération des informations de la série:', error);
            }
        };

        fetchSingleSerie();
    }, [id]);

    const handleAddToWatchlist = (serie) => {
        addToWatchlistSeries(serie, setSeriesAddedToWatchlist);
    }

    return (
        <div className="wrapper">
            <ToastContainer />
            <div className="back-btn">
                <button onClick={() => navigate(`/search/?query=${searchQuery}`)} to={from}><FaLongArrowAltLeft /> Retour</button>
            </div>
            <div className='single-series'>
                {serieInfos ? (
                    <>
                        <h2>{serieInfos.name}</h2>
                        <div className="card">
                            <span onClick={(e) => {
                                e.preventDefault();
                                handleAddToWatchlist(serieInfos);
                            }}
                                className='add-watchlist'
                                style={seriesAddedToWatchlist.includes(serieInfos.id.toString()) ? { backgroundColor: '#22BB33' } : {}}>
                                {seriesAddedToWatchlist.includes(serieInfos.id.toString()) ? <FaCheck /> : <FaPlus />}
                            </span>
                            <div className="left">
                                <img src={`https://image.tmdb.org/t/p/w500${serieInfos.poster_path}`} alt={serieInfos.title} />
                            </div>
                            <div className="right">
                            <div className="first-line">
                                    <p>
                                        {formatReleaseDate(serieInfos.first_air_date) && <span>Depuis</span>} {formatReleaseDate(serieInfos.first_air_date)}
                                    </p>
                                    {serieInfos && serieInfos.episode_run_time && serieInfos.episode_run_time.length > 0 ?
                                        <p>{formatRuntime(serieInfos.episode_run_time[0])}</p> : null}
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
