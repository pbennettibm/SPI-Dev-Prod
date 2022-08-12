import React, { useCallback, useEffect, useState, useRef} from 'react';
import  ReactDOM  from 'react-dom';
import { DatePicker, DatePickerInput, Accordion, AccordionItem} from 'carbon-components-react';
import PropTypes from 'prop-types';

/**
 * Your custom response component can also make use of the message object if you have set "user_defined" variables.  
 */

function CustomResponseComponent({ message, hostElement }) {
  const [WorkOrderElement, setWorkOrderElement] = useState([]);
  const [WorkOrderLength, setWorkOrderLength] = useState(0);
  const [WorkOrderPosition, setWorkOrderPosition] = useState(2);
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      setWorkOrderElement(oldArray => [...oldArray, message.user_defined.value])
      setWorkOrderLength(message.user_defined.value.length)
    } 
  }, [WorkOrderElement])

  let accordian_items = message.user_defined.value.map((item, index) => {
    if (index < WorkOrderPosition){
      return <AccordionItem title={item.wonum} key={item + index}><p>Ticket Status: {item.status}</p></AccordionItem>
    }
    });
  return (
    <CustomResponseComponentPortal hostElement={hostElement}>
    {/* <div className='component'>
      {JSON.stringify((message.user_defined.value[0].wonum))}
    </div> */}
    <Accordion align='start'>
      {accordian_items}
      {WorkOrderLength >= WorkOrderPosition && <span onClick={() => setWorkOrderPosition(WorkOrderPosition + 2)}>click for more results</span>}
    </Accordion>
    </CustomResponseComponentPortal>
  )
}

function CustomResponseComponentPortal({ hostElement, children }) {
  return ReactDOM.createPortal(children, hostElement);
}

CustomResponseComponent.propTypes = {
  message: PropTypes.object,
};

export default CustomResponseComponent;