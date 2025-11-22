import { useNavigate } from "react-router";
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

export default function ListNotes() {
  const [notesFolder, setNotesFolder] = useState<Folder>({
    name: "notes",
    dir: "notes",
  });

  const [files, setFiles] = useState<DirEntry[]>([]);

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

  // TODO: Filtrar por archivos .md
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

  useEffect(() => {
    checkNotesFolderExists();
    readFiles();
  }, []);

  // TODO: Añadir una desta de carga para que no se vea feo.
  //
  const navigate = useNavigate();
  return (
    <main className="pt2 px-2 pb-1 h-screen text-sm bg-transparent flex flex-col">
      <div className="flex flex-col py-1 w-full h-full">
        <button
          className="text-start w-full p-1 px-2 rounded-md text-white hover:bg-blue-500"
          onClick={() => {
            navigate(-1);
          }}
        >
          ⬅️ Go back
        </button>
        <div className="grow flex flex-col gap-1 pt-2">
          {files.length > 0 ? (
            files.map((file) => (
              <button className="text-start px-2 text-neutral-400 hover:bg-neutral-500 hover:text-neutral-900 rounded">
                {file.name}
              </button>
            ))
          ) : (
            <div className="grow border border-neutral-700 border-dashed flex flex-col items-center justify-center">
              <div className="flex flex-col gap-2">
                <p className="text-neutral-500 text-xs">
                  It looks like there's no notes.
                </p>
                <button className="bg-blue-600 rounded text-white py-2 hover:bg-blue-500">
                  + New note
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
