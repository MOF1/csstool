import React, { useEffect, useState } from "react";
import Loader from "../Components/Loader";
import AddConfig from "../Modals/AddConfig";
import AddCredit from "../Modals/AddCredit";
import EditConfig from "../Modals/EditConfig";
import EditCredit from "../Modals/EditCredit";
import { sleep } from "../Sections/Work";
import { scan_config } from "../Utils/utils";
import { saveAs } from "file-saver";
import "./ConfigCreate.css";
import Preview from "../Sections/Preview";
import Info from "../Sections/Info";
import ConfigHeader from "../Sections/ConfigHeader";

const getBase = () => ({
  name: "",
  logo: "",
  cover: "",
  description: "",
  repo: "",
  site: "",
});

const getMain = () => ({
  target_type: "css",
  target_url: "",
  target_file: "",
});

export const stack = (index, upStack, arr, setArr) => {
  const nArr = arr.map((item) => item);

  if ((upStack && index > 0) || (!upStack && index < nArr.length - 1)) {
    const indexInc = upStack ? index - 1 : index + 1;
    const tmp = nArr[indexInc];
    nArr[indexInc] = nArr[index];
    nArr[index] = tmp;
    setArr(nArr);
  }
};

export default function ConfigCreate() {
  const [data, setData] = useState(null);
  const [base, setBase] = useState(() => getBase());
  const [main, setMain] = useState(() => getMain());

  const [credits, setCredits] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [showAddCredit, setAddCredit] = useState(false);
  const [showEditCredit, setEditCredit] = useState(false);
  const [showAddConfig, setAddConfig] = useState(false);
  const [showEditConfig, setEditConfig] = useState(false);
  const [showLoadPanel, setLoadPanel] = useState(false);

  const [focusCreditIndex, setFocusCreditIndex] = useState(0);
  const [focusCredit, setFocusCredit] = useState(0);

  const [focusConfigIndex, setFocusConfigIndex] = useState(0);
  const [focusConfig, setFocusConfig] = useState(0);

  // Local Saving states
  const [localSaving, setLocalSaving] = useState(false);
  const [configOk, setConfigOk] = useState(false);

  // Preview
  const [showPreview, setPreview] = useState(false);

  useEffect(() => {
    if (data) {
      setMain(data.main);
      setBase({
        name: data.base.name,
        logo: data.base.logo,
        cover: data.base.cover,
        description: data.base.description,
        repo: data.base.repo,
        site: data.base.site,
      });
      setCredits(data.base.credits);
      setConfigs(data.configs);
    }
  }, [data]);

  useEffect(() => {
    const raw = {
      base: { ...base, credits },
      main,
      configs,
    };

    setConfigOk(scan_config(raw).success);
  }, [main, base, configs, credits]);

  const getConfig = () => {
    return { base: { ...base, credits }, main, configs };
  };

  const saveIntoLocal = async () => {
    setLocalSaving(true);
    await sleep(1000);
    localStorage.setItem("css_config", JSON.stringify(getConfig()));
    setLocalSaving(false);
  };

  const exportConfig = () => {
    const textEncoder = new TextEncoder();

    saveAs(
      new Blob([textEncoder.encode(JSON.stringify(getConfig()))]),
      `${base.name}_css_config.json`
    );
  };

  const removeCredit = (name) => {
    let rIndex = credits.findIndex((item) => item.name === name);
    const nCredits = credits.map((item) => item);
    nCredits.splice(rIndex, 1);
    setCredits(nCredits);
  };

  const removeConfig = (title) => {
    let rIndex = configs.findIndex((item) => item.title === title);
    const nConfig = configs.map((item) => item);
    nConfig.splice(rIndex, 1);
    setConfigs(nConfig);
  };

  const stackCredit = (name, upStack = true) => {
    const currIndex = credits.findIndex((item) => item.name === name);
    stack(currIndex, upStack, credits, setCredits);
  };

  const stackConfig = (title, upStack = true) => {
    const currIndex = configs.findIndex((item) => item.title === title);
    stack(currIndex, upStack, configs, setConfigs);
  };

  const resetData = () => {
    setBase(getBase());
    setMain(getMain());
    setCredits([]);
    setConfigs([]);
    setData(null);
  };

  return (
    <>
      {showPreview && (
        <>
          <Info css={{ ...base, credits }} />{" "}
          <Preview
            value={configs}
            main={main}
            name={base.name}
            closePreview={setPreview}
          />
        </>
      )}

      {!showPreview && (
        <>
          <ConfigHeader />
          <div className="configSection">
            {/* Base Details */}
            <div className="baseConfig">
              <div className="configItem">
                <p className="configHead">CSS Name</p>
                <input
                  value={base.name}
                  onChange={(e) => {
                    setBase({ ...base, name: e.target.value });
                  }}
                  type="text"
                  placeholder="Name"
                  required={true}
                />
              </div>

              <div className="configItem">
                <p className="configHead">
                  CSS Logo <span>(Optional)</span>
                </p>

                <input
                  value={base.logo}
                  onChange={(e) => {
                    setBase({ ...base, logo: e.target.value });
                  }}
                  type="text"
                  placeholder="Logo Image Url"
                  required={false}
                />
              </div>

              <div className="configItem">
                <p className="configHead">
                  About CSS <span>(Optional)</span>
                </p>
                <textarea
                  value={base.description}
                  onChange={(e) => {
                    setBase({ ...base, description: e.target.value });
                  }}
                  type="text"
                  placeholder="Description"
                  required={false}
                />
              </div>

              <div className="configItem">
                <p className="configHead">
                  Cover Image <span>(Optional)</span>
                </p>
                <input
                  value={base.cover}
                  onChange={(e) => {
                    setBase({ ...base, cover: e.target.value });
                  }}
                  type="text"
                  placeholder="Cover Image Url"
                  required={false}
                />
              </div>

              <div className="configItem">
                <p className="configHead">
                  Repository Link <span>(Optional)</span>
                </p>

                <input
                  value={base.repo}
                  onChange={(e) => {
                    setBase({ ...base, repo: e.target.value });
                  }}
                  type="text"
                  placeholder="Github Repo Link"
                  required={false}
                />
              </div>

              <div className="configItem">
                <p className="configHead">
                  Website if available <span>(Optional)</span>
                </p>
                <input
                  value={base.site}
                  onChange={(e) => {
                    setBase({ ...base, site: e.target.value });
                  }}
                  type="text"
                  placeholder="Website Url"
                  required={false}
                />
              </div>

              <div className="configItem configIn">
                <p className="configHead">
                  Credits <span>(Optional)</span>
                </p>
                {credits.length < 1 ? (
                  <div
                    onClick={() => setAddCredit(true)}
                    className="emptyCredit"
                  >
                    No credits here.<br></br>Add one
                  </div>
                ) : (
                  <div className="configList">
                    {credits.map((item, id) => (
                      <div key={id} className="configInItem">
                        <div className="configInItemInfo">
                          <i className="ri-pencil-ruler-2-fill"></i>
                          {item.name}
                        </div>
                        <div className="configInItemActions">
                          <i
                            onClick={() => removeCredit(item.name)}
                            className="ri-delete-bin-2-line"
                          ></i>
                          <i
                            onClick={() => {
                              setFocusCreditIndex(id);
                              setFocusCredit(item);
                              setEditCredit(true);
                            }}
                            className="ri-edit-2-fill"
                          ></i>
                          {credits.length > 1 && (
                            <>
                              <i
                                onClick={() => stackCredit(item.name)}
                                className="ri-arrow-up-s-line"
                              ></i>
                              <i
                                onClick={() => stackCredit(item.name, false)}
                                className="ri-arrow-down-s-line"
                              ></i>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={() => setAddCredit(true)}
                      key="addmore"
                      className="configInItem add"
                    >
                      <div className="configInItemInfo">
                        <i className="ri-menu-add-line"></i>
                        Add More
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="configItem configIn">
                <p className="configHead">Configurations</p>
                {configs.length < 1 ? (
                  <div
                    onClick={() => setAddConfig(true)}
                    className="emptyCredit"
                  >
                    You didn't add configuation yet.<br></br>Add one or more
                    configuration depending on your css.
                  </div>
                ) : (
                  <div className="configList">
                    {configs.map((item, id) => (
                      <div key={id} className="configInItem">
                        <div className="configInItemInfo">
                          {item.type === "color" && (
                            <i className="ri-brush-2-fill"></i>
                          )}

                          {item.type === "imageURL" && (
                            <i className="ri-image-2-fill"></i>
                          )}

                          {item.type === "select" && (
                            <i className="ri-checkbox-multiple-fill"></i>
                          )}

                          {item.title}
                        </div>
                        <div className="configInItemActions">
                          <i
                            onClick={() => removeConfig(item.title)}
                            className="ri-delete-bin-2-line"
                          ></i>
                          <i
                            onClick={() => {
                              setFocusConfigIndex(id);
                              setFocusConfig(item);
                              setEditConfig(true);
                            }}
                            className="ri-edit-2-fill"
                          ></i>
                          {configs.length > 1 && (
                            <>
                              <i
                                onClick={() => stackConfig(item.title)}
                                className="ri-arrow-up-s-line"
                              ></i>
                              <i
                                onClick={() => stackConfig(item.title, false)}
                                className="ri-arrow-down-s-line"
                              ></i>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    <div
                      onClick={() => setAddConfig(true)}
                      key="addmore"
                      className="configInItem add"
                    >
                      <div className="configInItemInfo">
                        <i className="ri-menu-add-line"></i>
                        Add More
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="configItem">
                <p className="configHead">Target Type</p>
                <div className="radioContainer">
                  <input
                    id="zip"
                    type="radio"
                    name="target_type"
                    value="zip"
                    onChange={() => setMain({ ...main, target_type: "zip" })}
                    checked={main.target_type === "zip"}
                  />
                  <label htmlFor="zip">Zip</label>
                  <input
                    id="css"
                    type="radio"
                    name="target_type"
                    value="css"
                    onChange={() => setMain({ ...main, target_type: "css" })}
                    checked={main.target_type === "css"}
                  />
                  <label htmlFor="css">CSS</label>
                </div>
              </div>

              <div className="configItem" style={{ gridColumn: "1 / span 1" }}>
                <p className="configHead">
                  Target{" "}
                  <span>
                    (Use only public origin urls like raw.githubusercontent)
                  </span>
                </p>
                <input
                  value={main.target_url}
                  onChange={(e) => {
                    setMain({ ...main, target_url: e.target.value });
                  }}
                  type="text"
                  placeholder={`${
                    main.target_type === "css" ? "Css Url" : "Zip Url"
                  }`}
                  required={false}
                />
              </div>
              {main.target_type === "zip" && (
                <div
                  className="configItem"
                  style={{ gridColumn: "2 / span 1" }}
                >
                  <p className="configHead">Target File</p>
                  <input
                    value={main.target_file}
                    onChange={(e) => {
                      setMain({ ...main, target_file: e.target.value });
                    }}
                    type="text"
                    placeholder="ex. css/main.custom.css"
                    required={false}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="downloadBar">
            {showLoadPanel && (
              <Loader setShow={setLoadPanel} setData={setData} />
            )}
            <div className="wrapper">
              <button onClick={resetData} className="reset">
                <i className="ri-restart-fill"></i>Reset
              </button>
              <button
                onClick={() => {
                  setLoadPanel(true);
                }}
                className="load"
              >
                <i className="ri-loader-4-line"></i>Load
              </button>

              {configOk && (
                <>
                  <button onClick={() => setPreview(true)} className="test">
                    <i className="ri-flask-fill"></i>Test
                  </button>
                  <button
                    className={`save ${localSaving ? "busy" : ""}`}
                    onClick={saveIntoLocal}
                  >
                    <i className="ri-window-fill"></i>{" "}
                    {localSaving ? "Saving" : "Save Local"}
                  </button>

                  <button className="download" onClick={exportConfig}>
                    <i className="ri-download-cloud-2-line"></i> Export
                  </button>
                </>
              )}
            </div>
          </div>

          {showAddCredit && (
            <AddCredit
              setShow={setAddCredit}
              credits={credits}
              setCredits={setCredits}
            />
          )}

          {showEditCredit && (
            <EditCredit
              setShow={setEditCredit}
              credits={credits}
              setCredits={setCredits}
              focusCredit={focusCredit}
              focusCreditIndex={focusCreditIndex}
            />
          )}

          {showAddConfig && (
            <AddConfig
              setShow={setAddConfig}
              configs={configs}
              setConfigs={setConfigs}
            />
          )}

          {showEditConfig && (
            <EditConfig
              setShow={setEditConfig}
              configs={configs}
              setConfigs={setConfigs}
              focusConfig={focusConfig}
              focusConfigIndex={focusConfigIndex}
            />
          )}
        </>
      )}
    </>
  );
}
