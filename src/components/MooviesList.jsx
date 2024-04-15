import { Link } from 'react-router-dom';
import './MooviesList.css';
import { useEffect } from 'react';

export function MooviesList({ currentPage, movies, setMovies, setSeries, setTrailers, setPage }) {

    console.log(currentPage, "props current page dans moovieslist")

    useEffect(() => {
        const fetchMovies = fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                setPage(data.total_pages); // Pour faire passer la props page à Pagination et faire fonctionner la pagination dans l'accueil
                return data.results.map(movie => ({ ...movie, type: 'movie' })); // Important: retournez le tableau transformé
            });
    
        const fetchSeries = fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=${currentPage}`)
            .then(response => response.json())
            .then(data => data.results.map(series => ({ ...series, type: 'serie' }))); // Ajoute une propriété 'type' et retourne le tableau transformé
    
        Promise.all([fetchMovies, fetchSeries])
            .then((results) => {
                const [movies, series] = results;
                const combinedItems = [...movies, ...series];
                setMovies(combinedItems);
                setSeries(series); // Pour faire passer la props series à SingleSeries et faire fonctionner la page détail d'un serie dans l'accueil
                setTrailers(movies); // Pour faire passer la props trailers à Trailers et faire fonctionner la page Trailers dans l'accueil
            })
            .catch(error => {
                console.error('Error fetching data: ', error);
            });
    }, [setMovies, setSeries, setTrailers, setPage, currentPage]); // Ajoutez setPage si vous utilisez useState pour cela
    
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