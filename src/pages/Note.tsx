import { useParams, useNavigate } from "react-router";
import { BaseDirectory, readFile } from "@tauri-apps/plugin-fs";
import { useEffect, useState } from "react";

export default function Note() {

  let { noteid } = useParams();

  const decoder = new TextDecoder();
  const [contents, setContents] = useState<ArrayBuffer>();
  const [str, setStr] = useState<String>();

  // TODO: Read the contents from the file...
  async function readContentsFromFile() {
    try {
      let file_contents = await readFile('notes/' + noteid, {
        baseDir: BaseDirectory.AppLocalData
      })
      setContents(file_contents)
    } catch (error: any) {
      console.error(error)
    }
  }

  useEffect(() => {
    readContentsFromFile()
    setStr(decoder.decode(contents))
  })

  const navigate = useNavigate();

  return (
    <>
      <button
        className="text-start w-full p-1 px-2 rounded-md text-white hover:bg-blue-500"
        onClick={() => {
          navigate(-1);
        }}
      >
        Go back
      </button>
      <h1 className="text-white">{ noteid }</h1>
      <p>{ str }</p>
    </>
  )
}
