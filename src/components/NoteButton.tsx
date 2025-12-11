import { DirEntry } from "@tauri-apps/plugin-fs";
import { NavLink } from "react-router";
import { Button } from "./ui/button";

interface Note {
  note: DirEntry;
}

export default function NoteLink({ note }: Note) {
  // Remove file extension
  let noteName = note.name.split(".")[0];

  return (
    <NavLink to={`/${note.name}`}>
      <Button className="w-full text-neutral-500 font-light" variant="ghost">{noteName}</Button>
    </NavLink>
  );
}
