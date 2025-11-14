import "./App.css";
import { emit } from "@tauri-apps/api/event";

function App() {

  function emitQuit() {
    emit('quitProgram', {
      'quit': true
    })
  }

  return (
    // this should be displayed inside the system tray menu
    <main className="container">
      <h1>Hello system tray</h1>
      <button onClick={emitQuit}>Exit</button>
    </main>
  );
}

export default App;
