import axios from "axios";
import React, { useState } from "react";
import { ChromePicker } from "react-color";
import "./Work.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";

const getValue = (item) => {
  if (item.type === "select") {
    const option = item.options.find((i) => i.name === item.default);
    if (!option) return "";
    return `${item.var}: ${option.value};
${option.raw_value ? option.raw_value : ""}`;
  } else {
    return item.default ? `${item.var}: ${item.default};` : "";
  }
};

const getFirstState = (value) => {
  return value.map((item) => {
    return {
      ...item,
      value: item.default ? getValue(item) : "",
      val: item.default ? item.default : "",
    };
  });
};

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export default function Work({ value, main, name, match }) {
  const [state, setState] = useState(() => getFirstState(value));
  const [onProcess, setProcess] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const [status, setStatus] = useState(true);
  const [msg, setMsg] = useState("Processing");

  // Credit,
  // https://github.com/casesandberg/react-color/issues/750#issuecomment-684882202
  const decimalToHex = (alpha) => {
    let aHex = Math.round(255 * alpha).toString(16);
    return alpha === 0 ? "00" : aHex.length < 2 ? `0${aHex}` : aHex;
  };

  const setColor = (e, i) => {
    const color = `${e.hex}${decimalToHex(e.rgb.a)}`;
    const nState = state.map((item) => {
      item.val = item.title === i.title ? color : item.val;
      item.value =
        item.title === i.title ? `${item.var}: ${item.val};` : item.value;
      return item;
    });
    setState(nState);
  };

  const setValue = (e, i) => {
    const nState = state.map((item) => {
      item.val = item.title === i.title ? e.target.value : item.val;
      item.value =
        item.title === i.title ? `${item.var}: ${item.val};` : item.value;
      return item;
    });
    setState(nState);
  };

  const setOption = (e, i, o) => {
    const selected = e.target.value;

    const nState = state.map((item) => {
      item.val = item.title === i.title ? selected : item.val;
      item.value =
        item.title === i.title
          ? `${item.var}: ${o.value};\n${o.raw_value ? o.raw_value : ""}`
          : item.value;
      return item;
    });
    setState(nState);
  };

  const genarateConfig = async () => {
    setPercentage(0);
    setStatus(true);
    setProcess(true);
    setMsg("");
    await sleep(200);

    try {
      setPercentage(4);
      setMsg("Setting up configs");
      await sleep(1000);
      let text = "";
      state.map((item) => {
        text += item.val ? `\n${item.value}` : "";
        return item;
      });
      setPercentage(7);

      setMsg("Downloading resources");
      const response = await axios.get(main.target_url, {
        responseType: "arraybuffer",
      });
      setPercentage(30);

      if (main.target_type === "zip") {
        setMsg("Processing Zip");
        const zip = new JSZip();
        await zip.loadAsync(response.data);
        setPercentage(52);

        const prebuiltContent = await zip.file(main.target_file).async("text");
        const newContent = prebuiltContent + `\n/*Overrides*/\n:root{${text}}`;
        setPercentage(79);

        zip.file(main.target_file, newContent);
        setPercentage(86);

        const content = await zip.generateAsync({ type: "blob" });
        setPercentage(95);

        saveAs(content, `${name}_CSS.zip`);
        setPercentage(100);
        setStatus(true);
        setMsg("Done. Thank you for using krunker css tool");

        setTimeout(() => {
          setProcess(false);
        }, 4000);
      }
    } catch (err) {
      setStatus(false);
      setMsg(err.message);

      setTimeout(() => {
        setProcess(false);
      }, 4000);
    }
  };

  return (
    <div className="Work">
      {!onProcess ? (
        <>
          {state.map((item, id) => (
            <div className="config" key={id}>
              {item.hint_image && (
                <div className="hint">
                  <img src={item.hint_image} alt={item.title}></img>
                </div>
              )}
              <h3>{item.title}</h3>
              {item.description && (
                <p className="description">{item.description}</p>
              )}

              {item.type === "color" && (
                <ChromePicker
                  color={item.val}
                  onChangeComplete={(e) => setColor(e, item)}
                />
              )}

              {item.type === "select" &&
                item.options.map((option, id) => (
                  <div key={id} style={{ marginBottom: "1rem" }}>
                    <input
                      onChange={(e) => setOption(e, item, option)}
                      checked={item.val === option.name ? true : false}
                      id={item.var + option.name}
                      type="radio"
                      name={item.title}
                      value={option.name}
                    />
                    <label htmlFor={item.var + option.name}>
                      {option.name}
                    </label>
                  </div>
                ))}

              {item.type === "imageURL" && (
                <input
                  onChange={(e) => setValue(e, item)}
                  id={item.var}
                  type="text"
                  value={item.val}
                  placeholder="Image URL"
                />
              )}

              <br></br>
              <br></br>
              <hr></hr>
            </div>
          ))}

          <button onClick={genarateConfig} className="download">
            <i className="ri-download-cloud-2-line"></i> Download
          </button>
        </>
      ) : (
        <div>
          <div className="loadingBar">
            <div className="loading" style={{ width: `${percentage}%` }}></div>
          </div>
          <p
            className="loadingMsg"
            style={{ color: `${status ? "green" : "red"}` }}
          >
            {msg}
          </p>
        </div>
      )}
    </div>
  );
}
