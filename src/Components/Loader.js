import axios from "axios";
import React, { useState } from "react";
import { sleep } from "../Sections/Work";
import { scan_config } from "../Utils/utils";
import "./Loader.css";

export default function Loader({ setShow, setData }) {
  const [onLoad, setLoad] = useState(false);
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState(false);
  const [msg, setMsg] = useState("");

  const [url, setUrl] = useState("");
  const localAvail = localStorage.getItem("css_config") ? true : false;

  const loadFile = async (e) => {
    const files = e.target.files;
    if (files.length < 1) return;
    const file = files[0];

    // Reseting file input
    document.getElementById("loadFileInput").value = null;

    // Starts the process
    await start();

    let reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    set_progress(20);

    reader.onload = async (e) => {
      const data = e.target.result;
      set_progress(60);
      const csstData = await JSON.parse(data);
      const ret = scan_config(csstData);
      if (!ret.success) {
        await stop(`Config error. Reason :: ${ret.err}`);
        await closePanel();
      } else {
        await stop();
        await closePanel();
        setData(csstData);
      }
    };

    reader.onerror = async (err) => {
      await stop(err.message);
      await closePanel();
    };
  };

  const loadUrl = async () => {
    try {
      await start();
      await set_progress(30);
      const response = await axios.get(url);
      const ret = scan_config(response.data);
      await set_progress(90);
      if (!ret.success) {
        await stop(`Config error. Reason :: ${ret.err}`);
        await closePanel();
      } else {
        await stop();
        await closePanel();
        setData(response.data);
      }
    } catch (err) {
      await stop(err.message);
      await closePanel();
    }
  };

  const loadLocal = async () => {
    await start();
    const lC = localStorage.getItem("css_config");
    const data = JSON.parse(lC);

    await set_progress(40);

    const ret = scan_config(data);
    if (ret.success) {
      await closePanel();
      setData(data);
    } else {
      await stop("Saved local data corrupted.");
      localStorage.setItem("css_config", null);
      await closePanel();
    }
  };

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
              <div
                onClick={loadLocal}
                className={`bigButton ${!localAvail ? "disabled" : ""}`}
              >
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
            <p className="errMsg">{msg}</p>
          </div>
        </div>
      )}
    </div>
  );
}
