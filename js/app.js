// app.js
import * as Student from "./student.js";
import * as UI from "./ui.js";
import { studentFields } from "./student.js";
document.addEventListener("DOMContentLoaded", () => {
    // Load students by default
    Student.loadStudents();

    // Add New button
    document.getElementById("addNewBtn").addEventListener("click", () => {
    UI.renderForm({}, studentFields);   
    UI.showForm();
    });


    // Cancel button
    document.addEventListener("click", (e) => {
    if (e.target.id === "cancelBtn") {
        UI.hideForm();
    }
    });

    const form = document.getElementById("recordForm");
    // Submit form
    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = Object.fromEntries(new FormData(form).entries());

    if (formData.id) {
        await Student.editStudent(formData.id, formData);
    } else {
        await Student.addStudent(formData);
    }

    UI.hideForm();

    });



    // Table action buttons (Edit/Delete)
    document.getElementById("dataTable").addEventListener("click", async (e) => {
     const id = e.target.dataset.id; 

    // ----- EDIT -----
    if (e.target.classList.contains("editBtn")) {
        const students = await Student.loadStudents();
        const student = students.find(s => s.id == id);

        UI.renderForm(student, studentFields);
        UI.showForm();
    }

    // ----- DELETE -----
    if (e.target.classList.contains("deleteBtn")) {
        if (!id) return;

        // Optional confirmation
        if (!confirm("Are you sure you want to delete this student?")) return;

        await fetch(`http://localhost:3000/students/${id}`, {
            method: "DELETE"
        });

        // Refresh table after deletion
        await Student.loadStudents(); 
    }
    });


});
