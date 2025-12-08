import { emit } from "@tauri-apps/api/event";
import { useEffect, useState } from "react";
import { NavLink } from "react-router";

import {
  BaseDirectory,
  exists,
  mkdir,
  readDir,
  DirEntry,
} from "@tauri-apps/plugin-fs";
import { Button } from "./components/ui/button";

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
    <main className="select-none pt-2 px-2 pb-1 h-screen text-sm flex flex-col">
      <div className="flex flex-col general h-full">
        <div className="flex flex-col pb-1 w-full">
          <NavLink
            className="cursor-default w-full p-1 px-2 rounded-md text-white hover:bg-blue-500"
            to="notes"
          >
            Browse notes
          </NavLink>
        </div>
        <div className="m-2 flex flex-col h-full bg-neutral-800 border border-neutral-700 p-4 items-center justify-center rounded">
          <div className="flex flex-col items-center gap-2">
            <h1 className="rounded text-4xl font-serif text-white">sn</h1>
            <div className="text-xs dark:text-neutral-300 font-light flex flex-col text-center">
            </div>
          </div>
        </div>
      </div>
      <div className="danger">
        <div className="flex flex-col w-full pb-1">
          <Button onClick={emitQuit} variant="ghost" className="text-white text-start mx-1 px-2 hover:bg-lime-300/75 backdrop-blur-3xl">
            Quit
          </Button>
        </div>
      </div>
    </main>
  );
}

export default App;
