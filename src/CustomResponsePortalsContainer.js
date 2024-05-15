import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import Fixes from "./Fixes";
import Upload from "./Upload";
// import FeedbackThumbs from './FeedbackThumbs';

export const CustomResponsePortalsContainer = ({ instance }) => {
  const [customResponseEvents, setCustomResponseEvents] = useState([]);
  const customResponseHandler = (event) => {
    setCustomResponseEvents((eventsArray) => eventsArray.concat(event));
  };

  useEffect(() => {
    // if (instance !== null) {
    instance.on({ type: "customResponse", handler: customResponseHandler });

    return () => {
      instance.off({
        type: "customResponse",
        handler: customResponseHandler,
      });
    };
    // }
  }, [instance]);

  return (
    <div className="watson-portal">
      {customResponseEvents.map(function mapEvent(event, index) {
        return (
          // eslint-disable-next-line
          <CustomResponseComponentPortal
            key={event.data.element + index}
            hostElement={event.data.element}
          >
            <ResponsePicker
              instance={instance}
              key={index}
              hostElement={event.data.element}
              event={event}
              message={event.data.message}
            />
          </CustomResponseComponentPortal>
        );
      })}
    </div>
  );
};

CustomResponsePortalsContainer.propTypes = {
  instance: PropTypes.object.isRequired,
};

const CustomResponseComponentPortal = ({ hostElement, children }) => {
  return ReactDOM.createPortal(children, hostElement);
};

const ResponsePicker = ({ message, hostElement, instance, event }) => {
  switch (message.user_defined.template_name) {
    case "fixes":
      return (
        <Fixes
          instance={instance}
          hostElement={hostElement}
          event={event}
          message={message}
        />
      );
    // case 'feedback':
    //   return (
    //     <FeedbackThumbs
    //       instance={instance}
    //       hostElement={hostElement}
    //       event={event}
    //       message={message}
    //     />
    //   );
    case "upload":
      return (
        <Upload
          instance={instance}
          hostElement={hostElement}
          event={event}
          message={message}
        />
      );
    default:
      return <></>;
  }
};

CustomResponsePortalsContainer.propTypes = {
  instance: PropTypes.object,
};

export default CustomResponsePortalsContainer;
