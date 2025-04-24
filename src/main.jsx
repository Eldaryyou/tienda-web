import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

//iconos
import "@fortawesome/fontawesome-free/css/all.min.css";

//para bootstrap
import "./scss/styles.scss";

//letra
import "./font.css";

// import * as Bootstrap from "bootstrap";
// import Alert from "bootstrap/js/dist/alert";
// import { Tooltip, Toast, Popover } from "bootstrap";
import App from "./App.jsx";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
