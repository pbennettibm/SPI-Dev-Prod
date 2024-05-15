// import {
//   ThumbsUp32,
//   ThumbsDown32,
//   ThumbsUpFilled32,
//   ThumbsDownFilled32,
// } from "@carbon/icons-react";
import PropTypes from "prop-types";
import DragNDrop from "./DragNDrop";

const FeedbackThumbs = ({ instance, message }) => {

  // const buttonClick = (boolText) => {};

  return (
    <>
      <DragNDrop instance={instance} message={message}/>
    </>
  );
};

FeedbackThumbs.propTypes = {
  instance: PropTypes.object,
};

export default FeedbackThumbs;
