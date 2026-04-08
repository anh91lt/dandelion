import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";

import { DataProvider } from "./Provider/dataProvider";
const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <DataProvider>
        <App />
      </DataProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
