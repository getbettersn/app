import { SidebarTrigger } from "./components/ui/sidebar";

function App() {
  return (
    <main className="h-screen select-none text-sm flex flex-col w-full border-neutral-600">
      <header className="flex p-3 border-b bg-yellow-100 w-full">
        <SidebarTrigger />
      </header>
      <div className="grow flex flex-col bg-yellow-200 p-5">
        <p> This is the content from the file.</p>
      </div>
    </main>
  );
}

export default App;
