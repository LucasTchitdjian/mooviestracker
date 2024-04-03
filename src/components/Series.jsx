import React, { useEffect } from 'react';
import './Series.css';

const Series = () => {

    const [series, setSeries] = React.useState([]);

    useEffect(() => {
        fetch('https://api.themoviedb.org/3/tv/top_rated?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=1')
            .then(response => response.json())
            .then(data => {
                setSeries(data);
            });
    }, []);

    return (
        <div className='series'>
            <h2>Liste des séries les mieux notées de tous les temps</h2>
            <ul>
                {series.results && series.results.map((serie, index) => (
                    <div className="card">
                        <li key={index}>
                            <div className="left">
                                <img src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`} alt={serie.name} />
                            </div>
                            <div className="right">
                                <li className='title'>{serie.name}</li>
                                <li>Spectateurs {serie.vote_average.toFixed(1).replace('.', ',')}</li>
                            </div>
                        </li>
                    </div>
                ))}
            </ul>
        </div>
    );
};

export default Series;