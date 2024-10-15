import React, { useContext, useState, useEffect } from 'react';
import { MoviesContext } from '../context/GlobalContext';
import './Banner.css';
import { MovieSwiper } from './MovieSwiper';

export const Banner = () => {
    const { movies } = useContext(MoviesContext);
    const [activeMovie, setActiveMovie] = useState(null);

    useEffect(() => {
        if (movies && movies.length > 0) {
            setActiveMovie(movies[0]);
        }
    }, [movies]);

    const handleSlideChange = (swiper) => {
        setActiveMovie(movies[swiper.realIndex]);
    };

    return (
        <div className="banner">
            {activeMovie && (
                <>
                    <div className="movie-banner">
                        <div className="content">
                            <h2>{activeMovie.title || activeMovie.name}</h2>
                            <p>{activeMovie.overview.slice(0, 200)}{activeMovie.overview.length > 200 && '...'}</p>
                        </div>
                    </div>
                    <MovieSwiper slides={movies} onSlideChange={handleSlideChange} />
                </>
            )}
        </div>
    );
};
