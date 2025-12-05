import { DirEntry } from "@tauri-apps/plugin-fs";
import { NavLink } from "react-router";

interface Note {
  note: DirEntry
}

export default function NoteLink({ note }: Note) {

  // Remove file extension
  let noteName = note.name.split('.')[0]

  return (
    <NavLink
      className="border-b border-neutral-700 flex items-center h-8 px-2 text-neutral-400 hover:bg-neutral-500 hover:text-neutral-900 font-serif"
      to={`/${note.name}`}
    >
      ▸ {noteName}
    </NavLink>
  );
}
