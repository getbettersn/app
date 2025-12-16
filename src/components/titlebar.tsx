import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";

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
    <header data-tauri-drag-region
      className={`p-3 pl-24 select-none flex border-b bg-sidebar w-full transition-none z-20`}>
      <SidebarTrigger />
      {/*
        TODO: Tabs component here
      */}
    </header>
  )
}
