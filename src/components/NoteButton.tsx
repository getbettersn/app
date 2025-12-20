import { DirEntry } from "@tauri-apps/plugin-fs";
import { Button } from "./ui/button";
import { emit } from "@tauri-apps/api/event";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { removeNote } from "@/lib/note";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Note {
  note: DirEntry;
}

type NoteSelected = {
  name: string;
};

export default function NoteLink({ note }: Note) {
  // Remove file extension
  let noteName = note.name.split(".")[0];

  function sendSelectedNote(note: string) {
    let noteSelected: NoteSelected = {
      name: note,
    };
    emit("note-selected", noteSelected);
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Button
          onClick={() => sendSelectedNote(noteName)}
          className="dark select-none w-full text-neutral-500 font-light"
          variant="ghost"
        >
          {noteName}
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent className="dark">
        <ContextMenuItem>Rename..</ContextMenuItem>
        <AlertDialog>
          <AlertDialogTrigger className="text-sm px-2 py-1.5 hover:bg-secondary w-full text-start rounded">Delete</AlertDialogTrigger>

          <AlertDialogContent className="dark">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Do you really want to delete this note?</AlertDialogTitle>
              <AlertDialogDescription>
                This will move the note to the "Trash" folder of your computer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="dark text-neutral-300">Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button onClick={() => removeNote(note.name)}>Delete</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ContextMenuContent>
    </ContextMenu>
  );
}
