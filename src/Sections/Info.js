import React from "react";
import "./Info.css";

export default function Info({ css }) {
  return (
    <div className="Info">
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
            {css.repo && (
              <a href={css.repo} target="_blank" rel="noreferrer">
                <i className="ri-git-repository-line"></i>
              </a>
            )}
            {css.site && (
              <a href={css.site} target="_blank" rel="noreferrer">
                <i className="ri-link"></i>
              </a>
            )}
          </h1>
        </div>
        <div className="description">{css.description}</div>

        {css.credits.length > 0 && (
          <div className="creditSection">
            <h2>Credits</h2>
            {css.credits.map((item) => (
              <p className="creditItem">
                {item.name}{" "}
                {item.contacts.map((contact) => (
                  <a
                    className="contactBtn"
                    target="_blank"
                    href={contact.link}
                    rel="noreferrer"
                  >
                    {contact.type}
                  </a>
                ))}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
