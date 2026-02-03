// employee.js - Employee Entity Class
export default class Employee {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || "";
        this.email = data.email || "";
        this.position = data.position || "";
    }

    static getFields() {
        return ["name", "email", "position"];
    }

    static getEntity() {
        return "employees";
    }

    toJSON() {
        const obj = {
            name: this.name,
            email: this.email,
            position: this.position
        };
        
        // Only include id if it's a valid number (for updates)
        if (this.id && !isNaN(this.id)) {
            obj.id = parseInt(this.id);
        }
        
        return obj;
    }

    static fromJSON(data) {
        return new Employee(data);
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
        
        if (!this.position || this.position.trim() === "") {
            errors.push("Position is required");
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
