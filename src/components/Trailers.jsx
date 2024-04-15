import React, { useEffect, useState } from 'react';
import './Trailers.css';

function Trailers({ mooviesNowPlaying, setTrailers, trailers }) {
  const [trailersCache, setTrailersCache] = useState({});

  useEffect(() => {
    const fetchTrailerData = async () => {
      if (mooviesNowPlaying.length > 0) {
        const fetchPromises = mooviesNowPlaying.map(movie => {
          if (trailersCache[movie.id]) {  // Use cached trailer if available
            return Promise.resolve({ movieId: movie.id, trailer: trailersCache[movie.id] });
          } else {
            return fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR`)
              .then(response => response.json())
              .then(data => {
                if (data && data.results && data.results.length > 0) {
                  const trailer = data.results.find(t => t.type === 'Trailer' && t.official) || data.results[0];
                  return { movieId: movie.id, trailer };
                }
                return { movieId: movie.id, trailer: null };
              });
          }
        });

        const allResults = await Promise.all(fetchPromises);
        const newTrailers = {};
        const validTrailers = allResults.filter(result => result.trailer !== null).map(result => {
          newTrailers[result.movieId] = result.trailer;  // Save to new trailers if fetched
          return result.trailer;
        });

        setTrailersCache(prev => ({ ...prev, ...newTrailers })); // Update the cache with new trailers
        setTrailers(validTrailers);
      }
    };

    fetchTrailerData().catch(error => console.error('Failed to fetch trailers:', error));
    console.log("Trailers Cache:", trailersCache); // Afficher le cache des trailers
    console.log("Current Trailers State:", trailers);
  }, [mooviesNowPlaying, trailersCache, setTrailers, trailers]);

  if (!trailers || trailers.length === 0) {
    return <div className="trailers"><h2>No trailers available</h2></div>;
  }

  return (
    <div className='trailers'>
      <h2>Liste des trailers des films à l'affiche</h2>
      <ul>
        {trailers.map((trailer, index) => (
          <li key={index} className="card">
            <iframe
              width="560"
              height="315"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen>
            </iframe>
            <div className="title">{trailer.name}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Trailers;