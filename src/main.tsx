import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router";
import ListNotes from "./pages/ListNotes";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<App />} />
        <Route path="list-notes" element={<ListNotes />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
