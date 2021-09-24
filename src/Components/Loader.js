import React, { useState } from "react";
import { sleep } from "../Sections/Work";
import "./Loader.css";

export default function Loader({ setShow }) {
  const [onLoad, setLoad] = useState(false);
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState(false);
  const [msg, setMsg] = useState("");

  const [url, setUrl] = useState("");

  const loadFile = async (e) => {
    const files = e.target.files;
    if (files.length < 1) return;
    const file = files[0];

    // Reseting file input
    document.getElementById("loadFileInput").value = null;

    // Starts the process
    await start();

    await set_progress(20);

    await stop("Fucked");
    await closePanel();
  };

  const loadUrl = async () => {};

  const loadLocal = () => {};

  const start = async () => {
    setErr(false);
    setLoad(true);
    setProgress(0);
    await sleep(1000);
  };

  const set_progress = async (progress) => {
    setProgress(progress);
    await sleep(1000);
  };

  const stop = async (err = "") => {
    if (err) {
      setErr(true);
      setMsg(err);
      await sleep(4000);
    } else {
      setProgress(100);
      await sleep(800);
    }
  };

  const closePanel = async () => {
    await sleep(1000);
    setShow(false);
  };

  return (
    <div className={`loadBar ${err && "err"}`}>
      {!onLoad && !err && (
        <>
          <i
            onClick={() => {
              setShow();
            }}
            className="ri-close-fill closeBtn"
          ></i>
          <div className="loadItem">
            <p>Load from url</p>
            <div className="loadContn">
              <input
                onChange={(e) => setUrl(e.target.value)}
                value={url}
                type="text"
                placeholder="Paste your url here"
              ></input>
              <button onClick={loadUrl}>
                <i className="ri-refresh-fill"></i>
              </button>
            </div>
          </div>

          <div className="loadItem">
            <p>Others</p>
            <div className="loadContn">
              <input
                id="loadFileInput"
                style={{ display: "none" }}
                type="file"
                accept=".json"
                onChange={(e) => loadFile(e)}
              />
              <label htmlFor="loadFileInput" className="bigButton">
                <i className="ri-file-3-line"></i>
                Load from file
              </label>
              <div className="bigButton">
                <i className="ri-window-2-line"></i>
                Load from browser
              </div>
            </div>
          </div>
        </>
      )}

      {onLoad && !err && (
        <div className="loadItem">
          <p>Loading please wait</p>
          <div className="progressBar">
            <div style={{ width: `${progress}%` }}> </div>
          </div>
        </div>
      )}

      {err && (
        <div className="loadItem err">
          <i className="ri-error-warning-fill"></i>
          <div>
            <p>Failed</p>
            <p className="errMsg">
              There are some network issue going on. Fix your network then try
              again.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
