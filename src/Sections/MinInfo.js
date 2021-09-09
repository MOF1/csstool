import React from "react";
import { useHistory } from "react-router-dom";
import "./Info.css";

export default function MinInfo({ css }) {
  const history = useHistory();
  return (
    <div className="Info InfoMin" onClick={() => history.push(`/${css.name}`)}>
      <div
        className="infoHeader"
        style={{ backgroundImage: `url(${css.cover})` }}
      >
        <div className="nameLogo">
          <div className={`image ${css.logo ? "imageT" : ""}`}>
            {css.logo && <img src={css.logo} alt="" />}
          </div>
          <h1>
            {css.name} CSS{" "}
            {css.site && (
              <a href={css.site} target="_blank" rel="noreferrer">
                <i className="ri-git-repository-line"></i>
              </a>
            )}
            {css.repo && (
              <a href={css.repo} target="_blank" rel="noreferrer">
                <i className="ri-link"></i>
              </a>
            )}
          </h1>
        </div>
      </div>
    </div>
  );
}
