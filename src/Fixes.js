import React, { useEffect, useRef, useState } from "react";
import { Accordion, AccordionItem } from "carbon-components-react";
import "./Fixes.css";
import PropTypes from "prop-types";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const Fixes = ({ instance, message }) => {
  const [fixes, setFixes] = useState([]);
  const [refPosition, setRefPosition] = useState([0, 0]);
  const [fileName, setFileName] = useState(null);
  const [fileTitle, setFileTitle] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLinksVisible, setIsLinksVisible] = useState(false);
  const fixesRef = useRef(null);
  const elementRef = useRef([]);
  let messagesEndRef = useRef(null);

  useEffect(() => {
    console.log("Fixes 1 :", message.user_defined.value);
    if (Object.keys(fixes).length === 0) {
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
              console.log("Code");
              const fileBlob = new Blob([newCur.item], { type: "text/plain" });
              // this part avoids memory leaks
              if (fileName !== "") window.URL.revokeObjectURL(fileName);

              // update the download link state
              setFileName(window.URL.createObjectURL(fileBlob));
              setFileTitle("settings.xml");
              newCur.item = "```" + cur.item + "```";
              acc.push(newCur);
            } else if (
              !message.user_defined.search ||
              cur.item.includes(message.user_defined.search)
            ) {
              acc.push(newCur);
            }
            return acc;
          }
        }, []);

        return newFixes;
      };

      const objToReduce = Object.assign(
        {},
        message.user_defined.value.source_docs
      );

      // if (!objToReduce.fix) {
      //   objToReduce.fix = objToReduce.Fix;
      // }

      let recursiveSearchResult;

      if (objToReduce.fix.length > 0) {
        recursiveSearchResult = recursiveSearch(objToReduce.fix, "");
        recursiveSearchResult = recursiveSearchResult.flat(Infinity);
      } else {
        recursiveSearchResult = objToReduce.fix;
      }

      console.log("Setting recursive search result : ", recursiveSearchResult);
      setFixes(recursiveSearchResult);
      setRefPosition([0, objToReduce.fix.length - 1]);

      if (objToReduce.links) {
        if (objToReduce.links.length > 0 && objToReduce.links[0] !== null) {
          setFileList(objToReduce.links);
        }
      }

      // #2 todo - filter for category
      if (message.user_defined.search) {
        console.log(message.user_defined.search);
        setSearchTerm(message.user_defined.search);
      }
    }
  }, [fixes, message]);

  useEffect(() => {
    console.log("Element ref :", elementRef, "Ref pos :", refPosition);
    if (elementRef.current[refPosition[0]]) {
      console.dir(fixesRef.current);
      fixesRef.current.scrollLeft = refPosition[0] * 284;
      console.dir(fixesRef.current);
    }
  }, [refPosition]);

  useEffect(() => {
    const handler = (event) => {
      messagesEndRef.current = null;
      setIsDisabled(true);
    };
    instance.once({ type: "send", handler: handler });
  }, [instance]);

  useEffect(() => {
    if (messagesEndRef !== null) {
      console.log("Scrolling to : ", messagesEndRef);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 750);
    }
  }, [messagesEndRef]);

  const changePosition = (dir) => {
    if (dir === "plus") {
      setRefPosition([refPosition[0] + 1, fixes.length - 1]);
    } else if (dir === "minus") {
      setRefPosition([refPosition[0] - 1, fixes.length - 1]);
    } else {
      setRefPosition([Number(dir), fixes.length - 1]);
    }
  };

  const LinkRenderer = (props) => {
    return (
      <a href={props.href} target="_blank" rel="noreferrer">
        {props.children}
      </a>
    );
  };

  const showLinks = () => {
    setIsLinksVisible(!isLinksVisible);
    if (messagesEndRef !== null) {
      console.log("Scrolling to : ", messagesEndRef);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  };

  return (
    <>
      {Object.keys(fixes).length > 0 && (
        <>
          <div className="fixes-container">
            <div className="fixes-outside-container">
              <div className="fixes-inside-container" ref={fixesRef}>
                {fixes.length > 0 &&
                  fixes.map((fix, index) => {
                    if (!searchTerm || fix.item.includes(searchTerm)) {
                      return (
                        <div
                          className={`markdown 
                        ${index === refPosition[0] ? "fixes-selected" : "fixes"}
                        ${fixes.length - 1 === index ? "fixes-margin-end" : ""}
                        ${
                          fixes.length === 1 &&
                          fix.item.substring(0, 8) === "```<?xml"
                            ? "fixes-long"
                            : ""
                        }`}
                          ref={(ref) => {
                            elementRef.current[index] = ref;
                          }}
                          onClick={() => changePosition(`${index}`)}
                        >
                          <Markdown
                            components={{ a: LinkRenderer }}
                            rehypePlugins={[rehypeRaw]}
                            children={fix.item}
                          />
                        </div>
                      );
                    } else {
                      return <></>;
                    }
                  })}
              </div>
              {fixes.length > 0 && (
                <>
                  {fixes[0].item.substring(0, 8) !== "```<?xml" ? (
                    <>
                      {fixes.length > 1 && (
                        <div className="fixes-buttons-container">
                          <button
                            className="fixes-button"
                            onClick={() => changePosition("minus")}
                            disabled={
                              isDisabled
                                ? true
                                : refPosition[0] !== 0
                                ? false
                                : true
                            }
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
                            disabled={
                              isDisabled
                                ? true
                                : refPosition[0] !== refPosition[1]
                                ? false
                                : true
                            }
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="fixes-buttons-container">
                        <a
                          // this attribute sets the filename
                          download={fileTitle}
                          // link to the download URL
                          href={fileName}
                        >
                          <button
                            className="fixes-button"
                            style={{ "margin-right": "7px" }}
                          >
                            Download
                          </button>
                        </a>
                        <button
                          className="fixes-button"
                          onClick={() =>
                            navigator.clipboard.writeText(
                              fixes[0].item.substring(
                                3,
                                fixes[0].item.length - 3
                              )
                            )
                          }
                        >
                          Copy
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
          {fileList.length > 0 && (
            <>
              <span>
                (click{" "}
                <span className="blue-button" onClick={() => showLinks()}>
                  here
                </span>{" "}
                to {isLinksVisible ? "hide" : "show"} source documents)
              </span>
            </>
          )}
          {fileList.length > 0 && (
            <>
            <br />
            <br />
            {fileList.map((indLink) => {
              console.log(indLink);
              return (
                <div
                  className={isLinksVisible ? "" : "hidden-buttons"}
                  dangerouslySetInnerHTML={{ __html: indLink }}
                />
              );
            })}
            </>
            )}
          {/* <br /> */}
          <div className="end" ref={messagesEndRef} />
        </>
      )}
    </>
  );
};

Fixes.propTypes = {
  message: PropTypes.object,
};

export default Fixes;
