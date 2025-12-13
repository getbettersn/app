import { useState } from "react";
import { SidebarTrigger } from "./components/ui/sidebar";
import { listen } from "@tauri-apps/api/event";
import { requestContentsFromNote } from "./lib/note";
import { Button } from "./components/ui/button";

type NoteSelected = {
  name: string;
};

export default function Note() {
  const [textareaValue, setTextareaValue] = useState("");

  listen<NoteSelected>(
    "note-selected",
    (event) => {
      // convert the name of the file
      let noteNameFormatted = event.payload.name.toUpperCase() + ".md";
      requestContentsFromNote(noteNameFormatted)
        .then((r) => {
          setTextareaValue(r ? r : "There's no content inside...");
        })
        .catch((err) => {
          console.error(err);
        });
    },
    {
      target: { kind: "Any" },
    },
  );

  return (
    <main className="h-screen select-none text-sm flex flex-col w-full border-neutral-600">
      <header className="flex p-3 border-b bg-sidebar w-full">
        <SidebarTrigger />
      </header>
      {
        textareaValue ? (
        <div className="grow flex flex-col bg-yellow-200 p-5">
          <textarea
            defaultValue={"Select a note to start"}
            className="h-full"
            value={textareaValue}
          ></textarea>
        </div>
        ) : (
          <div className="grow flex flex-col justify-center items-center bg-neutral-100 p-5">
            <div className="flex flex-col gap-1 justify-center items-center">
            <Button variant="link">Create new note (Cmd + N)</Button>
            <Button variant="link">Go to note (Cmd + O)</Button>
            <Button variant="link">Close (Cmd + Q)</Button>
            </div>
          </div>
        )
      }

    </main>
  );
}
