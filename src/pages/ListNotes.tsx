import { DirEntry } from "@tauri-apps/plugin-fs";
import NoteLink from "../components/NoteLink";

interface Notes {
  notes: DirEntry[];
}

export default function ListNotes({ notes }: Notes) {
  if (notes.length > 0) {
    return (
      <div className="select-none">
        {notes.map((note) => (
          <NoteLink note={note}></NoteLink>
        ))}
        <span className="p-2  text-xs text-neutral-600">{ notes.length } entries</span>
      </div>
    );
  } else {
    return (
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
    );
  }
}
