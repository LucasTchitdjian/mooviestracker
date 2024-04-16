import './Header.css';
import { IoIosSearch } from "react-icons/io";
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { useState } from 'react';

export function Header({ setMovies, setSeries, searchTerm, setSearchTerm }) {

    const [menuActive, setMenuActive] = useState(false);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchTerm !== '') {
            const moviesUrl = `https://api.themoviedb.org/3/search/movie?api_key=d7e7ae694a392629f56dea0d38fd160e&query=${searchTerm}`;
            const seriesUrl = `https://api.themoviedb.org/3/search/tv?api_key=d7e7ae694a392629f56dea0d38fd160e&query=${searchTerm}`;

            Promise.all([
                fetch(moviesUrl).then(response => response.json()),
                fetch(seriesUrl).then(response => response.json())
            ]).then(([moviesData, seriesData]) => {
                // Ajout de la propriété 'type' pour chaque film
                const moviesWithTypes = moviesData.results.map(movie => ({
                    ...movie,
                    type: 'movie'
                }));
                // Ajout de la propriété 'type' pour chaque série
                const seriesWithTypes = seriesData.results.map(series => ({
                    ...series,
                    type: 'serie'
                }));
                // Combinez les résultats des films et des séries avec la propriété 'type' ajoutée
                const combinedResults = [...moviesWithTypes, ...seriesWithTypes];
                setMovies(combinedResults);
                setSeries(seriesWithTypes);
            }).catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });
        }
    };

    const handleMenuClick = () => {
       setMenuActive(!menuActive);
    }

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
                <ul className='browser-menu'>
                    <li><Link to="/top-rated">Cinéma</Link></li>
                    <li><Link to="/series">Séries</Link></li>
                    <li><Link to="/trailers">Trailers</Link></li>
                </ul>
                <ul className={`hamburger-menu ${menuActive ? 'active' : ''}`}>
                    <li onClick={handleMenuClick} className='open-hamburger'><RxHamburgerMenu /></li>
                    <li onClick={handleMenuClick} className='close-hamburger'><RxCross2 /></li>
                </ul>
            </div>
        </header>
    );
}
