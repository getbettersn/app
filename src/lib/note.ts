import {
  BaseDirectory,
  exists,
  mkdir,
  writeFile,
  readDir,
  readFile,
  DirEntry,
  remove,
} from "@tauri-apps/plugin-fs";
import { n } from "node_modules/react-router/dist/development/index-react-server-client-rcoGPJhU.d.mts";

/**
 * Representer a Folder object.
 * @interface Folder
 */
export interface Folder {
  name: string;
  dir: string;
}

/**
 * Default 'notes' folder location.
 * @type Folder
 */
const NOTES_FOLDER: Folder = {
  name: "notes",
  dir: "notes",
};
const DEFAULT_NOTE_NAME = "Untitled";

export interface Note {
  note: DirEntry;
}

const encoder = new TextEncoder();

/**
 * Saves a note. If the note doesn't exit, it creates a new one.
 * @param note_name The name of the note.
 * @param content The content to write inside the note.
 */
export async function saveNote(
  note_name: string | undefined = DEFAULT_NOTE_NAME,
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
 * Removes a note from the default folder.
 * @param note_name - The full note name "note.md"
 */
export async function removeNote(note_name: string) {
  try {
    await remove(NOTES_FOLDER.name + "/" + note_name, {
      baseDir: BaseDirectory.AppLocalData,
    });
  } catch (err: any) {
    console.error(err);
  }
}

/**
 * Returns the number of notes with DEFAULT_NOTE_NAME
 * provided by the default note builder (Untitled, Untitled 1...)
 * given a list of notes.
 * @param notes DirEntry[]
 * @returns number
 */
function getNumberOfNotesWithUntitled(notes: DirEntry[]): number {
  let count = 0;
  notes.map((note: DirEntry) => {
    if (getFirstWordOfNote(note) == DEFAULT_NOTE_NAME) count++;
  });
  return count;
}

/**
 * Creates a new default note with the DEFAULT_NOTE_NAME.
 * @constant DEFAULT_NOTE_NAME
 */
async function createUntitledNote() {
  let notes = await requestNotes();

  if (notes) {
    let nOfNotesWithUntitled = getNumberOfNotesWithUntitled(notes);

    if (nOfNotesWithUntitled > 0) {
      // Mientras exista una nota con el mismo nombre,
      // vamos cambiando el valor de nOfNotesWithUntitled
      console.log("Checking...");
      let bool = await doesNoteExists(
        DEFAULT_NOTE_NAME + " " + nOfNotesWithUntitled,
      );

      console.log(bool)
      console.log(DEFAULT_NOTE_NAME + " " + nOfNotesWithUntitled)
      while (bool) {
        console.log("Notes exists");
        nOfNotesWithUntitled++;
      }

      createNote(DEFAULT_NOTE_NAME + " " + nOfNotesWithUntitled);
    } else {
      let nameOfNote = DEFAULT_NOTE_NAME;
      createNote(nameOfNote);
    }
  } else {
    // Simplemente creamos una nueva nota con el nombre 'Untitled'
    let nameOfNote = DEFAULT_NOTE_NAME;
    createNote(nameOfNote);
  }
}

/**
 * Creates a new note with the `name` param provided only if there isn't another note with the same name.
 * If the name isn't provided, a new empty note will be created with the DEFAULT_NOTE_NAME.
 * @param name
 */
export async function createNote(name?: string) {
  if (name) {
    // TODO: Importante comprobar si existe un archiv con el mismo
    // nombre.
    // `writeFile` sobrescribirá el archivo si ya existe un archivo
    // con el mismo nombre.
    try {
      await writeFile(
        NOTES_FOLDER.name + "/" + name + ".md",
        encoder.encode(""),
        {
          baseDir: BaseDirectory.AppLocalData,
        },
      );
    } catch (err: any) {
      console.error(err);
    }
  } else {
    createUntitledNote();
  }
}

/**
 * Returns the first String of the note name provided. Used by the createUntitledNote function.
 * @example
 * // Note name with spaces
 * 'Todo List.md' --> 'Todo'
 * // Note name without space
 * 'CS-112.md' --> 'CS-112'
 * @param note
 * @returns string
 */
function getFirstWordOfNote(note: DirEntry): string {
  let fileNameWithoutExtention = getNoteName(note);
  return fileNameWithoutExtention.split(" ")[0];
}

/**
 * Returns the note name without the extension.
 * @param note
 */
function getNoteName(note: DirEntry): string {
  return note.name.split(".")[0];
}

/**
 * Checks if there is an existing note with the same name.
 * @param noteName
 * @returns void
 */
async function doesNoteExists(noteName: string): Promise<boolean> {
  let doesItExist: boolean = false;

  let notes = await requestNotes();

  if (notes.length > 0) {
    notes.map((note) => {
      console.log("Comparing...")
      if (getNoteName(note) == noteName) {
        console.log(getNoteName(note))
        console.log(noteName);

        doesItExist = true;
        return doesItExist;
      } else {
        doesItExist = false;
      }
    });
  } else {
    doesItExist = false;
  }

  return doesItExist;
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
