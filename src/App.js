import React, { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { withWebChat } from "@ibm-watson/assistant-web-chat-react";
import CustomResponsePortalsContainer from "./CustomResponsePortalsContainer";
import "./App.css";

const App = ({ createWebChatInstance }) => {
  const [instance, setInstance] = useState(null);
  const chatContainerRef = useRef(null);
  const scriptAddedRef = useRef(false);

  useEffect(() => {
    if (!scriptAddedRef.current) {
      scriptAddedRef.current = true;

      window.watsonAssistantChatOptions = {
        integrationID: process.env.REACT_APP_WA_INTEGRATION_ID, // The ID of this integration.
        region: process.env.REACT_APP_WA_REGION, // The region your integration is hosted in.
        serviceInstanceID: process.env.REACT_APP_WA_SERVICE_INSTANCE_ID, // The ID of your service instance.
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
        src={"https://i.postimg.cc/nM8N4hnV/topbar-copy.png"}
        alt="Topbar"
        style={{ width: "100vw" }}
        className="top-bar"
      />
      <img
        src={"https://i.postimg.cc/mZcDypTK/leftbar-copy.png"}
        alt="Leftbar"
        className="left-bar"
      />
      {instance && <CustomResponsePortalsContainer instance={instance} />}
    </div>
  );
};

export default withWebChat()(App);
