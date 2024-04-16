import './App.css';
import { Header } from './components/Header';
import { MooviesList } from './components/MooviesList';
import Trailers from './components/Trailers';
import Series from './components/Series';
import SingleMoovies from './components/SingleMoovies';
import { Pagination } from './components/Pagination';
import { SearchResultsList } from './components/SearchResultsList';
import SingleSeries from './components/SingleSeries';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Moovies from './components/Moovies';

function App() {

  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [mooviesNowPlaying, setMooviesNowPlaying] = useState([]);

  return (
    <div className="App">
      <Router>
        <Header setMovies={setMovies} setSeries={setSeries} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Routes>
          <Route path="/" element={<Navigate to="/now-playing" />} /> {/* Redirect to /now-playing */}
          <Route path="/now-playing" element={
            <>
              <MooviesList page={page} currentPage={currentPage} setPage={setPage} movies={movies} setMovies={setMovies} series={series} setSeries={setSeries} setMooviesNowPlaying={setMooviesNowPlaying} />
              <Pagination context="now-playing" page={currentPage} totalPages={totalPages} setTotalPages={setTotalPages} setCurrentPage={setCurrentPage} />
            </>
          } />
          <Route path='/search' element={<SearchResultsList movies={movies} setMovies={setMovies} />} />
          <Route path='/trailers' element={<Trailers mooviesNowPlaying={mooviesNowPlaying} setTrailers={setTrailers} trailers={trailers} />} />
          <Route path='/series' element={<Navigate to="/top-rated-series" />} /> {/* Redirect to '/series' */}
          <Route path='/top-rated-series' element={
            <>
              <Series series={series} setSeries={setSeries} setPage={setPage} currentPage={currentPage} />
              <Pagination context="top-rated-series" page={currentPage} totalPages={totalPages} setTotalPages={setTotalPages} setCurrentPage={setCurrentPage} />
            </>
          } />
          <Route path='/serie/:id' element={<SingleSeries movies={movies} series={series} setSeries={setSeries} />} />
          <Route path="/top-rated" element={
            <>
              <Moovies movies={movies} setMovies={setMovies} currentPage={currentPage} setPage={setPage} />
              <Pagination context="top-rated" page={currentPage} totalPages={totalPages} setTotalPages={setTotalPages} setCurrentPage={setCurrentPage} />
            </>
          } />
          <Route path='/movie/:id' element={<SingleMoovies movies={movies} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
