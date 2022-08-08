import React, { useCallback, useState } from 'react';
import  ReactDOM  from 'react-dom';
import { DatePicker, DatePickerInput} from 'carbon-components-react';
import PropTypes from 'prop-types';

/**
 * Your custom response component can also make use of the message object if you have set "user_defined" variables.  
 */

function CustomResponseComponent({ message, hostElement }) {
  const [datePickerElement, setDatePickerElement] = useState(null);
  return (
    <CustomResponseComponentPortal hostElement={hostElement}>
    <div className='component'>
      {JSON.stringify(message.values)}
    </div>
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