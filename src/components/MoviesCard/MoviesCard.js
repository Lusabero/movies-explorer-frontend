import React from "react";
import SavedIcon from "../../images/saved-icon.svg";
import DeleteButton from "../../images/delete-icon.svg";
import "./MoviesCard.css";

function MoviesCard(props) {
  const handleToggle = (e) => {
    e.preventDefault();
    e.target.closest('.movies-card').classList.toggle("movies-card_saved");
  };
  const handleDelete = (e) => {
    e.preventDefault();
    e.target.closest('.movies-card').remove();
  };
  return (
    <li className="movies-card">
      <a href={props.movie.link} className="movies-card__link" target="_blank" rel="noreferrer">
        <img src={props.movie.poster} alt={props.movie.title} className="movies-card__thumbnail"/>
      </a>
      <div className="movies-card__description">
        <p className="movies-card__name">{props.movie.title}</p>
        <p className="movies-card__duration">{props.movie.duration}</p>
      </div>
      <button className="movies-card__save-button" onClick={handleToggle}>Сохранить</button>
      <img src={SavedIcon} alt="иконка сохраненного фильма" className="movies-card__saved-icon"/>
      <button className="movies-card__delete-button" onClick={handleDelete}><img src={DeleteButton} alt="кнопка удаления фильма"/></button>
    </li>
  )
}

export default MoviesCard;
