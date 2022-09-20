import React, { useEffect, useState } from 'react';
import { withWebChat } from '@ibm-watson/assistant-web-chat-react';
import CustomResponsePortalsContainer from './CustomResponsePortalsContainer';
import './App.css';
// import { ReactComponent as HomeDepotLogo } from './images/home-depot.svg';
import { ReactComponent as WatsonLogo } from './images/watson.svg';

const App = ({ createWebChatInstance }) => {
  const [instance, setInstance] = useState(null);

  useEffect(() => {
    const watsonAssistantChatOptions = {
      integrationID: 'cb2e0ab8-def9-4b7a-b886-00d9664aa012',
      region: 'us-south',
      serviceInstanceID: '4d6a2927-6c4e-48c2-8950-063e310e3efa',
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
          {/* <HomeDepotLogo /> */}
          <h1>WELCOME!</h1>
          <div className='powered-by-container'>
            <div className='powered-by-text'>Powered by:&nbsp;</div>
            <WatsonLogo className='watson' />
          </div>
        </div>
        <div className='bottom-container'>
          <div className='intro-text'>
            I'm a chat bot assistant here to help you find information. I can
            answer questions and send emails to support services to aid an any
            issues that you may be facing.
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
