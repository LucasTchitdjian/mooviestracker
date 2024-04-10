import { Link } from 'react-router-dom';
import './MooviesList.css';
import { useEffect } from 'react';

export function MooviesList({ movies, setMovies, setSeries }) {

    useEffect(() => {
        const fetchMovies = fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=1')
            .then(response => response.json())
            .then(data => data.results.map(movie => ({ ...movie, type: 'movie' }))); // Ajoute une propriété 'type'

        const fetchSeries = fetch('https://api.themoviedb.org/3/tv/on_the_air?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=1')
            .then(response => response.json())
            .then(data => data.results.map(series => ({ ...series, type: 'serie' }))); // Ajoute une propriété 'type'

        Promise.all([fetchMovies, fetchSeries])
            .then((results) => {
                const [movies, series] = results;
                const combinedItems = [...movies, ...series];
                setMovies(combinedItems);
                setSeries(series); // Pour faire passer la props series à SingleSeries et faire fonctionner la page détail d'un serie dans l'accueil
            });
    }, [setMovies, setSeries]);

    console.log(movies, "movies dans moovieslist")

    return (
        <div className="moovies-list">
            <h2>Liste des films et séries à l'affiche</h2>
            <ul>
                {movies.map((moovie) => (
                    <Link to={`/${moovie.type}/${moovie.id}`} key={moovie.id}>
                        <div className="card">
                            {moovie.poster_path !== null ? <img src={`https://image.tmdb.org/t/p/w500${moovie.poster_path}`} alt="" /> : <img src="https://img.freepik.com/premium-vector/default-image-icon-vector-missing-picture-page-website-design-mobile-app-no-photo-available_87543-11093.jpg" alt="" />}
                            <div className="moovie-info">
                            </div>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    )
}