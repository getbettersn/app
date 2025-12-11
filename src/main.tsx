import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import App from "./App";
import { BrowserRouter, Routes, Route } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <SidebarProvider className="bg-transparent">
        <AppSidebar />
        <Routes>
          <Route index path="/" element={<App />} />
        </Routes>
      </SidebarProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
