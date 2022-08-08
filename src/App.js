import React, { useEffect, useState } from 'react';
import { withWebChat } from '@ibm-watson/assistant-web-chat-react';
import CustomResponsePortalsContainer from './CustomResponsePortalsContainer';
import CustomResponseComponent from './CustomResponseComponent';

function App({ createWebChatInstance }) {
  const [instance, setInstance] = useState(null);
  const [customResponseEvents, setCustomResponseEvents] = useState([]);

  useEffect(() => {
    let loaded = true;
    let singleInstance;
    const watsonAssistantChatOptions = {
      // carbonTheme: 'g100',
      integrationID: '5db4da32-6497-4e9c-b4bb-e451b9bd09d3',
      region: 'us-south',
      serviceInstanceID: '51f6030b-360a-4e10-a489-9aa28d3c7968',
      onLoad: wacInstance => {
        if (loaded) {
          singleInstance = wacInstance
          setInstance(wacInstance);
          wacInstance.on({ type: 'customResponse', handler: customResponseHandler });
          wacInstance.render();
      } 
      },
    }
    createWebChatInstance(watsonAssistantChatOptions);
    return function cleanup() {
      loaded = false;
      if (singleInstance) {
        singleInstance.off({ type: 'customResponse', handler: customResponseHandler });
      }
    };
    // eslint-disable-next-line
  }, []);
  
  function customResponseHandler(event) {
    setCustomResponseEvents(oldArray => [...oldArray, event]);
  }


  return (
    <div className="App">
      {/* {instance && <CustomResponsePortalsContainer instance={instance} />} */}
      {customResponseEvents.map(function mapEvent(event, index) {
        if (instance) {
        return (
            <ResponsePicker instance={instance} key={index} hostElement={event.data.element} event={event} message={event.data.message} />
        );
        }
      })}
    </div>
  );
  }
  function ResponsePicker({ message, hostElement, instance, event }) {
    switch (message.user_defined.template_name) {
      case 'maximo-call':
        console.log(message)
        return <CustomResponseComponent instance={instance} hostElement={hostElement} event={event} message={message} />;
      default:
        return null;
    }
  }

export default withWebChat()(App);
