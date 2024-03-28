import './Header.css';
import { IoIosSearch } from "react-icons/io";

export function Header() {
    return (
        <header>
            <div className="logo">
                <h1>Lucas moovies</h1>
            </div>
            <div className="form">
                <div className="input">
                    <input type="search" placeholder="Rechercher un film, une série" />
                </div>
                <div className="search-icon">
                    <IoIosSearch />
                </div>
            </div>
            <div className="menu">
                <ul>
                    <li>Cinéma</li>
                    <li>Séries</li>
                    <li>Trailers</li>
                </ul>
            </div>
        </header>
    );
}