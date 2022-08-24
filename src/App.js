import React, { useEffect, useState } from 'react';
import { withWebChat } from '@ibm-watson/assistant-web-chat-react';
import CustomResponsePortalsContainer from './CustomResponsePortalsContainer';

const App = ({ createWebChatInstance }) => {
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    const watsonAssistantChatOptions = {
      integrationID: '5db4da32-6497-4e9c-b4bb-e451b9bd09d3',
      region: 'us-south',
      serviceInstanceID: '51f6030b-360a-4e10-a489-9aa28d3c7968',
      onLoad: (wacInstance) => {
        setInstance(wacInstance);
        wacInstance.render();
      },
    };

    createWebChatInstance(watsonAssistantChatOptions);
    // eslint-disable-next-line
  }, []);

  return (
    <div className='app'>
      {instance && <CustomResponsePortalsContainer instance={instance} />}
    </div>
  );
};

export default withWebChat()(App);
