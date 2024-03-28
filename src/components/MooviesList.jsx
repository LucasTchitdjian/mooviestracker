import './MooviesList.css';

export function MooviesList() {
    return (
        <div className="moovies-list">
            <h2>Liste de tous les films </h2>
            <ul>
                <div className="card">
                    <img src="images/Dune2Poster.jpg" alt="" />
                    <li className='title'>Le Seigneur des Anneaux</li>
                    <li>De Denis Villeneuve</li>
                </div>
                <div className="card">
                    <img src="images/Dune2Poster.jpg" alt="" />
                    <li className='title'>Harry Potter</li>
                    <li>De Denis Villeneuve</li>
                </div>
                <div className="card">
                    <img src="images/Dune2Poster.jpg" alt="" />
                    <li className='title'>Les Misérables</li>
                    <li>De Denis Villeneuve</li>
                </div>
                <div className="card">
                    <img src="images/Dune2Poster.jpg" alt="" />
                    <li className='title'>Le Roi Lion</li>
                    <li>De Denis Villeneuve</li>
                </div>
            </ul>
        </div>
    )
}