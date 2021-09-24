import React, { useState } from "react";
import "./AddCredit.css";
import AddLink from "./AddLink";
import EditLink from "./EditLink";

export default function EditCredit({
  setShow,
  credits,
  setCredits,
  focusCreditIndex,
  focusCredit,
}) {
  const [err, setErr] = useState(false);
  const [errMsg, setMsg] = useState("");
  const [name, setName] = useState(() => focusCredit.name);
  const [links, setLinks] = useState(() => focusCredit.contacts);
  const [focusIndex, setFocusIndex] = useState(0);
  const [focusLink, setFocusLink] = useState({});
  const [showAddLink, setAddLink] = useState(false);
  const [showEditLink, setEditLink] = useState(false);

  const setNameState = (e) => {
    setName(e.target.value.trim());
    const exists = credits.find((item, index) => {
      if (focusCreditIndex !== index) {
        return (
          item.name.toLowerCase().trim() === e.target.value.toLowerCase().trim()
        );
      }
      return false;
    });
    if (exists) {
      setErr(true);
      setMsg("Same credit already exists");
    } else {
      setErr(false);
    }
  };

  const editCredit = () => {
    const nCredit = credits.map((item, index) => {
      if (focusCreditIndex === index) {
        item.name = name.trim();
        item.contacts = links;
      }
      return item;
    });

    setCredits(nCredit);
    resetData();
    setShow(false);
  };

  const removeReference = (index) => {
    const nLinks = links.map((item) => item);
    nLinks.splice(index, 1);
    setLinks(nLinks);
  };

  const resetData = () => {
    setErr(false);
    setMsg("");
    setName(focusCredit.name);
    setLinks(focusCredit.contacts);
  };

  return (
    <>
      <div className="modal">
        <div className="container addcredit">
          <div className="modalHeader">
            <h4>Edit Credit</h4>
            <i
              className="ri-close-line"
              onClick={() => {
                setShow(false);
              }}
            ></i>
          </div>

          <p className="head">Name of credit</p>
          <input
            value={name}
            onChange={(e) => {
              setNameState(e);
            }}
            type="text"
            placeholder="Write here"
          />

          <p className={`modalStatus ${err ? "statusShow" : ""}`}>
            <i className="ri-error-warning-line"></i>
            {errMsg}
          </p>

          <p className="head">References / Links</p>

          <div className="linkLists">
            {links.map((link, index) => (
              <div className="linkItem" key={index}>
                <div className="linkName">{link.type}</div>
                <div className="linkItemActions">
                  <i
                    onClick={() => {
                      setFocusIndex(index);
                      setFocusLink(link);
                      setEditLink(true);
                    }}
                    className="ri-pencil-fill"
                  ></i>
                  <i
                    onClick={() => removeReference(index)}
                    className="ri-delete-bin-line"
                  ></i>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setAddLink(true)}>
            Add {links.length < 1 ? "Reference / Link" : "More"}
          </button>

          <div className="modalBottomBar">
            <button onClick={resetData} className="reset">
              <i className="ri-restart-fill"></i>Reset
            </button>
            {!err && name !== "" && (
              <button onClick={editCredit}>
                <i className="ri-save-2-line"></i>Save
              </button>
            )}
          </div>
        </div>
      </div>
      {showAddLink && (
        <AddLink setShow={setAddLink} links={links} setLinks={setLinks} />
      )}

      {showEditLink && (
        <EditLink
          setShow={setEditLink}
          links={links}
          setLinks={setLinks}
          focusIndex={focusIndex}
          focusLink={focusLink}
        />
      )}
    </>
  );
}
