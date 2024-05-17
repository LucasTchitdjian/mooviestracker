import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './SingleMoovies.css';

function SingleMoovies({ movies }) {
    const [moovieInfos, setMoovieInfos] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

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
        const fetchMoovieInfos = async () => {
            setLoading(true);
            // Vérifiez d'abord si les informations sont déjà dans localStorage
            const storedMoovieInfos = localStorage.getItem(`moovieInfos_${id}`);         

            if (storedMoovieInfos) {
                // Utilisez les informations stockées dans localStorage
                setMoovieInfos(JSON.parse(storedMoovieInfos));
                setLoading(false);
            } else {
                // Si non, faites une requête à l'API
                try {
                    const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=d7e7ae694a392629f56dea0d38fd160e`);
                    const data = await response.json(); 
                    setMoovieInfos(data);
                    // Stockez les informations dans localStorage
                    localStorage.setItem(`moovieInfos_${id}`, JSON.stringify(data));
                    setLoading(false);
                } catch (error) {
                    console.error('Erreur lors de la récupération des informations du film:', error);
                    setLoading(false);
                }
            }
        };

        fetchMoovieInfos();
    }, [id]);

    const movieGenres = moovieInfos && moovieInfos.genres.map(genre => genre.name).join(', ');

    if (loading) {
        return <p>Chargement...</p>;
    }

    const displayedMovie = moovieInfos || movie;

    return (
        <div className="wrapper">
            <div className='single-moovies'>
                {displayedMovie ? (
                    <>
                        <h2>{displayedMovie.title}</h2>
                        <div className="card">
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
        </div>
    );
}

export default SingleMoovies;