import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import ListNotes from "./ListNotes";
import {
  createNotesFolder,
  saveNote,
  createNote,
  doesFolderExists,
  requestNotes,
  type Folder,
} from "../lib/note";

import {
  BaseDirectory,
  exists,
  mkdir,
  writeFile,
  readDir,
  DirEntry,
} from "@tauri-apps/plugin-fs";

export default function Notes() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState<DirEntry[]>([]);

  function handleCreateNote() {
    // here we need to go and create a new note
  }

  // Load just only one time. That's why [] is empty.
  useEffect(() => {
    doesFolderExists().then((response) => {
      response
        ? requestNotes()
            .then((notes) => {
              setNotes(notes);
            })
            .catch((err) => console.error(err))
        : createNotesFolder();
    });
  });

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
        {notes.length > 0 ? (
          <button
            className="mx-2 mb-2 text-sm text-start p-1 px-2 rounded-md text-white hover:bg-blue-500"
            onClick={() => {
              createNote("Oracle es lo peo");
            }}
          >
            Create new note
          </button>
        ) : (
          ""
        )}

        <div className="border-t border-neutral-700 mx-2 grow flex flex-col">
          <ListNotes notes={notes} />
        </div>
      </div>
    </main>
  );
}
