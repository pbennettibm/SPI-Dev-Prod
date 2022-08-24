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
  const [FirstClick, setFirstClick] = useState(true);

  const buttonClick = (boolText) => {
    if (FirstClick) {
      setOption(boolText);
      setFirstClick(false);
      instance.send({ input: { text: boolText } });
    }
  };

  return (
    <>
      {Option !== 'Satisfied' ? (
        <ThumbsUp32 onClick={() => buttonClick('Satisfied')} />
      ) : (
        <ThumbsUpFilled32 onClick={() => buttonClick('Satisfied')} />
      )}
      &nbsp;
      {Option !== 'Unsatisfied' ? (
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
