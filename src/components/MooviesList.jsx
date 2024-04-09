import { Link } from 'react-router-dom';
import './MooviesList.css';
import { useEffect } from 'react';

export function MooviesList({ movies, setMovies }) {

    useEffect(() => {
        fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=1')
            .then(response => response.json())
            .then(data => setMovies(data.results));
    }, [setMovies]);

    console.log(movies, "movies dans moovieslist");

    return (
        <div className="moovies-list">
            <h2>Liste des films à l'affiche</h2>
            <ul>
                {movies.map((moovie) => (
                    <Link to={`/movie/${moovie.id}`} key={moovie.id}>
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