import React, { useEffect, useRef, useState } from "react";
import "./Fixes.css";
import PropTypes from "prop-types";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const Fixes = ({ message }) => {
  const [fixes, setFixes] = useState([]);
  const [refPosition, setRefPosition] = useState([0, 0]);
  const [fileName, setFileName] = useState(null);
  const fixesRef = useRef(null);
  const elementRef = useRef([]);

  useEffect(() => {
    if (Object.keys(fixes).length === 0) {
      console.log("Fixes :", message.user_defined.value.source_docs.fix);

      const recursiveSearch = (fixes, strToAdd) => {
        const newFixes = fixes.reduce((acc, cur, idx) => {
          if (cur.subitem) {
            const subArray = recursiveSearch(
              cur.subitem,
              `${cur.item} ${idx} \n`
            );
            console.log("Current: ", cur, cur.item);

            acc.push(subArray);
            return acc;
          } else {
            let newCur = Object.assign({}, cur);
            if (cur.item.substring(0, 5) === "<?xml") {
              const fileBlob = new Blob([newCur.item], { type: "text/plain" });
              // this part avoids memory leaks
              if (fileName !== "") window.URL.revokeObjectURL(fileName);

              // update the download link state
              setFileName(window.URL.createObjectURL(fileBlob));
              newCur.item = "```" + cur.item + "```";
            }
            acc.push(newCur);
            return acc;
          }
        }, []);

        return newFixes;
      };

      let recursiveSearchResult = recursiveSearch(
        message.user_defined.value.source_docs.fix,
        ""
      );

      recursiveSearchResult = recursiveSearchResult.flat(Infinity);

      console.log("Setting recursive search result : ", recursiveSearchResult);
      setFixes(recursiveSearchResult);
      setRefPosition([
        0,
        message.user_defined.value.source_docs.fix.length - 1,
      ]);
    }
  }, [fixes, message.user_defined.value]);

  useEffect(() => {
    console.log("Element ref :", elementRef, "Ref pos :", refPosition);
    if (elementRef.current[refPosition[0]]) {
      console.dir(fixesRef.current);
      fixesRef.current.scrollLeft = refPosition[0] * 283;
      console.dir(fixesRef.current);
    }
  }, [refPosition]);

  const changePosition = (dir) => {
    if (dir === "plus") {
      setRefPosition([refPosition[0] + 1, fixes.length - 1]);
    } else if (dir === "minus") {
      setRefPosition([refPosition[0] - 1, fixes.length - 1]);
    } else {
      setRefPosition([Number(dir), fixes.length - 1]);
    }
  };

  const openModal = (e) => {
    console.log("Modal : ", e)
  }

  return (
    <>
      {Object.keys(fixes).length > 0 && (
        <div className="fixes-container">
          <div className="fixes-outside-container">
          <div className="fixes-inside-container" ref={fixesRef}>
            {fixes.length > 0 &&
              fixes.map((fix, index) => {
                return (
                  <div
                    className={`fixes markdown ${
                      index === refPosition[0] ? "fixes-selected" : ""
                    }`}
                    ref={(ref) => {
                      elementRef.current[index] = ref;
                    }}
                    onClick={() => changePosition(`${index}`)}
                  >
                    <Markdown components={{ a: openModal }} rehypePlugins={[rehypeRaw]} children={fix.item} />
                  </div>
                );
              })}
          </div>
          {fixes.length > 1 ? (
            <div className="fixes-buttons-container">
              <button
                className="fixes-button"
                onClick={() => changePosition("minus")}
                disabled={refPosition[0] !== 0 ? false : true}
              >
                Previous
              </button>
              {Object.keys(fixes).length > 0 &&
                fixes.map((fix, index) => {
                  return (
                    <div
                      className={`${
                        index === refPosition[0]
                          ? "fixes-square-big"
                          : "fixes-square"
                      }`}
                      onClick={() => changePosition(`${index}`)}
                    >
                      {index + 1}
                    </div>
                  );
                })}
              <button
                className="fixes-button"
                onClick={() => changePosition("plus")}
                disabled={refPosition[0] !== refPosition[1] ? false : true}
              >
                Next
              </button>
            </div>
          ) : (
            <a
              // this attribute sets the filename
              download="setting.xml"
              // link to the download URL
              href={fileName}
            >
              <button className="fixes-button">
                Download
              </button>
            </a>
          )}
          </div>
        </div>
      )}
    </>
  );
};

Fixes.propTypes = {
  message: PropTypes.object,
};

export default Fixes;