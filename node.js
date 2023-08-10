const btnElement = document.getElementById("btn");
const appElement = document.getElementById("app");

async function initializeNotes() {
  let myNotes = await getNotes();

  myNotes.forEach((note) => {
    const noteElement = createNoteElement(note.id, note.content);
    appElement.insertBefore(noteElement, btnElement);
  });
}

function createNoteElement(id, content) {
  const element = document.createElement("textarea");
  element.classList.add("note");
  element.placeholder = "Empty Note";
  element.value = content;

  element.addEventListener("dblclick", async () => {
    const warning = confirm("Do You Want To Delete This Note?");
    if (warning) {
      const noteElement = element;
      await deleteNote(id, noteElement);
    }
  });

  element.addEventListener("input", () => {
    updateNote(id, element.value);
  });

  return element;
}

async function deleteNote(id, element) {
  const myNotes = await getNotes();
  const updateNotes = myNotes.filter((note) => note.id != id);

  await saveNoteOnLocal(updateNotes);

  appElement.removeChild(element);
}

async function updateNote(id, content) {
  let myNotes = await getNotes();
  const target = myNotes.find((note) => note.id == id);

  if (target) {
    target.content = content;
    await saveNoteOnLocal(myNotes);
  }
}

async function addNote() {
  const myNotes = await getNotes();

  const noteObj = {
    id: Math.floor(Math.random() * 100000),
    content: "",
  };

  const noteElement = createNoteElement(noteObj.id, noteObj.content);
  appElement.insertBefore(noteElement, btnElement);
  myNotes.push(noteObj);

  await saveNoteOnLocal(myNotes);
}

async function saveNoteOnLocal(myNotes) {
  await browser.storage.local.set({ myNotes });
}

async function getNotes() {
  try {
    const result = await browser.storage.local.get("myNotes");
    return result.myNotes || [];
  } catch (error) {
    console.error("Error retrieving notes:", error);
    return [];
  }
}

initializeNotes();

btnElement.addEventListener("click", addNote);
