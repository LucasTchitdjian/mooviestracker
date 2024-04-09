import React, { useEffect } from 'react';
import './Header.css';
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';

export function Header({ setMovies, searchTerm, setSearchTerm }) {

    useEffect(() => {
        // Vérifie si la recherche n'est pas vide
        if (searchTerm !== '') {
            const moviesUrl = `https://api.themoviedb.org/3/search/movie?api_key=d7e7ae694a392629f56dea0d38fd160e&query=${searchTerm}`;
            const seriesUrl = `https://api.themoviedb.org/3/search/tv?api_key=d7e7ae694a392629f56dea0d38fd160e&query=${searchTerm}`;
    
            Promise.all([
                fetch(moviesUrl).then(response => response.json()),
                fetch(seriesUrl).then(response => response.json())
            ]).then(([moviesData, seriesData]) => {
                // Combinez les résultats des films et des séries
                const combinedResults = [...moviesData.results, ...seriesData.results];
                setMovies(combinedResults);
            }).catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
        }
    }, [searchTerm, setMovies]);    

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

    console.log(searchTerm, "ce que j'ai ecris dans l'input de recherche");

    return (
        <header>
            <div className="logo">
                <h1><Link to="/">Lucas Movies</Link></h1>
            </div>
            <form className="form" onSubmit={handleSearch}>
                <div className="input">
                    <input
                        type="search"
                        placeholder="Rechercher un film, une série"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
                <button type="submit" className="search-icon">
                    <IoIosSearch />
                </button>
            </form>
            <div className="menu">
                <ul>
                    <li><Link to="/moovies">Cinéma</Link></li>
                    <li><Link to="/series">Séries</Link></li>
                    <li><Link to="/trailers">Trailers</Link></li>
                </ul>
            </div>
        </header>
    );
}
