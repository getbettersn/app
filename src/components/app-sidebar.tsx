import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { FilePlus, Filter, NotebookText, Search } from "lucide-react";
import NoteLink from "./NoteButton";

import { DirEntry } from "@tauri-apps/plugin-fs";
import { createNotesFolder, doesFolderExists, requestNotes } from "../lib/note";

export function AppSidebar() {
  const [notes, setNotes] = useState<DirEntry[]>([]);

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
    <Sidebar collapsible="offcanvas" className="bg-transparent">
      <SidebarContent className="border-none bg-transparent">
        <SidebarGroup className="bg-transparent h-full">
          {notes.length > 0 ?
            notes.map((note) => (
              <NoteLink note={note}></NoteLink>
            )) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-xs text-neutral-400">No notes found.</p>
              </div>
            )
          }
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
