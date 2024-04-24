import './Header.css';
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { useState } from 'react';
import { motion } from 'framer-motion';

// const variants = {
//     open: {
//         transition: {
//             staggerChildren: 0.3,
//             stiffness: 1000,
//         },
//     },
//     closed: {
//         transition: {
//             staggerChildren: 0.1,
//             staggerDirection: -1,
//             damping: 3000,
//         },
//     },
// };

const itemVariants = {
    open: {
        y: 0,
        opacity: 1,
    },
    closed: {
        y: 50,
        opacity: 0,
    },
};

export function Header({ setMovies, setSeries, searchTerm, setSearchTerm }) {

    const navigate = useNavigate();

    const [menuActive, setMenuActive] = useState(false);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchTerm !== '') {
            navigate('/search');
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

    const menuItems = [
        {
            id: 1,
            name: 'Cinéma',
            path: '/top-rated'
        },
        {
            id: 2,
            name: 'Séries',
            path: '/series'
        },
        {
            id: 3,
            name: 'Trailers',
            path: '/trailers'
        },
        {
            id: 4,
            name: 'Connexion',
            path: '/login'
        },
        {
            id: 5,
            name: 'Inscription',
            path: '/register'
        }
    ];

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
            <div className="watchlist">
                <Link to="/watchlist">Watchlist</Link>
            </div>
            <div className={`menu ${menuActive ? 'active' : ''}`}>
                <ul className='browser-menu'>
                    {menuItems.map(item => (
                        <motion.li key={item.id} variants={itemVariants} onClick={handleMenuClick}>
                            <Link to={item.path}>{item.name}</Link>
                        </motion.li>
                    ))}
                </ul>
                <ul className={`hamburger-menu ${menuActive ? 'active' : ''}`}>
                    <li onClick={handleMenuClick} className='open-hamburger'><RxHamburgerMenu /></li>
                    <li onClick={handleMenuClick} className='close-hamburger'><RxCross2 /></li>
                </ul>
            </div>
        </header>
    );
}
