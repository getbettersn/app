import { Button } from "./ui/button";
import { FilePlusCorner } from "lucide-react";

export default function ButtonCreateNote() {
  return (
    <Button className="p-0" variant="link">
      <FilePlusCorner />
    </Button>
  )
}
