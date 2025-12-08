import { useParams, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { createNote, requestContentsFromNote } from "../lib/note";

export default function Note() {
  let { noteid } = useParams();
  const navigate = useNavigate();

  // To convert from IntArry to string.
  const decoder = new TextDecoder();

  const [textAreaContent, setTextAreaContent] = useState<string>();

  // Only one time. That's why [] is empty.
  useEffect(() => {
    requestContentsFromNote(noteid).then(
      result => setTextAreaContent(decoder.decode(result))
    ).catch(
      err => console.error(err)
    );
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <button
        className="m-2 text-sm text-start p-1 px-2 rounded-md text-white hover:bg-blue-500"
        onClick={() => {
          navigate(-1);
        }}
      >
        Go back
      </button>
      <div className="flex flex-col h-full bg-neutral-100 mx-3 mb-3 rounded-xs">
        <header className="rounded items-center space-between font-mono p-2 flex bg-neutral-200">
          <p className="grow text-xs italic text-neutral-500">{ noteid?.split('.')[0] }</p>
          <button onClick={() => createOrSaveNote(noteid, textAreaContent)} className="text-xs">Save</button>
        </header>

        <div className="grow p-2 text-xs">
          <textarea value={textAreaContent} onChange={e => setTextAreaContent(e.target.value)} className="font-mono shadow-none outline-none hover:none focus:none active:none w-full h-full resize-none"></textarea>
        </div>
      </div>
    </div>
  );
}
