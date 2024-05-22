import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import { AiOutlineCheckCircle, AiOutlineCloudUpload } from "react-icons/ai";
import { MdClear } from "react-icons/md";
import "./DragNDrop.css";

const DragNDrop = ({ instance, message }) => {
  const [files, setFiles] = useState([]);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const [emailLink, setEmailLink] = useState(null);
  const [query, setQuery] = useState(null);
  const [issue, setIssue] = useState("");
  let messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef !== null) {
      console.log("Scrolling to : ", messagesEndRef);
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 750);
    }
  }, [messagesEndRef]);

  useEffect(() => {
    if (issue === "") {
      for (const elem of document.getElementsByClassName("cds--chat-btn")) {
        if (elem.textContent.includes("Send ticket")) {
          elem.disabled = true;
        }
      }
    } else if (issue.length === 1) {
      for (const elem of document.getElementsByClassName("cds--chat-btn")) {
        if (elem.textContent.includes("Send ticket")) {
          elem.disabled = false;
        }
      }
    }
  }, [issue]);

  useEffect(() => {
    if (!query) {
      setQuery(message.user_defined);
    }
    console.log("Query : ", query);
  }, [message, query]);

  useEffect(() => {
    const fileHandler = (event) => {
      setIsButtonClicked(true);
      messagesEndRef.current = null;
    };

    if (query) {
      instance.once({
        type: "pre:send",
        handler: fileHandler,
      });
    }
  }, [instance, query]);

  useEffect(() => {
    if (isButtonClicked) {
      if (files[0]?.size <= 350000) {
        console.log("Send email with attachment");
        Axios.post(
          "/email",
          {
            fileUpload: files[0],
            title: query.title,
            subtitle: query.subtitle,
            issue: issue
          },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
          .then(async (response) => {
            console.log(response.data.link);
            setEmailLink(response.data.link);
          })
          .catch(function (error) {
            console.log("Axios error : ", error);
          });
      } else {
        console.log("Send email without attachment");
        Axios.post("/email", {
          title: query.title,
          subtitle: query.subtitle,
          issue: issue
        })
          .then(async (response) => {
            console.log(response.data);
            setEmailLink(response.data.link);
          })
          .catch(function (error) {
            console.log("Axios error : ", error);
          });
      }
    }
  }, [isButtonClicked]);

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    const newFiles = [event.target.files[0]];
    setFiles(newFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    console.log(event.dataTransfer.files[0]);
    const newFiles = [event.dataTransfer.files[0]];
    setFiles(newFiles);
  };

  const handleRemoveFile = (index) => {
    // setFiles([]);
  };

  const updateIssue = (event) => {
    setIssue(event.target.value);
  };

  return (
    <>
      <div className="issue-container">
        <textarea
          className="issue"
          name="issueInput"
          value={issue}
          onChange={updateIssue}
          placeholder="Description of issue here."
          rows="12"
        />
        <section className="drag-drop">
          <div
            className={`document-uploader ${
              files.length > 0 ? "upload-box active" : "upload-box"
            }`}
            onDrop={handleDrop}
            onDragOver={(event) => event.preventDefault()}
          >
            <>
              <div className="upload-info">
                {/* <AiOutlineCloudUpload
                style={{
                  "align-self": "center !important",
                  "justify-self": "center !important",
                }}
              /> */}
                <div className="upload-text">
                  <p className="upload-text-one">
                    Drag and drop your file here
                  </p>
                  <p>Limit one 350KB file.</p>
                </div>
              </div>
              <input
                type="file"
                hidden
                id="browse"
                onChange={handleFileChange}
              />
              <label htmlFor="browse" className="browse-btn">
                Browse files
              </label>
            </>

            {files.length > 0 && (
              <div className="file-list">
                <div className="file-list__container">
                  {files.map((file, index) => (
                    <div className="file-item" key={index}>
                      <div
                        className="file-info"
                        onClick={() => handleRemoveFile(index)}
                      >
                        <p>{file.name}</p>
                        {/* <p>{file.type}</p> */}
                      </div>
                      {/* <div className="file-actions">
                      <MdClear onClick={() => handleRemoveFile(index)} />
                    </div> */}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {files.length > 0 && (
              <div className="success-file">
                {/* <AiOutlineCheckCircle
                style={{
                  color: "#6DC24B !important",
                  marginRight: "1 !important",
                  display: "inline-block !important",
                }}
              /> */}
                <p>{files.length} file attached</p>
              </div>
            )}
          </div>
        </section>
        </div>
        {/* {emailLink !== null && (
          <div className="email">
            <a href={emailLink} target="_blank" rel="noreferrer">
              Click here to see the email that was sent
            </a>
          </div>
        )} */}
      <div className="end" ref={messagesEndRef} />
    </>
  );
};

export default DragNDrop;
