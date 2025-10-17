
import { createRoot } from "react-dom/client";

import "./index.css";

import App from "./App.jsx";
import { StoreProvider } from "./Context/StoreContext.jsx";

createRoot(document.getElementById("root")).render(

  <StoreProvider>
    <App />
  </StoreProvider>
);
