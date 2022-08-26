import React, { useEffect, useState } from 'react';
import { withWebChat } from '@ibm-watson/assistant-web-chat-react';
import CustomResponsePortalsContainer from './CustomResponsePortalsContainer';
import './App.css';
import { ReactComponent as HomeDepotLogo } from './images/home-depot.svg';
import { ReactComponent as WatsonLogo } from './images/watson.svg';

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
      <div className='main-container'>
        <div className='top-container'>
          <HomeDepotLogo />
          <h1>WELCOME!</h1>
          <div className='powered-by-container'>
            <div className='powered-by-text'>Powered by:&nbsp;</div>
            <WatsonLogo className='watson' />
          </div>
        </div>
        <div className='bottom-container'>
          <div className='intro-text'>
            I'm an assistant for the Home Depot's Technology Deployment Center.
            I'm here to chat with you and help you with your orders placed
            through the TDC. I can answer questions and send emails to support
            services to aid an any issues that you may be facing.
          </div>
          <div className='intro-text-bold'>
            Click or tap on the icon in the corner to get started!
          </div>
        </div>
      </div>
      {instance && <CustomResponsePortalsContainer instance={instance} />}
    </div>
  );
};

export default withWebChat()(App);
