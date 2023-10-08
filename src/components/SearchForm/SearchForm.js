import React, { useEffect } from "react";
import { useState } from "react";
import "./SearchForm.css";

function SearchForm(props) {
  const [checked, setChecked] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [error, setError] = useState('');

  function handleInputChange(e) {
    const input = e.target;
    setSearchValue(input.value);
    setError('');
  }

  useEffect(() => {
    if (!props.isSavedMovies) {
      if (localStorage.getItem('shortMovies')) {
        localStorage.getItem('shortMovies') === "true" ?
          setChecked(true) :
          setChecked(false);
      } else {
        localStorage.setItem('shortMovies', checked.toString());
      }
    }
    if (localStorage.getItem('searchValue')) {
      if (!props.isSavedMovies) {
        setSearchValue(localStorage.getItem('searchValue'))
        props.searchMovies(props.allMovies, props.setFindMovies)
      } else {
        setSearchValue('')
      }
    }
  }, [])

  useEffect(() => {
    if (props.isSavedMovies) {
      if (searchValue === '') {
        props.setFindSavedMovies(props.allMovies)
      } else {
        props.filterMoviesByDuration(props.allMovies, props.setFindSavedMovies, searchValue, checked);
      }
    }
  }, [props.allMovies])

  useEffect(() => {
    if (!props.isSavedMovies) {
      localStorage.setItem('shortMovies', checked.toString());
    }
    setError('')
  }, [checked])

  useEffect(() => {
    if (localStorage.getItem('searchValue')) {
      if (!props.isSavedMovies) {
        setSearchValue(localStorage.getItem('searchValue'))
        props.searchMovies(props.allMovies, props.setFindMovies)
      }
    }
    if (props.isSavedMovies && searchValue !== '') {
      props.filterMoviesByDuration(props.allMovies, props.setFindSavedMovies, searchValue, checked);
    }
  }, [checked])

  useEffect(() => {
    if (searchValue === '' && props.isSavedMovies) {
      props.setFindSavedMovies(props.allMovies)
    }
  }, [searchValue])

  function search(evt) {
    evt.preventDefault();
    if (searchValue === '') {
      setError('Нужно ввести ключевое слово');
      return;
    }
    props.setIsLoading(true);
    props.setSearchComplete(false);
    if (props.isSavedMovies) {
      props.filterMoviesByDuration(props.allMovies, props.setFindSavedMovies, searchValue, checked);
    } else {
      localStorage.setItem('searchValue', searchValue);
    }
  }

  return (
    <section className="search-form">
      <form action="" className="search-form__form" onSubmit={search}>
        <div className="search-form__search">
          <input type="text" className="search-form__input search-form__input_search" placeholder="Фильм"
                 onChange={handleInputChange} value={searchValue || ''} disabled={props.isLoading}/>
          <span className="search-form__error">{ error }</span>
          <button className="search-form__submit" type="submit" onClick={search} disabled={props.isLoading}></button>
        </div>
        <div className="search-form__short-movies">
          <input type="checkbox"
                 id="search-form__checkbox"
                 className="search-form__checkbox"
                 name="short-movies"
                 checked={checked}
                 onChange={() => setChecked(!checked)}
                 required={true}/>
          <label htmlFor="search-form__checkbox" className="search-form__checkbox-label"></label>
          <p className="search-form__checkbox-description">Короткометражки</p>
        </div>
      </form>
    </section>
  )
}

export default SearchForm;
