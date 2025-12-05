import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import ListNotes from "./ListNotes";

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

export default function Notes() {

  const navigate = useNavigate();

  const [files, setFiles] = useState<DirEntry[]>([]);

  const notesFolder : Folder = {
    name: "notes",
    dir: "notes"
  }

  // When there is no 'notes' folder created
  async function createNotesFolder() {
    try {
      await mkdir(notesFolder.name, {
        baseDir: BaseDirectory.AppLocalData,
      });
    } catch (error: any) {
      console.error(error);
    }
  }

  // Create a new note function
  function handleCreateNote() {
    alert("Hello")
  }

  // Check if there is content inside the 'notes' folder.
  async function checkNotesFolderExists() {
    try {
      let doesItExist = await exists(notesFolder.name, {
        baseDir: BaseDirectory.AppLocalData,
      });

      if (doesItExist) {
        // TODO: Find a way to display errors.
      } else {
        createNotesFolder();
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  // Read the files from the 'notes' folder
  async function readFiles() {
    try {
      const files = await readDir(notesFolder.name, {
        baseDir: BaseDirectory.AppLocalData,
      });
      setFiles(files);
    } catch (error: any) {
      // TODO: Pass errors to error component.
      console.error(error);
    }
  }

  // Load just only one time. That's why [] is empty.
  useEffect(() => {
    checkNotesFolderExists();
    readFiles();
  }, []);

  return (
    <main className="pt2 pb-1 h-screen text-sm bg-transparent flex flex-col">
      <div className="flex flex-col py-1 w-full h-full">
        <button
          className="mx-2 mt-1 text-sm text-start p-1 px-2 rounded-md text-white hover:bg-blue-500"
          onClick={() => {
            navigate(-1);
          }}
        >
          Go back
        </button>
        <button
          className="mx-2 mb-2 text-sm text-start p-1 px-2 rounded-md text-white hover:bg-blue-500"
          onClick={() => {
            handleCreateNote()
          }}
        >
         Create new note +
        </button>
        <div className="border-t border-neutral-700 mx-2 grow flex flex-col">
          <ListNotes notes={files} />
        </div>
      </div>
    </main>
  );
}
