import React, { useState } from "react";

export default function EditLink({
  setShow,
  links,
  setLinks,
  focusLink,
  focusIndex,
}) {
  const [err, setErr] = useState(false);
  const [errMsg, setMsg] = useState("");
  const [name, setName] = useState(() => focusLink.type);
  const [link, setLink] = useState(() => focusLink.link);

  const setNameState = (e) => {
    setName(e.target.value.trim());
    const exists = links.find((item, index) => {
      if (focusIndex !== index) {
        return (
          item.type.toLowerCase().trim() === e.target.value.toLowerCase().trim()
        );
      }
      return false;
    });
    if (exists) {
      setErr(true);
      setMsg("Same reference already exists");
    } else {
      setErr(false);
    }
  };

  const editRefLink = () => {
    const nLinks = links.map((item, index) => {
      if (index === focusIndex) {
        item.type = name;
        item.link = link;
      }
      return item;
    });
    setLinks(nLinks);
    resetData();
    setShow(false);
  };

  const resetData = () => {
    setErr(false);
    setMsg("");
    setName(focusLink.type);
    setLink(focusLink.link);
  };
  return (
    <>
      <div className="modal">
        <div className="container addcredit">
          <div className="modalHeader">
            <h4>Edit Reference / Link</h4>
            <i
              className="ri-close-line"
              onClick={() => {
                setShow(false);
              }}
            ></i>
          </div>

          <p className="head">Type of reference</p>
          <input
            value={name}
            onChange={(e) => {
              setNameState(e);
            }}
            type="text"
            placeholder="Ex. Github, Discord, Youtube"
          />
          <p className={`modalStatus ${err ? "statusShow" : ""}`}>
            <i className="ri-error-warning-line"></i>
            {errMsg}
          </p>

          <p className="head">Link (URL)</p>
          <input
            value={link}
            onChange={(e) => {
              setLink(e.target.value.trim());
            }}
            type="text"
            placeholder="Ex. https://google.co.in"
          />

          <div className="modalBottomBar">
            <button onClick={resetData} className="reset">
              <i className="ri-restart-fill"></i>Reset
            </button>
            {!err && name !== "" && link !== "" && (
              <button onClick={editRefLink}>
                <i className="ri-save-2-line"></i>Save
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
