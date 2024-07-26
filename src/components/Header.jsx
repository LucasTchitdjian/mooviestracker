import './Header.css';
import { IoIosSearch } from "react-icons/io";
import { Link, useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { useState } from 'react';
import { motion } from 'framer-motion';
// import profilImg from '../PhotoLucas.jpg';
import { FaArrowRightToBracket, FaUser } from "react-icons/fa6";
import { IoIosListBox } from "react-icons/io";
import { handleLogout } from '../authServices'; // Importez la fonction de déconnexion
import { RxAvatar } from "react-icons/rx";

const variants = {
    open: {
        transition: {
            staggerChildren: 0.3,
            stiffness: 1000,
        },
    },
    closed: {
        transition: {
            staggerChildren: 0.1,
            staggerDirection: -1,
            damping: 3000,
        },
    },
};

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

export function Header({ setMovies, setSeries, searchTerm, setSearchTerm, userConnected, profileImage }) {

    const navigate = useNavigate();

    const [menuActive, setMenuActive] = useState(false);
    const [accountActive, setAccountActive] = useState(false);

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
        }
    ];

    const accountItems = [
        {
            id: 1,
            name: 'Se connecter',
            path: '/login',
            icon: <FaArrowRightToBracket />,
            visible: !userConnected // Ajoutez une propriété visible pour afficher ou masquer l'élément
        },
        {
            id: 2,
            name: 'S\'inscrire',
            path: '/register',
            icon: <FaArrowRightToBracket />,
            visible: !userConnected // Ajoutez une propriété visible pour afficher ou masquer l'élément
        },
        {
            id: 3,
            name: 'Watchlist',
            path: '/watchlist',
            icon: <IoIosListBox />,
            visible: userConnected // Ajoutez une propriété visible pour afficher ou masquer l'élément
        }, {
            id: 4,
            name: 'Déconnexion',
            path: '/logout',
            icon: <FaArrowRightToBracket />,
            visible: userConnected, // Ajoutez une propriété visible pour afficher ou masquer l'élément
            onClick: handleLogout // Ajoutez une propriété onClick pour gérer la déconnexion
        },
        {
            id: 5,
            name: 'Profil',
            path: '/profile',
            icon: <RxAvatar />,
            visible: userConnected // Ajoutez une propriété visible pour afficher ou masquer l'élément
        }
    ];

    return (
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
            <div className={`right ${accountActive ? 'active' : ''}`}>
                <div className="account" onClick={handleAccountClick}>
                    <FaUser />
                    {/* <p>{userConnected ? 'connecté' : 'non connecté'}</p> */}
                    <div className="columns">
                        <RxCross2 />
                        {accountItems.map((item) => {
                            // La condition pour vérifier si l'élément est visible est déplacée à l'extérieur du composant Link
                            if (!item.visible) return null;
                            return (
                                <Link
                                    to={item.path}
                                    key={item.id}  // Clé déplacée ici pour assurer une performance optimale et éviter des erreurs de rendu
                                    onClick={(e) => {
                                        // Seulement empêcher le comportement par défaut si une fonction onClick est fournie
                                        if (item.onClick) {
                                            e.preventDefault();
                                            item.onClick();
                                        }
                                        // Pas besoin de bloc 'else', laissez le comportement par défaut du lien se poursuivre
                                    }}
                                >
                                    <div className="row">
                                        {item.icon}
                                        <span>{item.name}</span> {/* Modification pour inclure le nom de l'élément dans un span pour un meilleur contrôle du style */}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className={`menu ${menuActive ? 'active' : ''}`}>
                    <ul className='browser-menu' variants={variants}>
                        {menuItems.map(item => (
                            <motion.li key={item.id} variants={itemVariants} onClick={handleMenuClick} initial="closed" animate={`${menuActive ? 'open' : 'closed'}`}>
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
