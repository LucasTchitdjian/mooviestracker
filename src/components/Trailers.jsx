import React, { useEffect, useState } from 'react';
import './Trailers.css';

function Trailers({ mooviesNowPlaying, setTrailers, trailers }) {

  const [trailersData, setTrailersData] = useState(() => {
    const savedData = localStorage.getItem('trailersData');
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {
    localStorage.setItem('trailersData', JSON.stringify(trailersData));
  }, [trailersData]);

  useEffect(() => {
    const fetchTrailerData = async () => {
      if (mooviesNowPlaying.length > 0) {
        const fetchPromises = mooviesNowPlaying.map(movie => {
          return fetch(`https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=d7e7ae694a392629f56dea0d38fd160e&language=fr-FR`)
            .then(response => response.json())
            .then(data => {
              if (data && data.results && data.results.length > 0) {
                const trailer = data.results.find(t => t.type === 'Trailer' && t.official) || data.results[0];
                setTrailersData([...trailersData, trailer]);  // Set the trailers data state
                return trailer;  // Return the trailer data
              }
              return null;  // Return null if no suitable trailer is found
            });
        });

        const allResults = await Promise.all(fetchPromises);
        const validTrailers = allResults.filter(trailer => trailer !== null);  // Filter out any null results
        setTrailersData(validTrailers);  // Set the trailers data state with all fetched trailers
        setTrailers(validTrailers);  // Set the trailers state with all fetched trailers
      } else {
        setTrailers(trailersData);
      }
    };

    fetchTrailerData().catch(error => console.error('Failed to fetch trailers:', error));
  }, [mooviesNowPlaying, setTrailers, setTrailersData, trailersData]);

  if (!setTrailers || setTrailers.length === 0) {
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
