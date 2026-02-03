// instructor.js - Instructor Entity Class
export default class Instructor {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || "";
        this.email = data.email || "";
        this.specialization = data.specialization || "";
    }

    static getFields() {
        return ["name", "email", "specialization"];
    }

    static getEntity() {
        return "instructors";
    }

    toJSON() {
        const obj = {
            name: this.name,
            email: this.email,
            specialization: this.specialization
        };
        
        // Only include id if it's a valid number (for updates)
        if (this.id && !isNaN(this.id)) {
            obj.id = parseInt(this.id);
        }
        
        return obj;
    }

    static fromJSON(data) {
        return new Instructor(data);
    }

    validate() {
        const errors = [];
        
        if (!this.name || this.name.trim() === "") {
            errors.push("Name is required");
        }
        
        if (!this.email || this.email.trim() === "") {
            errors.push("Email is required");
        } else if (!this.isValidEmail(this.email)) {
            errors.push("Email is not valid");
        }
        
        if (!this.specialization || this.specialization.trim() === "") {
            errors.push("Specialization is required");
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
