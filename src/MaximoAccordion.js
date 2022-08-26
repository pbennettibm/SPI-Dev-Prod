import React, { useEffect, useState } from 'react';
import { Accordion, AccordionItem, Link } from 'carbon-components-react';
import './MaximoAccordion.css';
import PropTypes from 'prop-types';

const MaximoAccordion = ({ message }) => {
  const [WorkOrderElements, setWorkOrderElements] = useState([]);
  const [WorkOrderPosition, setWorkOrderPosition] = useState(2);

  useEffect(() => {
    if (WorkOrderElements.length === 0) {
      setWorkOrderElements(message.user_defined.value);
    }
  }, [WorkOrderElements, message.user_defined.value]);

  return (
    <>
      <Accordion align='start'>
        {WorkOrderElements.map((item, indexOne) => {
          if (indexOne < WorkOrderPosition) {
            return (
              <AccordionItem title={item.wonum} key={item.wonum + indexOne}>
                <p>Ticket Status: {item.status}</p>
                {item.tracking.map((info, indexTwo) => {
                  return (
                    <div key={info.itemnum + indexTwo}>
                      <a
                        className='tracking'
                        href={info.trackingurl}
                        target='_blank'
                        rel='noreferrer'
                      >
                        {info.description}
                      </a>
                    </div>
                  );
                })}
              </AccordionItem>
            );
          } else {
            return null;
          }
        })}
      </Accordion>
      <br />
      {WorkOrderElements.length >= WorkOrderPosition && (
        <Link onClick={() => setWorkOrderPosition(WorkOrderPosition + 2)}>
          click for more results
        </Link>
      )}
      <br />
      <br />
    </>
  );
};

MaximoAccordion.propTypes = {
  message: PropTypes.object,
};

export default MaximoAccordion;
