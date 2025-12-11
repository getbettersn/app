import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
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
      <SidebarHeader className="text-neutral-500 flex flex-row justify-end border-b">
        <Button variant="ghost">
          <FilePlus />
        </Button>
        <Button variant="ghost">
          <Filter />
        </Button>
        <Button variant="ghost">
          <Search />
        </Button>
      </SidebarHeader>
      <SidebarContent className="border-none bg-transparent">
        <SidebarGroup className="bg-transparent">
          {notes.map((note) => (
            <NoteLink note={note}></NoteLink>
          ))}
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
