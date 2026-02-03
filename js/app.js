// app.js - Main Application Entry Point
import Student from "./student.js";
import Course from "./course.js";
import Instructor from "./instructor.js";
import Employee from "./employee.js";
import DataTableController from "./dataTableController.js";

// Application Class
class Application {
    constructor() {
        this.currentController = null;
        this.currentEntity = null;
    }

    // Initialize the application
    init() {
        this.setupNavigationListeners();
        this.loadStudents(); // Load students by default
    }

    // Setup navigation button listeners
    setupNavigationListeners() {
        const navButtons = {
            studentsBtn: Student,
            // Add other entities here when ready:
            coursesBtn: Course,
            instructorsBtn: Instructor,
            employeesBtn: Employee
        };

        Object.keys(navButtons).forEach(btnId => {
            const button = document.getElementById(btnId);
            if (button) {
                button.addEventListener("click", () => {
                    this.loadEntity(navButtons[btnId]);
                });
            }
        });
    }

    // Load entity data
    async loadEntity(EntityClass) {
        this.currentEntity = EntityClass;
        
        // Create new controller for this entity
        this.currentController = new DataTableController(EntityClass);
        
        // Initialize and load data
        await this.currentController.init();
    }

    // Load students (default view)
    async loadStudents() {
        await this.loadEntity(Student);
    }
}

// Initialize application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const app = new Application();
    app.init();
});
