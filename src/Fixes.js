import React, { createRef, useEffect, useRef, useState } from "react";
import "./Fixes.css";
import PropTypes from "prop-types";
import DragNDrop from "./DragNDrop";

const Fixes = ({ message }) => {
  const [fixes, setFixes] = useState({});
  const [refPosition, setRefPosition] = useState([0, 0]);
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
            acc.push(cur);
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

  // useEffect(() => {
  //     // Scrolls to the bottom of the scrollable area
  //     console.log("element ref :", elementRef)
  //     console.log("ref pos :", refPosition)
  //     console.dir(fixesRef);
  //     // fixesRef.scrollLeft = refPosition * 315
  //     if (elementRef.current[refPosition]) {
  //       console.dir(elementRef.current[refPosition])
  //       setTimeout(() => {
  //         elementRef.current[refPosition].scrollIntoView()
  //       }, 1000);
  //     }
  //   }, [refPosition]);

  const changePosition = (dir) => {
    if (dir === "plus") {
      setRefPosition([refPosition[0] + 1, fixes.length - 1]);
    } else if (dir === "minus") {
      setRefPosition([refPosition[0] - 1, fixes.length - 1]);
    } else {
      setRefPosition([Number(dir), fixes.length - 1]);
    }
  };

  return (
    <>
      {Object.keys(fixes).length > 0 && (
        <div className="fixes-container" ref={fixesRef}>
          <div className="fixes">{fixes[refPosition[0]].item}</div>

          <div className="fixes-buttons-container" ref={fixesRef}>
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
        </div>
      )}
    </>
  );
};

Fixes.propTypes = {
  message: PropTypes.object,
};

export default Fixes;
