import './App.css';
import { Header } from './components/Header';
import { MooviesList } from './components/MooviesList';
import Trailers from './components/Trailers';
import Series from './components/Series';
import SingleMoovies from './components/SingleMoovies';
import { SearchResultsList } from './components/SearchResultsList';
import SingleSeries from './components/SingleSeries';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Moovies from './components/Moovies';

function App() {

  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="App">
      <Router>
        <Header movies={movies} setMovies={setMovies} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Routes>
          <Route path="/" element={<MooviesList movies={movies} setMovies={setMovies} />} />
          <Route path='/search' element={<SearchResultsList movies={movies} setMovies={setMovies} />} />
          <Route path='/trailers' element={<Trailers movies={movies} setMovies={setMovies} />} />
          <Route path='/series' element={<Series series={series} setSeries={setSeries} />} />
          <Route path='/serie/:id' element={<SingleSeries series={series} setSeries={setSeries} />} />
          <Route path='/moovies' element={<Moovies />} />
          <Route path='/movie/:id' element={<SingleMoovies movies={movies} />} />
        </Routes>
      </Router>
    </div>
  );

}

export default App;