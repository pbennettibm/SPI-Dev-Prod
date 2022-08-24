import React, { useState } from 'react';
import {
  ThumbsUp32,
  ThumbsDown32,
  ThumbsUpFilled32,
  ThumbsDownFilled32,
} from '@carbon/icons-react';
import PropTypes from 'prop-types';

const FeedbackThumbs = ({ instance }) => {
  const [Option, setOption] = useState(null);

  const buttonClick = (boolText) => {
    setOption(boolText);
    instance.send({ input: { text: boolText } });
  };

  return (
    <>
      {Option !== 'Yes' ? (
        <ThumbsUp32 onClick={() => buttonClick('Satisfied')} />
      ) : (
        <ThumbsUpFilled32 onClick={() => buttonClick('Satisfied')} />
      )}
      &nbsp;
      {Option !== 'No' ? (
        <ThumbsDown32 onClick={() => buttonClick('Unsatisfied')} />
      ) : (
        <ThumbsDownFilled32 onClick={() => buttonClick('Unsatisfied')} />
      )}
    </>
  );
};

FeedbackThumbs.propTypes = {
  instance: PropTypes.object,
};

export default FeedbackThumbs;
