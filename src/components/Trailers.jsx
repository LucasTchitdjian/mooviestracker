import React, { useState, useEffect } from 'react';
import './Trailers.css';

function Trailers({ movies }) {
  const [trailers, setTrailers] = useState([]);

  useEffect(() => {
    const fetchTrailers = async () => {
      const trailerPromises = movies.map(movie =>
        fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR`)
          .then(response => response.json())
          .then(data => {
            // Sélectionner le premier trailer officiel trouvé
            const officialTrailer = data.results.find(video => video.type === 'Trailer' && video.official);
            // Si aucun trailer officiel n'est trouvé, prendre le premier trailer de la liste
            return officialTrailer || data.results.find(video => video.type === 'Trailer') || null;
          })
      );

      const trailersData = await Promise.all(trailerPromises);
      // Filtrer les éléments null si aucun trailer n'a été trouvé pour un film
      const filteredTrailers = trailersData.filter(trailer => trailer !== null);
      setTrailers(filteredTrailers);
    };

    if (movies.length > 0) {
      fetchTrailers();
    }
  }, [movies]); // Ajouter movies comme dépendance pour recharger les trailers quand les films changent

  return (
    <div className='trailers'>
      <h2>Liste des trailers des films à l'affiche</h2>
      <ul>
        {trailers.map((trailer, index) => (
          <div className="card">
            <li key={index}>
              {/* Exemple d'affichage d'un lien YouTube, ajustez selon vos besoins */}
              <iframe
                width="0"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe>
              <div className="title">{trailer.name}</div>
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}

export default Trailers;