import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SingleSeries.css';

function SingleSeries({ series, setSeries }) {
    const [serieInfos, setSerieInfos] = useState(null);
    const { id } = useParams();
    // Utilise find pour obtenir directement la série désiré. 

    const serie = series.results.find(serie => serie.id === parseInt(id, 10));

    // // Formater la date ici si movie existe
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Intl.DateTimeFormat('fr-FR', options).format(new Date(dateString));
    };

    const formatRuntime = (runtime) => {
        console.log(runtime, "runtime")
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
        if (!serie) {
            fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=d7e7ae694a392629f56dea0d38fd160e`)
                .then(response => response.json())
                .then(data => setSerieInfos(data))
                .catch(error => console.log("Fetching series failed", error));
        } else {
            setSerieInfos(serie);
        }
    }, [id, serie]);

    console.log(serieInfos, "series infos")


    let serieGenres = '';
    if (serieInfos && serieInfos.genres) {
        serieGenres = serie.genres.map(genre => genre.name).join(', ');
    }

    return (
        <div className="wrapper">
            <div className='single-series'>
                {serieInfos ? (
                    <>
                        <h2>{serieInfos.title}</h2>
                        <div className="card">
                            <div className="left">
                                <img src={`https://image.tmdb.org/t/p/w500${serieInfos.poster_path}`} alt={serieInfos.title} />
                            </div>
                            <div className="right">
                                <div className="first-line">
                                    {/* Vérifier si episode_run_time est défini et a une longueur supérieure à 0 avant de l'utiliser */}
                                    {serieInfos && serieInfos.episode_run_time && serieInfos.episode_run_time.length > 0 ?
                                        <p>{formatRuntime(serieInfos.episode_run_time[0])}</p> // Si vous avez plusieurs durées et voulez toutes les afficher, vous devez ajuster la logique ici
                                        : null}
                                    <p>{serieGenres}</p>
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
                    <p>{serie.overview}</p>
                </div>
            </div>
        </div>
    );
}

export default SingleSeries;
