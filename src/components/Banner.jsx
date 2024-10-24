import React, { useContext, useState, useEffect } from 'react';
import { TrendingMoviesContext } from '../context/GlobalContext';
import './Banner.css';
import { MovieSwiper } from './MovieSwiper';
import { Link } from 'react-router-dom';

export const Banner = () => {
    const { trendingMovies } = useContext(TrendingMoviesContext);
    const [activeMovie, setActiveMovie] = useState(null);

    useEffect(() => {
        if (trendingMovies && trendingMovies.length > 0) {
            setActiveMovie(trendingMovies[0]);
        }
    }, [trendingMovies]);

    const handleSlideChange = (swiper) => {
        setActiveMovie(trendingMovies[swiper.realIndex]);
    };

    return (
        <div className="banner">
            {activeMovie && (
                <>
                    <div className="movie-banner">
                        <div className="content">
                            <Link to={`/now-playing/movie/${activeMovie.id}`}>
                                <h2>{activeMovie.title || activeMovie.name}</h2>
                            </Link>
                            <p>{activeMovie.overview.slice(0, 200)}{activeMovie.overview.length > 200 && '...'}</p>
                        </div>
                    </div>
                    <MovieSwiper slides={trendingMovies} onSlideChange={handleSlideChange} />
                </>
            )}
        </div>
    );
};
