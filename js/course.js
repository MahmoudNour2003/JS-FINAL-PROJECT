// course.js - Course Entity Class
export default class Course {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || "";
        this.duration = data.duration || "";
        this.instructorId = data.instructorId || "";
    }

    static getFields() {
        return ["name", "duration", "instructorId"];
    }

    static getEntity() {
        return "courses";
    }

    toJSON() {
        const obj = {
            name: this.name,
            duration: this.duration,
            instructorId: this.instructorId
        };
        
        // Only include id if it's a valid number (for updates)
        if (this.id && !isNaN(this.id)) {
            obj.id = parseInt(this.id);
        }
        
        return obj;
    }

    static fromJSON(data) {
        return new Course(data);
    }

    validate() {
        const errors = [];
        
        if (!this.name || this.name.trim() === "") {
            errors.push("Course name is required");
        }
        
        if (!this.duration || this.duration.trim() === "") {
            errors.push("Duration is required");
        }
        
        if (!this.instructorId) {
            errors.push("Instructor is required");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
}
