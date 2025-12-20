import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import ButtonCreateNote from "./cn-button";

export default function Titlebar() {
  const {
    state,
    open,
    setOpen,
    openMobile,
    setOpenMobile,
    isMobile,
    toggleSidebar,
  } = useSidebar();

  return (
    <header
      data-tauri-drag-region
      className="select-none flex border-b bg-sidebar w-full transition-none z-20"
    >
      <div
        className={`p-3 border-r ${open ? "w-(--sidebar-width)" : "w-44"} flex gap-2 justify-end items-center transition-all`}
      >
        <ButtonCreateNote />
        <SidebarTrigger />
      </div>
      <div className=" bg-neutral-800 text-neutral-300 px-4 flex items-center">
        <div>
          <span className="text-xs">New tab</span>
        </div>
      </div>
      {/*
        TODO: Tabs component here
      */}
    </header>
  );
}
