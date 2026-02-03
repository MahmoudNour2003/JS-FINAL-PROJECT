// student.js
import * as API from "./api.js";
import * as UI from "./ui.js";
export const studentFields = [
    "name",
    "email",
    "age",
    "phoneNumber"
];

const ENTITY = "students"; // json-server endpoint

export async function loadStudents() {
    const students = await API.getData(ENTITY);
    if (students.length) {
        const headers = Object.keys(students[0]);
        UI.renderTable(headers, students);
    }
    return students; // <-- return the array
}


export async function addStudent(data) {
    delete data.id;
    await API.createData(ENTITY, data);
    await loadStudents();
}

export async function editStudent(id, data) {
    await API.updateData(ENTITY, id, data);
    await loadStudents();
}

export async function removeStudent(id) {
    const confirmed = confirm("Are you sure you want to delete?");
    if (!confirmed) return;
    await API.deleteData(ENTITY, id);
    await loadStudents();
}
