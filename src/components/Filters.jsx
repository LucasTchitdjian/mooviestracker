import './Filters.css';

export function Filters() {
    return (
        <div className="filters">
            <div className="filter-title">
                <span>Trier par</span>
            </div>
            <div className="filter">
                <label htmlFor="year">Année</label>
                <select name="year" id="year">
                    <option value="2021">2021</option>
                    <option value="2020">2020</option>
                    <option value="2019">2019</option>
                    <option value="2018">2018</option>
                    <option value="2017">2017</option>
                    <option value="2016">2016</option>
                    <option value="2015">2015</option>
                    <option value="2014">2014</option>
                    <option value="2013">2013</option>
                    <option value="2012">2012</option>
                    <option value="2011">2011</option>
                    <option value="2010">2010</option>
                </select>
            </div>
            <div className="filter">
                <label htmlFor="genre">Genre</label>
                <select name="genre" id="genre">
                    <option value="action">Action</option>
                    <option value="animation">Animation</option>
                    <option value="aventure">Aventure</option>
                    <option value="comedie">Comédie</option>
                    <option value="drame">Drame</option>
                    <option value="fantastique">Fantastique</option>
                    <option value="horreur">Horreur</option>
                    <option value="policier">Policier</option>
                    <option value="science-fiction">Science-fiction</option>
                    <option value="thriller">Thriller</option>
                </select>
            </div>
            <div className="filter">
                <label htmlFor="rating">Note</label>
                <select name="rating" id="rating">
                    <option value="5">5</option>
                    <option value="4">4</option>
                    <option value="3">3</option>
                    <option value="2">2</option>
                    <option value="1">1</option>
                </select>
            </div>
        </div>
    )
}