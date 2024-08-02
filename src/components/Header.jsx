import './Header.css';
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { useState } from 'react';
import { motion } from 'framer-motion';
// import profilImg from '../PhotoLucas.jpg';
import { FaArrowRightToBracket } from "react-icons/fa6";
import { IoIosListBox } from "react-icons/io";
import { handleLogout } from '../authServices'; // Importez la fonction de déconnexion
import { RxAvatar } from "react-icons/rx";
import { BiSolidCameraMovie } from "react-icons/bi";
import { MdLiveTv } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";

const menuVariants = {
    hidden: {
        x: '100%',  // Déplacer le menu complètement hors de l'écran à droite
        opacity: 0, // Rendre le menu transparent
        transition: {
            staggerChildren: 0.1, // Délai entre chaque élément
            staggerDicrection: -1, // Direction de l'animation
        }
    },
    visible: {
        x: '0%',    // Positionner le menu à sa position finale
        opacity: 1, // Rendre le menu visible
        transition: {
            type: 'spring', // Type de transition, peut être 'tween' ou 'spring'
            stiffness: 500, // Dureté de l'animation
            damping: 30,    // Amorti de l'animation
            duration: 0.5,  // Durée de l'animation
            staggerChildren: 0.3, // Délai entre chaque élément
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },  // Initialement cachés et décalés
    visible: { opacity: 1, y: 0 }   // Visibles et à leur position finale
};


export function Header({ setMovies, setSeries, searchTerm, setSearchTerm, userConnected, profileImage }) {

    const navigate = useNavigate();

    const [menuActive, setMenuActive] = useState(false);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (searchTerm !== '') {
            navigate(`/search/?query=${searchTerm}`);
            const tmdbApiKey = process.env.REACT_APP_TMDB_API_KEY;
            const moviesUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbApiKey}&query=${searchTerm}`;
            const seriesUrl = `https://api.themoviedb.org/3/search/tv?api_key=${tmdbApiKey}&query=${searchTerm}`;

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
            path: '/top-rated',
            icon: <BiSolidCameraMovie />
        },
        {
            id: 2,
            name: 'Séries',
            path: '/series',
            icon: <MdLiveTv />
        },
        {
            id: 3,
            name: 'Se connecter',
            path: '/login',
            icon: <FaArrowRightToBracket />,
            visible: !userConnected // Ajoutez une propriété visible pour afficher ou masquer l'élément
        },
        {
            id: 4,
            name: 'S\'inscrire',
            path: '/register',
            icon: <FaUserPlus />,
            visible: !userConnected // Ajoutez une propriété visible pour afficher ou masquer l'élément
        },
        {
            id: 5,
            name: 'Watchlist',
            path: '/watchlist',
            icon: <IoIosListBox />,
            visible: userConnected // Ajoutez une propriété visible pour afficher ou masquer l'élément
        }, {
            id: 6,
            name: 'Déconnexion',
            path: '/logout',
            icon: <FaArrowRightToBracket />,
            visible: userConnected, // Ajoutez une propriété visible pour afficher ou masquer l'élément
            onClick: handleLogout // Ajoutez une propriété onClick pour gérer la déconnexion
        },
        {
            id: 7,
            name: 'Profil',
            path: '/profile',
            icon: <RxAvatar />,
            visible: userConnected // Ajoutez une propriété visible pour afficher ou masquer l'élément
        }
    ];

    return (
        <div className="main-content">
            <header>
                <div className="logo">
                    <h1><Link to="/">What to Watch</Link></h1>
                </div>
                <form className="form" onSubmit={handleSearch}>
                    <div className="input">
                        <input
                            type="search"
                            placeholder="Rechercher"
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
                <div className="right">
                    <div className={`menu ${menuActive ? 'active' : ''}`}>
                        {/* Menu Items */}
                        <motion.div
                            initial="hidden"
                            animate={menuActive ? 'visible' : 'hidden'}
                            variants={menuVariants}
                            className="menu-background"
                        >
                            <ul className='browser-menu'>
                                {menuItems.filter(item => item.visible !== false).map(item => (
                                    <motion.li variants={itemVariants} key={item.id} onClick={item.onClick ? item.onClick : handleMenuClick}>
                                        <Link to={item.path}>{item.icon}</Link>
                                        <Link to={item.path}>{item.name}</Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                        {/* Hamburger Icon */}
                        <ul className="hamburger-menu">
                            <li onClick={handleMenuClick} className="open-hamburger">
                                {menuActive ? <RxCross2 style={{ color: 'white', fontSize: '2.5em' }} /> : <RxHamburgerMenu style={{ color: 'black' }} />}
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </div>
    );
}
