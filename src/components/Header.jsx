import './Header.css';
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { useState } from 'react';
import { motion } from 'framer-motion';
import reactLogo from '../logo192.png';
import { FaArrowRightToBracket } from "react-icons/fa6";
import { IoIosListBox } from "react-icons/io";
import { handleLogout } from '../authServices'; // Importez la fonction de déconnexion


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

export function Header({ setMovies, setSeries, searchTerm, setSearchTerm, userConnected }) {

    const navigate = useNavigate();

    const [menuActive, setMenuActive] = useState(false);
    const [accountActive, setAccountActive] = useState(false);

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
        if (!accountActive) {
            setMenuActive(!menuActive);
        }
    }

    const handleAccountClick = () => {
        setAccountActive(!accountActive);
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
    ];

    const accountItems = [
        {
            id: 1,
            name: 'Se connecter',
            path: '/login',
            icon: <FaArrowRightToBracket />
        },
        {
            id: 2,
            name: 'S\'inscrire',
            path: '/register',
            icon: <FaArrowRightToBracket />
        },
        {
            id: 3,
            name: 'Watchlist',
            path: '/watchlist',
            icon: <IoIosListBox />
        }, {
            id: 4,
            name: 'Déconnexion',
            path: '/logout',
            icon: <FaArrowRightToBracket />,
            onClick: handleLogout // Ajoutez une propriété onClick pour gérer la déconnexion
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
            {/* <div className="watchlist">
                <Link to="/watchlist">Watchlist</Link>
            </div> */}
            <div className={`right ${accountActive ? 'active' : ''}`}>
                <div className="account" onClick={handleAccountClick}>
                    <img src={reactLogo} alt="" />
                    <p>{userConnected}</p>
                    <div className="columns">
                        {accountItems.map(item => {
                            return (
                                <div className="row" key={item.id}>
                                    {item.icon}
                                    <Link to={item.path} onClick={(e) => {
                                        // Only prevent default if there is an onClick function to handle
                                        if (item.onClick) {
                                            e.preventDefault();
                                            item.onClick(); // This is where handleLogout gets called
                                        }
                                        // No else block needed, let the default link behavior proceed
                                    }}>
                                        {item.name}
                                    </Link>
                                </div>
                            );
                        })}
                    </div>

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
            </div>
        </header>
    );
}
