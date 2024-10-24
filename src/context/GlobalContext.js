import { createContext, useState, useEffect } from "react";
import { auth, db } from '../firebase-config';
import { getDocs, collection } from 'firebase/firestore';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [moviesAddedToWatchlist, setMoviesAddedToWatchlist] = useState([]);
    const [seriesAddedToWatchlist, setSeriesAddedToWatchlist] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchWatchlist = async () => {
            if (auth.currentUser) {
                const watchlistRef = collection(db, 'users', auth.currentUser.uid, 'watchlist');
                const snapshot = await getDocs(watchlistRef);
                const moviesWatchlist = snapshot.docs
                    .filter(doc => doc.data().type === 'movie')
                    .map(doc => doc.data().id.toString());
                const seriesWatchlist = snapshot.docs
                    .filter(doc => doc.data().type === 'tv')
                    .map(doc => doc.data().id.toString());

                setMoviesAddedToWatchlist(moviesWatchlist);
                setSeriesAddedToWatchlist(seriesWatchlist);
            }
        };

        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user);
                fetchWatchlist();
            } else {
                setUser(null);
                setMoviesAddedToWatchlist([]);
                setSeriesAddedToWatchlist([]);
            }
        });
    }, []);

    return (
        <GlobalContext.Provider value={{
            user,
            moviesAddedToWatchlist,
            setMoviesAddedToWatchlist,
            seriesAddedToWatchlist,
            setSeriesAddedToWatchlist
        }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const MoviesContext = createContext();

export const MoviesProvider = ({ children }) => {
    const [movies, setMovies] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [yearFilter, setYearFilter] = useState('2024');
    const [genreFilter, setGenreFilter] = useState('28');


    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
                const response = await fetch(
                    `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&region=FR&language=fr-FR&sort_by=vote_count.desc&primary_release_date.desc&primary_release_date.gte=${yearFilter}-01-01&primary_release_date.lte=${yearFilter}-12-31&with_genres=${genreFilter}&page=${currentPage}`
                );                               
                const data = await response.json();
                setTotalPages(data.total_pages);
                setMovies(data.results);
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };

        if (movies.length === 0) {
            fetchMovies();
        }
    }, [currentPage, yearFilter, genreFilter, movies.length]);

    return (
        <MoviesContext.Provider value={{
            movies,
            setMovies,
            totalPages,
            setTotalPages,
            currentPage,
            setCurrentPage,
            yearFilter,
            setYearFilter,
            genreFilter,
            setGenreFilter,
        }}>
            {children}
        </MoviesContext.Provider>
    );
};

export const TrendingMoviesContext = createContext();

export const TrendingMoviesProvider = ({ children }) => {
    const [trendingMovies, setTrendingMovies] = useState([]);

    useEffect(() => {
        const fetchTrendingMovies = async () => {
            try {
                const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
                const response = await fetch(
                    `https://api.themoviedb.org/3/trending/movie/day?api_key=${tmdbApiKey}&region=FR&language=fr-FR`
                );
                const data = await response.json();
                setTrendingMovies(data.results);
            }
            catch (error) {
                console.error("Error fetching trending movies:", error);
            }
        }

        if (trendingMovies.length === 0) {
            fetchTrendingMovies();  
        }  
    }, [trendingMovies.length]);

    return (
        <TrendingMoviesContext.Provider value={{
            trendingMovies,
            setTrendingMovies
        }}>
            {children}
        </TrendingMoviesContext.Provider>
    );
}