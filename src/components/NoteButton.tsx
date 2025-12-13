import { DirEntry } from "@tauri-apps/plugin-fs";
import { Button } from "./ui/button";
import { emit } from "@tauri-apps/api/event";

interface Note {
  note: DirEntry;
}

type NoteSelected = {
  name: string
}

export default function NoteLink({ note }: Note) {

  // Remove file extension
  let noteName = note.name.split(".")[0];

  function sendSelectedNote(note: string) {
    let noteSelected : NoteSelected = {
      name: note
    }
    emit('note-selected', noteSelected)
  }

  return (
    <Button onClick={() => sendSelectedNote(noteName)} className="w-full text-neutral-500 font-light" variant="ghost">
      {noteName}
    </Button>
  );
}
