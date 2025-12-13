import {
  BaseDirectory,
  exists,
  mkdir,
  writeFile,
  readDir,
  readFile,
  DirEntry,
} from "@tauri-apps/plugin-fs";

/**
 * Default 'notes' folder location.
 * @type Folder
 */
const NOTES_FOLDER: Folder = {
  name: "notes",
  dir: "notes",
};
const encoder = new TextEncoder();

/**
 * Saves a note. If the note doesn't exit, it creates a new one.
 * @param note_name The name of the note.
 * @param content The content to write inside the note.
 */
export async function saveNote(
  note_name: string | undefined = "Untitled",
  content: string | undefined,
) {
  try {
    await writeFile(
      NOTES_FOLDER.name + "/" + note_name,
      encoder.encode(content),
      {
        baseDir: BaseDirectory.AppLocalData,
      },
    );
  } catch (err: any) {
    console.error(err);
  }
}

/**
 * Creates a new note with the `name` param provided only if there isn't another note with the same name..
 * @param name
 */
export async function createNote(name: string) {
  // Add file extension
  name = name.trim() + ".md";

  // comprobar que el archivo no exista
  if (!doesNoteExists(name)) {
    try {
      await writeFile(NOTES_FOLDER.name + "/" + name, encoder.encode(""), {
        baseDir: BaseDirectory.AppLocalData,
      });
    } catch (err: any) {
      console.error(err);
    }
  }
}

function doesNoteExists(noteName: string): boolean {
  let doesItExist: boolean = false;

  requestNotes().then((notes) => {
    if (notes.length > 0) {
      notes.map((note) => {
        if (note.name == noteName) {
          doesItExist = true;
        } else {
          doesItExist = false;
        }
      });
    } else {
      doesItExist = false;
    }
  });

  return doesItExist;
}

/**
 * Representer a Folder object.
 * @interface Folder
 */
export interface Folder {
  name: string;
  dir: string;
}

/**
 * Create folder to save the notes.
 * @param folder Folder
 * @returns void
 * @default NOTES_FOLDER
 **/
export async function createNotesFolder(folder: Folder = NOTES_FOLDER) {
  try {
    await mkdir(folder.name, {
      baseDir: BaseDirectory.AppLocalData,
    });
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * Requests the content from inside the note.
 * @param noteName
 * @returns string
 */
export async function requestContentsFromNote(noteName: string | undefined) {
  try {
    const decoder = new TextDecoder();
    let contents = await readFile(NOTES_FOLDER.name + "/" + noteName, {
      baseDir: BaseDirectory.AppLocalData,
    });
    return decoder.decode(contents);
  } catch (error: any) {
    console.error(error);
  }
}

/**
 * Checks if the 'notes' folder exists.
 * @param folder
 * @returns Promise<Boolean, Error>
 */
export async function doesFolderExists(
  folder: Folder = NOTES_FOLDER,
): Promise<boolean> {
  try {
    return await exists(folder.name, {
      baseDir: BaseDirectory.AppLocalData,
    });
  } catch (error: any) {
    console.error(error);
    return error;
  }
}

/**
 * Returns all the containing notes inside the 'notes' folder.
 * @param folder Where to seach for the notes. Default dir: `notes`.
 * @returns Promise<DirEnty[] | undefined>
 */
export async function requestNotes(
  folder: Folder = NOTES_FOLDER,
): Promise<DirEntry[]> {
  try {
    return await readDir(folder.name, {
      baseDir: BaseDirectory.AppLocalData,
    });
  } catch (error: any) {
    return error;
  }
}
