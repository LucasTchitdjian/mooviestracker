import React, { useState, useEffect } from 'react';
import './Header.css';
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';

export function Header({ setMovies }) {

    console.log(setMovies, "setMoovies header");

    const [search, setSearch] = useState('');

    useEffect(() => {
        // Vérifie si la recherche n'est pas vide
        if (search) {
            fetch(`http://www.omdbapi.com/?s=${encodeURIComponent(search)}&apikey=f50d238e`)
                .then(response => response.json())
                .then(data => {
                    if (data.Response === "True") {
                        setMovies(data.Search);
                    }
                });
        }
    }, [search, setMovies]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleSearch = (e) => {
        e.preventDefault();
    };

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
                        value={search}
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
