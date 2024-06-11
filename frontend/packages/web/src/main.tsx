import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app.tsx";

import { aixosInterceptors } from "@lcp/apis";

aixosInterceptors();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
