import './Header.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { RxHamburgerMenu } from "react-icons/rx";
import { RxCross2 } from "react-icons/rx";
import { motion } from 'framer-motion';
import { FaArrowRightToBracket } from "react-icons/fa6";
import { IoIosListBox } from "react-icons/io";
import { handleLogout } from '../authServices';
import { RxAvatar } from "react-icons/rx";
import { BiSolidCameraMovie } from "react-icons/bi";
import { MdLiveTv } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";

const menuVariants = {
    hidden: {
        x: '100%',
        opacity: 0,
        transition: {
            staggerChildren: 0.1,
            staggerDicrection: -1,
        }
    },
    visible: {
        x: '0%',
        opacity: 1,
        transition: {
            type: 'spring',
            stiffness: 500,
            damping: 30,
            duration: 0.5,
            staggerChildren: 0.3,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export function Header({ userConnected }) {

    const [menuActive, setMenuActive] = useState(false);

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
            visible: !userConnected
        },
        {
            id: 4,
            name: 'S\'inscrire',
            path: '/register',
            icon: <FaUserPlus />,
            visible: !userConnected
        },
        {
            id: 5,
            name: 'Watchlist',
            path: '/watchlist',
            icon: <IoIosListBox />,
            visible: userConnected
        }, {
            id: 6,
            name: 'Déconnexion',
            path: '/logout',
            icon: <FaArrowRightToBracket />,
            visible: userConnected,
            onClick: handleLogout
        },
        {
            id: 7,
            name: 'Profil',
            path: '/profile',
            icon: <RxAvatar />,
            visible: userConnected
        }
    ];

    const handleMenuClick = () => {
        setMenuActive(!menuActive);
    };

    return (
        <div className="main-content">
            <header>
                <div className="logo">
                    <h1><Link to="/">What to Watch</Link></h1>
                </div>
                <div className="search">
                    <Link to="/search">
                    <div className="icon"><FaSearch /></div>
                    <p>Rechercher un film ou une série</p>
                    </Link>
                </div>
                <div className="right">
                    <div className={`menu ${menuActive ? 'active' : ''}`}>
                        <motion.div
                            initial="hidden"
                            animate={menuActive ? 'visible' : 'hidden'}
                            variants={menuVariants}
                            className="menu-background"
                            data-testid="menu-background"
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
                        <ul className="hamburger-menu">
                            <li onClick={handleMenuClick} className="open-hamburger">
                                {menuActive ? <RxCross2 data-testid="hamburger-close-icon" style={{ color: 'white' }} /> : <RxHamburgerMenu data-testid="hamburger-open-icon" style={{ color: 'black' }} />}
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        </div>
    );
}
