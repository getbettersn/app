import { createNote } from "@/lib/note";
import { Button } from "./ui/button";
import { FilePlusCorner } from "lucide-react";

export default function ButtonCreateNote() {
  return (
    <Button onClick={() => createNote()} className="p-0" variant="link">
      <FilePlusCorner />
    </Button>
  )
}
