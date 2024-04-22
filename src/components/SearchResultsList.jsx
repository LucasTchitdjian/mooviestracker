import { Link } from 'react-router-dom';
import './SearchResultsList.css';
import { useEffect } from 'react';

export function SearchResultsList({ movies, setMovies, search, setSearch }) {

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=d7e7ae694a392629f56dea0d38fd160e&query=${search}`)
            .then(response => response.json())
            .then(data => setSearch(data.results))
            .catch(error => console.error('Erreur lors de la recherche du film:', error));

    }, [setSearch, setMovies, search]);

    console.log(movies, search, setSearch, setMovies)

    return (
        <div className="moovies-list">
            <h2>Recherche</h2>
            <ul>
                {movies.map((moovie) => (
                    <Link to={`/movie/${moovie.id}`} key={moovie.id}>
                        <div className="card">
                            <img src={`https://image.tmdb.org/t/p/w500${moovie.poster_path}`} alt="" />
                            <div className="moovie-info">
                            </div>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    )
}