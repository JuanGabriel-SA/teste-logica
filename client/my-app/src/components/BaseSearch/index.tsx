import { FaSearch } from "react-icons/fa";
import "./BaseSearch.css";
import React from "react"

type BaseSearchProps = React.InputHTMLAttributes<HTMLInputElement>

const BaseSearch = ({className = "", ...props }: BaseSearchProps) => {
  return (
    <div className={`base-search ${className}`.trim()}>
      <input className="base-search__input" {...props} />
      <span className="base-search__icon">
        <FaSearch size={15} />
      </span>
    </div>
  );
};

export default BaseSearch;
