import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css";
import Note from "./Note";
import { BrowserRouter, Routes, Route } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import Titlebar from "./components/titlebar";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <SidebarProvider className="flex flex-col h-screen">
        <Titlebar />
        <main className="flex grow h-full">
          <AppSidebar />
          <Routes>
            <Route index path="/" element={<Note />} />
          </Routes>
        </main>
      </SidebarProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
