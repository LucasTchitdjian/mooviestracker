import './App.css';
import { Header } from './components/Header';
import { MooviesList } from './components/MooviesList';
import { Series } from './components/Series';
import SingleMoovies from './components/SingleMoovies';
import { Pagination } from './components/Pagination';
import { SearchResultsList } from './components/SearchResultsList';
import SingleSeries from './components/SingleSeries';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Moovies from './components/Moovies';
import Footer from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { WatchlistPage } from './components/WatchlistPage';
import { LogoutPage } from './components/LogoutPage';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase-config';
import { ProfilePage } from './components/ProfilePage';
import DefaultAvatarImg from './DefaultAvatarImgRemoved.png';
import { GlobalProvider, TrendingMoviesProvider } from './context/GlobalContext';
import { MoviesProvider } from './context/GlobalContext';
import { Filters } from './components/Filters';
import { Banner } from './components/Banner';
import 'swiper/css';

function App() {

  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [mooviesNowPlaying, setMooviesNowPlaying] = useState([]);
  const [userConnected, setUserConnected] = useState(false);
  const [profileImage, setProfileImage] = useState(DefaultAvatarImg);
  const [yearFilter, setYearFilter] = useState('2024');
  const [genreFilter, setGenreFilter] = useState('28');

  useEffect(() => {
    const userConnectedFromStorage = localStorage.getItem('userConnected');
    if (userConnectedFromStorage) {
      setUserConnected(JSON.parse(userConnectedFromStorage));
    }

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserConnected(true);
        localStorage.setItem('userConnected', JSON.stringify(true));
      } else {
        setUserConnected(false);
        localStorage.setItem('userConnected', JSON.stringify(false));
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('userConnected', JSON.stringify(userConnected));
  }, [userConnected]);

  return (
    <div className="App">
      <GlobalProvider>
        <MoviesProvider>
          <Router>
            <Header userConnected={userConnected} setMovies={setMovies} setSeries={setSeries} searchTerm={searchTerm} setSearchTerm={setSearchTerm} profileImage={profileImage} />
            <Routes>
              <Route path="/" element={<Navigate to="/now-playing" />} />
              <Route path="/now-playing" element={
                <>
                  <TrendingMoviesProvider>
                  <Banner />
                  </TrendingMoviesProvider>
                  <Filters yearFilter={yearFilter} setGenreFilter={setGenreFilter} setYearFilter={setYearFilter} />
                  <MooviesList genreFilter={genreFilter} yearFilter={yearFilter} mooviesNowPlaying={mooviesNowPlaying} setTotalPages={setTotalPages} page={page} currentPage={currentPage} setPage={setPage} movies={movies} setMovies={setMovies} series={series} setSeries={setSeries} setMooviesNowPlaying={setMooviesNowPlaying} />
                  <Pagination context="now-playing" page={currentPage} totalPages={totalPages} setTotalPages={setTotalPages} setCurrentPage={setCurrentPage} />
                </>
              } />
              <Route path='/search' element={
                <>
                  <SearchResultsList movies={movies} setMovies={setMovies} setTotalPages={setTotalPages} page={page} currentPage={currentPage} setPage={setPage} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                </>
              } />
              <Route path='/search/movie/:id' element={<SingleMoovies movies={movies} />} />
              <Route path='/search/tv/:id' element={<SingleSeries movies={movies} series={series} setSeries={setSeries} />} />
              <Route path='/series' element={<Navigate to="/top-rated-series" />} />
              <Route path='/top-rated-series' element={
                <>
                  <Series series={series} setSeries={setSeries} setTotalPages={setTotalPages} currentPage={currentPage} />
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
              <Route path='/now-playing/movie/:id' element={<SingleMoovies movies={movies} />} />
              <Route path='/top-rated-series/movie/:id' element={<SingleSeries movies={movies} series={series} setSeries={setSeries} />} />
              <Route path='/top-rated/movie/:id' element={<SingleMoovies movies={movies} />} />
              <Route path='/login' element={<LoginPage setUserConnected={setUserConnected} />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/watchlist" element={<WatchlistPage />} />
              <Route path='/logout' element={<LogoutPage setUserConnected={setUserConnected} />} />
              <Route path='/profile' element={<ProfilePage profileImage={profileImage} setProfileImage={setProfileImage} />} />
            </Routes>
          </Router>
        </MoviesProvider>
      </GlobalProvider>
      <Footer />
    </div>
  );
}

export default App;
