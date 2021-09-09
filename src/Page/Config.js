import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Info from "../Sections/Info";
import Work from "../Sections/Work";
import { getList } from "../Sections/CssList";
import NotFound from "./NotFound";

export default function Config() {
  const [exists, setExists] = useState(null);
  const { css_name } = useParams();
  const [config, setConfig] = useState({});

  useEffect(() => {
    getList()
      .then((data) => {
        const ele = data.find((item) => item.base.name === css_name);
        if (ele) {
          setConfig(ele);
          setExists(true);
        } else {
          setExists(false);
        }
      })
      .catch(() => {
        setExists(false);
      });
  }, [css_name]);

  if (exists === null) return null;

  return (
    <>
      {exists ? (
        <>
          <Info css={config.base} />
          <Work
            value={config.configs}
            main={config.main}
            name={config.base.name}
          />
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
}
