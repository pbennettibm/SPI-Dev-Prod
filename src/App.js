import React, { useEffect, useState } from 'react';
import { withWebChat } from '@ibm-watson/assistant-web-chat-react';
import CustomResponsePortalsContainer from './CustomResponsePortalsContainer';

function App({ createWebChatInstance }) {
  const [instance, setInstance] = useState(null);
  const [customResponseEvents, setCustomResponseEvents] = useState([]);

  useEffect(() => {
    const watsonAssistantChatOptions = {
      carbonTheme: 'g100',
      integrationID: '5db4da32-6497-4e9c-b4bb-e451b9bd09d3',
      region: 'us-south',
      serviceInstanceID: '51f6030b-360a-4e10-a489-9aa28d3c7968',
      onLoad: wacInstance => {
        setInstance(wacInstance);
        wacInstance.updateHomeScreenConfig({
          is_on: true,
          greeting: 'Welcome to TDC Assistant.',
          starters: {
            is_on: true,
          },
        });
        wacInstance.render(); 
      },
    }
    createWebChatInstance(watsonAssistantChatOptions);
  }, []);
  
  function customResponseHandler(event) {
    setCustomResponseEvents(oldArray => [...oldArray, event]);
  }


  return (
    <div className="App">
      {instance && <CustomResponsePortalsContainer instance={instance} />}
    </div>
  );
  }

export default withWebChat()(App);
