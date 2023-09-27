import React from "react";
import MoviesCard from "../MoviesCard/MoviesCard";
import { movies } from "../../utils/movies";
import "./MoviesCardList.css";

function MoviesCardList() {
  console.debug(movies)
  return(
    <section className="movies-card-list">
      <div className="movies-card-list__content">
        <ul className="movies-card-list__items">
          {movies.map(movie => {
            return <MoviesCard movie={movie} key={movie.title}/>
          })}
        </ul>
      </div>
      <div className="movies-card-list__more">
        <button className="movies-card-list__more-button">Ещё</button>
      </div>
    </section>
  )
}

export default MoviesCardList;
