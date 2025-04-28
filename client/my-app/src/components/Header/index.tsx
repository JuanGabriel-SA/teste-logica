import { FaListUl } from "react-icons/fa";
import { FaHouse } from "react-icons/fa6";
import { NavLink } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <header>
      <ul className="header__list">
        <li className="sm:text-[1rem] text-sm">
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? "header__link header__link--active" : "header__link"}
          >
            <span>
              <FaHouse />
            </span>
            Início
          </NavLink>
        </li>
        <li className="sm:text-[1rem] text-sm">
          <NavLink
            to="/usuarios"
            className={({ isActive }) => isActive ? "header__link header__link--active" : "header__link"}
          >
            <span>
              <FaListUl />
            </span>
            Listar usuários salvos
          </NavLink>
        </li>
      </ul>
    </header>
  );
};

export default Header;
