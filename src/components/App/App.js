import React, { useCallback, useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import beatApi from "../../utils/MoviesApi";
import mainApi from "../../utils/MainApi";
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import Main from "../Main/Main";
import Movies from "../Movies/Movies";
import SavedMovies from "../SavedMovies/SavedMovies";
import Profile from "../Profile/Profile";
import Login from "../Login/Login";
import Register from "../Register/Register";
import PageNotFound from "../PageNotFound/PageNotFound";
import "./App.css";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import { SHORT_MOVIES_DURATION } from "../../utils/constants";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [ allMovies, setAllMovies ] = useState([]);
  const [ loggedIn, setLoggedIn ] = useState(false);
  const [ currentUser, setCurrentUser ] = useState({});
  const [ isLoading, setIsLoading ] = useState(false);
  const [ savedMovies, setSavedMovies ] = useState([]);
  const [ findMovies, setFindMovies ] = useState([]);
  const [ findSavedMovies, setFindSavedMovies ] = useState([]);
  const [ searchComplete, setSearchComplete ] = useState(true);
  const [ informationPopup, setInformationPopup ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    if (!searchComplete) {
      handleGetAllMovies();
    }
  }, [ searchComplete ])

  useEffect(() => {
    if (allMovies.length > 0 && localStorage.getItem('searchValue')) {
      filterMovies(allMovies, setFindMovies);
      setIsLoading(false);
    }
  }, [ allMovies ])

  function handleGetAllMovies() {
    if (localStorage.getItem('allMovies') !== null) {
      setAllMovies(JSON.parse(localStorage.getItem('allMovies')));
    } else {
      beatApi.getAllMovies()
        .then((movies) => {
          setAllMovies(movies);
          return movies;
        })
        .then((movies) => {
          const allMovies = JSON.stringify(movies);
          localStorage.setItem('allMovies', allMovies);
        })
        .catch((err) => {
          console.log(err);
          setInformationPopup(true);
          setErrorMessage('Во время запроса произошла ошибка. Возможно, проблема с соединением или сервер недоступен. Подождите немного и попробуйте ещё раз');
          setIsLoading(false);
        })
    }
  }

  function handleSaveMovie(movie) {
    mainApi.saveMovie(movie)
      .then((res) => {
        setSavedMovies([ ...savedMovies, res.data ]);
      })
      .catch((err) => {
        const errMessage = JSON.parse(err.message)
        console.log(errMessage)
        setInformationPopup(true);
        setErrorMessage(errMessage.message);
        setIsLoading(false);
      })
  }

  function handleDeleteMovie(id) {
    mainApi.removeMovie(id)
      .then(() => {
        setSavedMovies(prev => prev.filter(movie => movie._id !== id))
      })
      .catch((err) => {
        const errMessage = JSON.parse(err.message)
        console.log(errMessage)
        setInformationPopup(true);
        setErrorMessage(errMessage.message);
        setIsLoading(false);
      })
  }

  function filterMovies(movies, setState) {
    setSearchComplete(false);
    const searchValue = localStorage.getItem('searchValue').toLowerCase();
    const shortMovies = localStorage.getItem('shortMovies');
    shortMovies === "true" ?
      setState(movies.filter((movie) => {
        return movie.nameRU.toLowerCase().includes(searchValue) && movie.duration <= SHORT_MOVIES_DURATION;
      })) :
      setState(movies.filter((movie) => {
        return movie.nameRU.toLowerCase().includes(searchValue) && movie.duration > SHORT_MOVIES_DURATION;
      }));
    setSearchComplete(true);
  }

  function filterMoviesByDuration(movies, setState, searchValue, shortMovies) {
    setSearchComplete(false);
    shortMovies === true ?
      setState(movies.filter((movie) => {
        return searchValue !== '' ? movie.nameRU.toLowerCase().includes(searchValue) && movie.duration <= 40 : movie.duration <= 40;
      })) :
      setState(movies.filter((movie) => {
        return searchValue !== '' ? movie.nameRU.toLowerCase().includes(searchValue) && movie.duration > 40 : movie.duration > 40;
      }));
    setIsLoading(false)
    setSearchComplete(true);
  }

  function handleGetSavedMovies() {
    mainApi.getSavedMovies()
      .then((res) => {
        setSavedMovies(res.data);
      })
      .catch((err) => {
        const errMessage = JSON.parse(err.message)
        setInformationPopup(true);
        setErrorMessage(errMessage.message);
        setIsLoading(false);
      })
  }

  function handleLoginUser(email, password) {
    mainApi.login(email, password)
      .then((data) => {
        if (data.token) {
          setLoggedIn(true);
          navigate('/movies');
        }
      })
      .then(() => {
        handleGetUser();
      })
      .then(() => {
        handleGetSavedMovies();
      })
      .catch((err) => {
        const errMessage = JSON.parse(err.message)
        if (errMessage.statusCode === 400) {
          setErrorMessage(errMessage.validation.body.message);
        } else {
          setErrorMessage(errMessage.message);
        }
        setInformationPopup(true);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  function handleRegisterUser(email, password, name) {
    mainApi.register(email, password, name)
      .then(() => {
        handleLoginUser(email, password)
      })
      .catch((err) => {
        const errMessage = JSON.parse(err.message)
        if (errMessage.statusCode === 400) {
          setErrorMessage(errMessage.validation.body.message);
        } else {
          setErrorMessage(errMessage.message);
        }
        setInformationPopup(true);
      })
      .finally(() => {
        setIsLoading(false);
      })
  }

  const handleGetUser = useCallback(() => {
    mainApi.getUser()
      .then((res) => {
        const { name, email } = res.data;
        setCurrentUser({ name, email });
        setLoggedIn(true);
        (location.pathname === '/signup' || location.pathname === '/signin') ? navigate('/movies') : navigate(location.pathname);
      })
      .catch((err) => {
        console.log(err);
      })
  }, [location.pathname, navigate])

  function handleLogOut() {
    localStorage.removeItem('jwt');
    localStorage.removeItem('allMovies');
    localStorage.removeItem('shortMovies');
    localStorage.removeItem('searchValue');
    setLoggedIn(false);
    setCurrentUser({});
    setAllMovies([]);
    setSavedMovies([]);
    setFindMovies([]);
    setFindSavedMovies([]);
  }

  function handleUpdateUser(name, email) {
    mainApi.updateUser(name, email)
      .then((res) => {
        setCurrentUser(res);
        setInformationPopup(true);
        setErrorMessage('Данные были успешно изменены');
        setIsLoading(false);
      })
      .catch((err) => {
        const errMessage = JSON.parse(err.message)
        setInformationPopup(true);
        setErrorMessage(errMessage.message);
        setIsLoading(false);
      })
  }

  useEffect(() => {
    if (localStorage.getItem('jwt') !== null) {
      handleGetUser();
      handleGetSavedMovies();
    }
    if (localStorage.getItem('allMovies') !== null) {
      setAllMovies(JSON.parse(localStorage.getItem('allMovies')));
    }
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="app">
        <Routes>
          <Route path="/" element={<Main loggedIn={loggedIn}/>}/>
          <Route path="/movies" element={
            <ProtectedRoute
              loggedIn={loggedIn}
              searchMovies={filterMovies}
              component={Movies}
              allMovies={allMovies}
              isLoading={isLoading}
              findMovies={findMovies}
              handleSaveMovie={handleSaveMovie}
              savedMovies={savedMovies}
              deleteMovie={handleDeleteMovie}
              setIsLoading={setIsLoading}
              setSearchComplete={setSearchComplete}
              setFindMovies={setFindMovies}
              informationPopup={informationPopup}
              errorMessage={errorMessage}
              setInformationPopup={setInformationPopup}
              setErrorMessage={setErrorMessage}
            />
          }/>
          <Route path="/saved-movies" element={
            <ProtectedRoute
              loggedIn={loggedIn}
              component={SavedMovies}
              searchMovies={filterMovies}
              savedMovies={savedMovies}
              findSavedMovies={findSavedMovies}
              setFindSavedMovies={setFindSavedMovies}
              findMovies={findMovies}
              deleteMovie={handleDeleteMovie}
              setIsLoading={setIsLoading}
              setSearchComplete={setSearchComplete}
              isLoading={isLoading}
              filterMoviesByDuration={filterMoviesByDuration}
            />
          }/>
          <Route path="/profile" element={
            <ProtectedRoute
              loggedIn={loggedIn}
              component={Profile}
              logOut={handleLogOut}
              handleUpdateUser={handleUpdateUser}
              informationPopup={informationPopup}
              errorMessage={errorMessage}
              setInformationPopup={setInformationPopup}
              setErrorMessage={setErrorMessage}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          }/>
          <Route path="/signin" element={
            <Login
              onLogin={handleLoginUser}
              informationPopup={informationPopup}
              errorMessage={errorMessage}
              setInformationPopup={setInformationPopup}
              setErrorMessage={setErrorMessage}
              setIsLoading={setIsLoading}
            />
          }/>
          <Route path="/signup" element={
            <Register
              onRegister={handleRegisterUser}
              informationPopup={informationPopup}
              errorMessage={errorMessage}
              setInformationPopup={setInformationPopup}
              setErrorMessage={setErrorMessage}
              setIsLoading={setIsLoading}
            />
          }/>
          <Route path="*" element={<PageNotFound/>}/>
        </Routes>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
