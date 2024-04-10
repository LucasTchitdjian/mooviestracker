import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SingleSeries.css';

function SingleSeries({ series }) {
    const [serieInfos, setSerieInfos] = useState(null);
    const { id } = useParams();
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

    useEffect(() => {
        if (!serie) {
            fetch(`https://api.themoviedb.org/3/tv/${serie}?api_key=d7e7ae694a392629f56dea0d38fd160e`)
                .then(response => response.json())
                .then(data => setSerieInfos(data))
                .catch(error => console.error('Erreur lors de la récupération des données de la série:', error));

        } else {
            setSerieInfos(serie);
        }
    }, [id, serie]);

    console.log(serieInfos, "serieInfos dans singleSeries")

    let serieGenres = '';
    if (serieInfos && serieInfos.genres) {
        serieGenres = serie.genres.map(genre => genre.name).join(', ');
    }

    return (
        <div className="wrapper">
            <div className='single-series'>
                {serieInfos ? (
                    <>
                        <h2>{serieInfos.name}</h2>
                        <div className="card">
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
                </div>
            </div>
        </div>
    );
}

export default SingleSeries;
