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
 * Creates a new note with the `name` param provided only if there isn't another note with the same name.
 * If the name isn't provided, a new empty note will be created with the DEFAULT_NOTE_NAME.
 * @param name
 */
export async function createNote(name?: string) {
  // Comprobar si se ha aportado un nombre

  if (name) {
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
    } else {
      // TODO: Un mensaje de error o algo.
    }
  } else {
    // Solicito primero las notas
    requestNotes().then(async (notes) => {
      if (notes) {
        // Contamos el número de notas con 'Untitled'
        let count = 0;

        // Que tiene el formato Untitled + number
        // Untitled 1
        // Untitled 2
        notes.map((note: DirEntry) => {
          if (getNoteName(note) == DEFAULT_NOTE_NAME) count++;
        });

        if (count > 0) {
          // Creamos nota con count
          let nameOfNote = DEFAULT_NOTE_NAME + " " + count + ".md";
          try {
            await writeFile(
              NOTES_FOLDER.name + "/" + nameOfNote,
              encoder.encode(""),
              {
                baseDir: BaseDirectory.AppLocalData,
              },
            );
          } catch (err: any) {
            console.error(err);
          }
        } else {
          let nameOfNote = DEFAULT_NOTE_NAME + ".md";
          try {
            await writeFile(
              NOTES_FOLDER.name + "/" + nameOfNote,
              encoder.encode(""),
              {
                baseDir: BaseDirectory.AppLocalData,
              },
            );
          } catch (err: any) {
            console.error(err);
          }
        }
      } else {
        // Simplemente creamos una nueva nota con el nombre 'Untitled'
        let nameOfNote = DEFAULT_NOTE_NAME + ".md";
        try {
          await writeFile(
            NOTES_FOLDER.name + "/" + nameOfNote,
            encoder.encode(""),
            {
              baseDir: BaseDirectory.AppLocalData,
            },
          );
        } catch (err: any) {
          console.error(err);
        }
      }
    });
  }
}

/**
 * Returns the name of the note without the file extension.
 * @param note
 * @returns string
 */
function getNoteName(note: DirEntry): string {
  // separamos la extension
  let fileNameWithoutExtention = note.name.split(".")[0];
  // ahora, separamos por un espacio y el primero tiene que ser 'Untitled'
  return fileNameWithoutExtention.split(" ")[0];
}

/**
 * Checks if there is an existing note with the same name.
 * @param noteName
 * @returns void
 */
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
