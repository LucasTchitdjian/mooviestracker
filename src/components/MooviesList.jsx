import { Link } from 'react-router-dom';
import './MooviesList.css';
import { useEffect, useState } from 'react';

export function MooviesList({ movies, setMovies }) {

    const [mooviesInfo, setMooviesInfo] = useState('false');

    useEffect(() => {
        const itemHovered = document.querySelectorAll('.card');
        itemHovered.forEach(item => {
            item.addEventListener('mouseover', () => {
                setMooviesInfo(true);
            });
            item.addEventListener('mouseout', () => {
                setMooviesInfo(false);
            });
        });
    });

    useEffect(() => {
        fetch('https://api.themoviedb.org/3/movie/now_playing?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=1')
            .then(response => response.json())
            .then(data => setMovies(data.results));
    }, [setMovies]);

    return (
        <div className="moovies-list">
            <h2>Liste des films à l'affiche</h2>
            <ul>

                {movies.map((moovie) => (
                    <Link to={`/movie/${moovie.id}`}>
                        <div className="card">
                            <img src={`https://image.tmdb.org/t/p/w500${moovie.poster_path}`} alt="" />
                            {/* <li className='title'>{moovie.title}</li> a mettre dans la fiche indivuelle des films*/}
                            {mooviesInfo && (
                                <div className="moovie-info">
                                    <h3>{moovie.title}</h3>
                                </div>
                            )
                            }
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    )
}