import "./App.css";
import { Routes, Route } from "react-router-dom";
import App from "./App";

function Main() {

  return (
    <>
      <div className="app">
        <Routes>
          <Route path="/protected" element={<App />} />
        </Routes>
      </div>
    </>
  );
}

export default Main;
