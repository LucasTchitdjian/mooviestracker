import React, { useContext } from 'react';
import { MoviesContext } from '../context/GlobalContext'; // Adjust the import path
import './Banner.css';
import { formatDate } from '../utils/movieReleaseDateFormatter';

export const Banner = () => {
    const { movies } = useContext(MoviesContext);

    // Select the first movie or any specific movie logic
    const featuredMovie = movies && movies.length > 0 ? movies[0] : null;

    console.log('featuredMovie:', featuredMovie);

    return (
        <div className="banner">
            {featuredMovie ? (
                <div className="movie-banner">
                    <img
                        src={`https://image.tmdb.org/t/p/original${featuredMovie.poster_path}`}
                        alt={featuredMovie.title || featuredMovie.name}
                        className='active'
                    />
                    <div className="content">
                        <h2>{featuredMovie.title || featuredMovie.name}</h2>
                        <div className="sub-infos">
                        <span>Sortie: {formatDate(featuredMovie.release_date)}</span>
                        </div>
                        <p>{featuredMovie.overview}</p>
                    </div>
                </div>
            ) : (
                <p>No featured movie available</p>
            )}
        </div>
    );
};
