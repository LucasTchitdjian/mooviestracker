import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SingleMoovies.css';

function SingleMoovies({ movies }) {
    const [moovieInfos, setMoovieInfos] = useState(null);
    const { id } = useParams();
    // Utilise find pour obtenir directement le film désiré.
    const movie = movies.find(movie => movie.id === parseInt(id, 10));
    console.log(movie, "movie dans singlemoovies");

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
        fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=d7e7ae694a392629f56dea0d38fd160e`)
            .then(response => response.json())
            .then(data => setMoovieInfos(data));
    }, [id]);

    const movieGenres = moovieInfos && moovieInfos.genres.map(genre => genre.name).join(', ');

    return (
        <div className="wrapper">
            <div className='single-moovies'>
                {movie && moovieInfos !== null ? (
                    <>
                        <h2>{movie.title}</h2>
                        <div className="card">
                            <div className="left">
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                            </div>
                            <div className="right">
                                <div className="first-line">
                                    <p>{formatDate(movie.release_date)} <span>en salle</span></p>
                                    <p>| {formatRuntime(moovieInfos.runtime)}</p>
                                    <p>| {movieGenres ? movieGenres : ""}</p>
                                </div>
                                <div className="second-line">
                                    <div className="rating">
                                        <p>Spectateurs:</p>
                                        <p>{formatRating(movie.vote_average)}</p>
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
                    <p>{movie.overview}</p>
                </div>
            </div>
        </div>
    );
}

export default SingleMoovies;
