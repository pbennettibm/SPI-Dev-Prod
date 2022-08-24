import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import MaximoAccordion from './MaximoAccordion';
import FeedbackThumbs from './FeedbackThumbs';

const CustomResponsePortalsContainer = ({ instance }) => {
  const [customResponseEvents, setCustomResponseEvents] = useState([]);
  const customResponseHandler = (event) => {
    setCustomResponseEvents((eventsArray) => eventsArray.concat(event));
  };

  useEffect(() => {
    instance.on({ type: 'customResponse', handler: customResponseHandler });

    return () => {
      instance.off({ type: 'customResponse', handler: customResponseHandler });
    };
  }, [instance]);

  return (
    <div className='watson-portal'>
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
    case 'maximo':
      return (
        <MaximoAccordion
          instance={instance}
          hostElement={hostElement}
          event={event}
          message={message}
        />
      );

    case 'feedback':
      return (
        <FeedbackThumbs
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

export default CustomResponsePortalsContainer;
