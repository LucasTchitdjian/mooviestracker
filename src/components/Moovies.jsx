import React, { useEffect } from 'react';
import './Moovies.css';
import { Link } from 'react-router-dom';

const Moovies = ({ movies, setMovies }) => {

    useEffect(() => {
        fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=1')
            .then(response => response.json())
            .then(data => {
                setMovies(data.results);
            });
    }, [setMovies]);

    return (
        <div className='moovies'>
            <h2>Liste des films les mieux notés de tous les temps</h2>
            <ul>
                {movies.map((moovie, index) => (
                    <Link to={`/movie/${moovie.id}`} key={moovie.id}>
                        <div className="card">
                            <li key={index}>
                                <div className="left">
                                    <img src={`https://image.tmdb.org/t/p/w500${moovie.poster_path}`} alt={moovie.title} />
                                </div>
                                <div className="right">
                                    <li className='title'>{moovie.title}</li>
                                    <li>Spectateurs {moovie.vote_average.toFixed(1).replace('.', ',')}</li>
                                </div>
                            </li>
                        </div>
                    </Link>
                ))
                }
            </ul>
        </div>
    );
};

export default Moovies;