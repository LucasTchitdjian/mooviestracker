import React, { useEffect } from 'react';
import './Moovies.css';

const Moovies = () => {

    const [moovies, setMoovies] = React.useState([]);

    useEffect(() => {
        fetch('https://api.themoviedb.org/3/movie/top_rated?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=1')
            .then(response => response.json())
            .then(data => {
                setMoovies(data);
            });
    }, []);

    return (
        <div className='moovies'>
            <h2>Lites des films les mieux notés de tous les temps</h2>
            <ul>
                {moovies.results && moovies.results.map((moovie, index) => (
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
                ))
                }
            </ul>
        </div>
    );
};

export default Moovies;