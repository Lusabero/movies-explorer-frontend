import React from "react";
import { useState } from "react";
import "./SearchForm.css";

function SearchForm() {
  const [ checked, setChecked ] = useState(false);

  return (
    <section className="search-form">
      <form action="" className="search-form__form">
        <input type="text" className="search-form__input search-form__input_search" placeholder="Фильм"/>
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
        <button className="search-form__submit"></button>
      </form>
    </section>
  )
}

export default SearchForm;
