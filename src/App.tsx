import { listen, emit } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";

import {
  BaseDirectory,
  exists,
  mkdir,
  writeFile,
  readDir,
  DirEntry,
} from "@tauri-apps/plugin-fs";

interface Folder {
  name: string;
  dir: string;
}

function App() {
  const [notesFolder, setNotesFolder] = useState<Folder>({
    name: "notes",
    dir: "notes",
  });

  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<DirEntry[]>([]);

  useEffect(() => {
    checkNotesFolderExists();
    readFiles();
  }, []);

  async function createNotesFolder() {
    try {
      await mkdir(notesFolder.name, {
        baseDir: BaseDirectory.AppLocalData,
      });
    } catch (error: any) {
      console.error(error);
      setMessage(error);
    }
  }

  async function checkNotesFolderExists() {
    try {
      let doesItExist = await exists(notesFolder.name, {
        baseDir: BaseDirectory.AppLocalData,
      });

      if (doesItExist) {
        setMessage("The notes folder exists. No need to create one.");
      } else {
        setMessage("The notes folder does not exist...");
        createNotesFolder();
      }
    } catch (error: any) {
      console.error(error);
      setMessage(error);
    }
  }

  async function readFiles() {
    try {
      const files = await readDir(notesFolder.name, {
        baseDir: BaseDirectory.AppLocalData,
      });
      setFiles(files);
      console.log(files);
    } catch (error: any) {
      console.error(error);
    }
  }

  function emitQuit() {
    emit("quitProgram", {
      quit: true,
    });
  }

  return (
    // this should be displayed inside the system tray menu
    <main className="pt-2 px-2 pb-1 h-screen text-sm bg-transparent flex flex-col">
      <div className="flex flex-col general h-full">
        <div className="flex flex-col pb-1 w-full border-b border-neutral-700">
          <NavLink
            className="cursor-default w-full p-1 px-2 rounded-md text-white hover:bg-blue-500"
            to="list-notes"
          >
            Browse notes
          </NavLink>
        </div>
      </div>
      <div className="danger">
        <div className="flex flex-col py-1 w-full">
          <button
            className="text-start w-full p-1 px-2 rounded-md text-white hover:bg-blue-500"
            onClick={emitQuit}
          >
            Quit
          </button>
        </div>
      </div>
    </main>
  );
}

export default App;
