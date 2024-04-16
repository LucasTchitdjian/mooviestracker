import React, { useEffect } from 'react';
import './Series.css';
import { Link } from 'react-router-dom';

const Series = ({ series, setSeries, currentPage, setPage }) => {

    useEffect(() => {
        fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR&page=${currentPage}`)
            .then(response => response.json())
            .then(data => {
                setPage(data.total_pages); // Pour faire passer la props page à Pagination et faire fonctionner la pagination dans l'accueil
                setSeries(data.results);
            });
    }, [setSeries, setPage, currentPage]);

    return (
        <div className='series'>
            <h2>Liste des séries les mieux notées de tous les temps</h2>
            <ul>
                {series.map((serie, index) => (
                    <Link to={`/serie/${serie.id}`}>
                        <div className="card">
                            <li key={index}>
                                <div className="left">
                                    <img src={`https://image.tmdb.org/t/p/w500${serie.poster_path}`} alt={serie.name} />
                                </div>
                                <div className="right">
                                <li>Spectateurs {serie.vote_average.toFixed(1).replace('.', ',')}</li>
                                </div>
                            </li>
                        </div>
                    </Link>
                ))}
            </ul>
        </div>
    );
};

export default Series;