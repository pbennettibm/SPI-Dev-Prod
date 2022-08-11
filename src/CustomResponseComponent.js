import React, { useCallback, useState } from 'react';
import  ReactDOM  from 'react-dom';
import { DatePicker, DatePickerInput, Accordion, AccordionItem} from 'carbon-components-react';
import PropTypes from 'prop-types';

/**
 * Your custom response component can also make use of the message object if you have set "user_defined" variables.  
 */

function CustomResponseComponent({ message, hostElement }) {
  const [datePickerElement, setDatePickerElement] = useState(null);
  let accordian_items = message.user_defined.value.map(item => {
    return <AccordionItem title={item.wonum}><p>Ticket Status: {item.status}</p></AccordionItem>
    });
  return (
    <CustomResponseComponentPortal hostElement={hostElement}>
    {/* <div className='component'>
      {JSON.stringify((message.user_defined.value[0].wonum))}
    </div> */}
    <Accordion align='start'>
      {accordian_items}
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