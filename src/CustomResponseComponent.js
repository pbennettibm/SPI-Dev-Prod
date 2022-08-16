import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Accordion, AccordionItem, Link } from 'carbon-components-react';
import PropTypes from 'prop-types';

function CustomResponseComponent({ message, hostElement }) {
  const [WorkOrderElements, setWorkOrderElements] = useState([]);
  const [WorkOrderLength, setWorkOrderLength] = useState(0);
  const [WorkOrderPosition, setWorkOrderPosition] = useState(2);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      setWorkOrderElements(message.user_defined.value);
      setWorkOrderLength(message.user_defined.value.length);
    }
  }, [WorkOrderElements, message.user_defined.value]);

  return (
    <CustomResponseComponentPortal hostElement={hostElement}>
      <Accordion align='start'>
        {WorkOrderElements.map((item, index) => {
          if (index < WorkOrderPosition) {
            return (
              <AccordionItem title={item.wonum} key={item + index}>
                <p>Ticket Status: {item.status}</p>
              </AccordionItem>
            );
          } else {
            return null;
          }
        })}
      </Accordion>
      <br />
      {WorkOrderLength >= WorkOrderPosition && (
        <Link onClick={() => setWorkOrderPosition(WorkOrderPosition + 2)}>
          click for more results
        </Link>
      )}
    </CustomResponseComponentPortal>
  );
}

const CustomResponseComponentPortal = ({ hostElement, children }) => {
  return ReactDOM.createPortal(children, hostElement);
};

CustomResponseComponent.propTypes = {
  message: PropTypes.object,
  hostElement: PropTypes.object,
};

export default CustomResponseComponent;
