import React from "react";
import {Link, NavLink} from "react-router-dom";
import Logo from "../../images/logo.svg";
import "./Header.css";

function Header({loggedIn}) {
  const [isBurgerOpen, setIsBurgerOpen] = React.useState(false);

  function handleToggleBurger() {
    setIsBurgerOpen(!isBurgerOpen);
  }
  return (
    <header className={`header`}>
      <Link to='/' className="header__logo-link"><img className="header__logo" src={Logo} alt="Логотип"/></Link>
      {
        loggedIn ?
          <nav className="header__nav">
            <NavLink to="/movies" className={({isActive}) => `header__link ${isActive ? "header__link_active" : ""}`}>Фильмы</NavLink>
            <NavLink to="/saved-movies" className={({isActive}) => `header__link ${isActive ? "header__link_active" : ""}`}>Сохранённые
              фильмы</NavLink>
          </nav> : ""
      }
      <div className="header__buttons">
        {
          loggedIn ?
            <Link to='/profile' className="header__button header__button_type_account">Аккаунт</Link> :
            <><Link to='/signup' className="header__button header__button_type_register">Регистрация</Link><Link to='/signin' className="header__button header__button_type_login">Войти</Link></>
        }
      </div>
      {
        loggedIn ?
          <><button className="header__button header__button_type_burger" onClick={handleToggleBurger}></button>
          <div className={`header__burger ${isBurgerOpen ? "header__burger_open" : ""}`}>
            <div className="header__burger-container">
              <button className="header__button header__button_type_burger-close" onClick={handleToggleBurger}></button>
              <nav className="header__nav-burger">
                <NavLink to="/" className={({isActive}) => `header__link-burger ${isActive ? "header__link-burger_active" : ""}`}>Главная</NavLink>
                <NavLink to="/movies" className={({isActive}) => `header__link-burger ${isActive ? "header__link-burger_active" : ""}`}>Фильмы</NavLink>
                <NavLink to="/saved-movies" className={({isActive}) => `header__link-burger ${isActive ? "header__link-burger_active" : ""}`}>Сохранённые
                  фильмы</NavLink>
                <Link to='/profile' className="header__button header__button_type_account">Аккаунт</Link>
              </nav>
            </div>
          </div></> : ""
      }
    </header>
  )
}

export default Header;
