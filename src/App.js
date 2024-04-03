import './App.css';
import { Header } from './components/Header';
import { MooviesList } from './components/MooviesList';
import Trailers from './components/Trailers';
import Series from './components/Series';
import SingleMoovies from './components/SingleMoovies';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Moovies from './components/Moovies';

function App() {

  const [movies, setMovies] = useState([]);

  return (
    <div className="App">
      <Router>
        <Header movies={movies} setMovies={setMovies} />
        <Routes>
          <Route path="/" element={<MooviesList movies={movies} setMovies={setMovies} />} />
          <Route path='/trailers' element={<Trailers movies={movies} setMovies={setMovies} />} />
          <Route path='/series' element={<Series />} />
          <Route path='/moovies' element={<Moovies />} />
          <Route path='/moovie:id' element={<SingleMoovies />} />
        </Routes>
      </Router>
    </div>
  );

}

export default App;
