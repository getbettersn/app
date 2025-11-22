import "./App.css";
import { listen, emit } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";

function App() {
  const [markdown, setMarkdown] = useState("Nothing");

  useEffect(() => {
    console.log("Executed")
    listen<string>('ready', (event) => {
    console.log("The page is ready")
  }) });
  

  function emitQuit() {
    emit("quitProgram", {
      quit: true,
    });
  }

  return (
    // this should be displayed inside the system tray menu
    <main className="container">
      <h1>Hello system tray {markdown} </h1>
      <button onClick={emitQuit}>Exit</button>
    </main>
  );
}

export default App;
