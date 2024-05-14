import React, { useEffect, useRef, useState } from "react";
import { withWebChat } from "@ibm-watson/assistant-web-chat-react";
import CustomResponsePortalsContainer from "./CustomResponsePortalsContainer";
import "./App.css";
// import { ReactComponent as CompanyLogo } from './images/company-logo.svg';
import { ReactComponent as WatsonLogo } from "./images/watson.svg";
// import { ReactComponent as TopBar } from './images/topbar.png';
// import { ReactComponent as LeftBar } from './images/leftbar.png';

const App = ({ createWebChatInstance }) => {
  const [instance, setInstance] = useState(null);
  const chatContainerRef = useRef(null);
  const scriptAddedRef = useRef(false);

  useEffect(() => {
    if (!scriptAddedRef.current) {
      scriptAddedRef.current = true;

      window.watsonAssistantChatOptions = {
        integrationID: "06449529-00a4-44f4-bc40-24d101d494e7", // The ID of this integration.
        region: "us-south", // The region your integration is hosted in.
        serviceInstanceID: "f3e4635f-a864-4e75-8fc3-5997516baa13", // The ID of your service instance.
        showLauncher: false,
        showRestartButton: true,
        disableSessionHistory: true,
        element: chatContainerRef.current,
        onLoad: (instance) => {
          // window.watsonAssistantChatInstance = instance;

          //  Disable the Home Screen
          // instance.updateHomeScreenConfig({
          //   is_on: false,
          // });

          //  Restart the conversation on startup
          console.log("Restarting watson assistand conversations.");
          instance.restartConversation();

          setInstance(instance);
          instance.render().then(() => {
            if (!instance.getState().isWebChatOpen) {
              instance.openWindow();
            }
          });
        },
      };

      const t = document.createElement("script");
      t.src =
        "https://web-chat.global.assistant.watson.appdomain.cloud/versions/" +
        (window.watsonAssistantChatOptions.clientVersion || "latest") +
        "/WatsonAssistantChatEntry.js";
      document.head.appendChild(t);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="app">
      <img
        src={"https://i.postimg.cc/pL5Jcw0P/topbar.png"}
        alt="Topbar"
        style={{ width: "100vw" }}
        className="top-bar"
      />
      <img
        src={"https://i.postimg.cc/cL6Tfgqk/leftbar.png"}
        alt="Leftbar"
        className="left-bar"
      />
      {instance && <CustomResponsePortalsContainer instance={instance} />}
    </div>
  );
};

export default withWebChat()(App);
