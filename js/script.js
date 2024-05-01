const form = document.querySelector("#form");
const noteInput = document.querySelector("#note_input");
const noteList = document.querySelector(".notes_list");
let notes = [];
if(localStorage.getItem("notes")){
    notes = JSON.parse(localStorage.getItem("notes"))
};
notes.forEach(note => {
    const cssClass = note.statusNote ? "note_text note_status" : "note_text"
    const noteHTML = `
            <li id="${note.idNote}" class="note">
            <span class="${cssClass}">${note.textNote}</span>
            <div class="buttons">
                <button class="done" data-action="status">
                    <img src="./icons/icon-done.svg" alt="Выполненно" width="20" height="20" class="icon_status">
                </button>
                <button class="delete" data-action="delete">
                    <img src="./icons/icon-delete.svg" alt="Удалить" width="20" height="20" class="icon_delete">
                </button>
            </div>
        </li>
    `;
    noteList.insertAdjacentHTML("beforeend", noteHTML);
});
let validation = new JustValidate("#form",{
    errorLabelStyle: {
        color: "var(--error-color)"
    }
});
validation.addField("#note_input",[
    {
        rule: "required",
        errorMessage: "Введите текст заметки"
    },
    {
        rule: "minLength",
        value: 1,
        // errorMessage: "Минимум  символа"
    },
])
.onSuccess(() => {
    addNote()
});

noteList.addEventListener("click", deleteNote);
noteList.addEventListener("click", doneNote);

function addNote () {
    const noteText = noteInput.value;
    const newNote = {
        idNote: Date.now(),
        textNote: noteText,
        statusNote: false
    };

    const cssClass = newNote.statusNote ? "note_text note_status" : "note_text"
    const noteHTML = `
            <li id="${newNote.idNote}" class="note">
            <span class="${cssClass}">${newNote.textNote}</span>
            <div class="buttons">
                <button class="done" data-action="status">
                    <img src="./icons/icon-done.svg" alt="Выполненно" width="20" height="20" class="icon_status">
                </button>
                <button class="delete" data-action="delete">
                    <img src="./icons/icon-delete.svg" alt="Удалить" width="20" height="20" class="icon_delete">
                </button>
            </div>
        </li>
    `;
    notes.push(newNote)
    saveInLocalStorage()
    noteList.insertAdjacentHTML("beforeend", noteHTML);
    noteInput.value = "";
    noteInput.focus();
};
function deleteNote (e) {
    if(e.target.dataset.action === "delete"){
        const parentElem = e.target.closest("li");
        const id = Number(parentElem.id);
        const index = notes.findIndex((note) => {
            if(note.idNote === id){
                return true
            }
        })
        notes.splice(index,1)
        saveInLocalStorage()
        parentElem.remove()
        
    }
};
function doneNote (e) {
    if(e.target.dataset.action === "status"){
        const parentElem = e.target.closest("li");
        const id = Number(parentElem.id);
        const note = notes.find((note) => {
            if(note.idNote === id){
                return true
            }
        })
        note.statusNote = !note.statusNote
        const titleNote = parentElem.querySelector(".note_text");
        titleNote.classList.toggle("note_status");
    }
    saveInLocalStorage()
}
function saveInLocalStorage () {
  localStorage.setItem("notes",JSON.stringify(notes));  
}

