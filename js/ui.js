// ui.js - UI Manager Class
export default class UIManager {
    constructor() {
        this.table = document.getElementById("dataTable");
        this.thead = this.table.querySelector("thead tr");
        this.tbody = this.table.querySelector("tbody");
        this.formSection = document.getElementById("formSection");
        this.tableSection = document.getElementById("tableSection");
        this.form = document.getElementById("recordForm");
    }

    // Render table with data
    renderTable(data, sortColumn = null, sortOrder = null) {
        this.clearTable();
        
        if (data.length === 0) {
            this.renderEmptyState();
            return;
        }

        // Get all headers and ensure 'id' is first
        let headers = Object.keys(data[0]);
        
        // Remove 'id' from its current position
        headers = headers.filter(h => h !== 'id');
        
        // Add 'id' at the beginning
        headers.unshift('id');
        
        // Render headers and rows
        this.renderHeaders(headers, sortColumn, sortOrder);
        this.renderRows(data, headers);
    }

    // Render table headers with sort indicators
    renderHeaders(headers, sortColumn, sortOrder) {
        this.thead.innerHTML = "";
        
        headers.forEach(header => {
            const th = document.createElement("th");
            th.dataset.column = header;
            th.style.cursor = "pointer";
            
            // Header text
            const headerText = document.createElement("span");
            headerText.textContent = this.formatHeaderName(header);
            th.appendChild(headerText);
            
            // Sort indicator
            if (sortColumn === header) {
                const arrow = document.createElement("span");
                arrow.textContent = sortOrder === "asc" ? " ▲" : " ▼";
                arrow.style.fontSize = "0.8em";
                th.appendChild(arrow);
            }
            
            this.thead.appendChild(th);
        });
        
        // Actions column
        const actionTh = document.createElement("th");
        actionTh.textContent = "Actions";
        actionTh.style.cursor = "default";
        this.thead.appendChild(actionTh);
    }

    // Render table rows
    renderRows(data, headers) {
        data.forEach(row => {
            const tr = document.createElement("tr");
            
            // Data cells
            headers.forEach(header => {
                const td = document.createElement("td");
                td.textContent = row[header] || "";
                tr.appendChild(td);
            });
            
            // Action buttons cell
            const actionTd = document.createElement("td");
            actionTd.innerHTML = `
                <button class="editBtn" data-id="${row.id}">Edit</button>
                <button class="deleteBtn" data-id="${row.id}">Delete</button>
            `;
            tr.appendChild(actionTd);
            
            this.tbody.appendChild(tr);
        });
    }

    // Render empty state
    renderEmptyState() {
        const tr = document.createElement("tr");
        const td = document.createElement("td");
        td.colSpan = 100;
        td.textContent = "No records found";
        td.style.textAlign = "center";
        td.style.padding = "20px";
        tr.appendChild(td);
        this.tbody.appendChild(tr);
    }

    // Clear table content
    clearTable() {
        this.thead.innerHTML = "";
        this.tbody.innerHTML = "";
    }

    // Format header name (camelCase to Title Case)
    formatHeaderName(header) {
        return header
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
    }

    // Show form
    showForm() {
        this.formSection.classList.remove("hidden");
        this.tableSection.classList.add("hidden");
    }

    // Hide form
    hideForm() {
        this.formSection.classList.add("hidden");
        this.tableSection.classList.remove("hidden");
    }

    // Render form with fields
    renderForm(fields, data = {}) {
        this.form.innerHTML = "";
        
        // Hidden ID field
        const idInput = document.createElement("input");
        idInput.type = "hidden";
        idInput.name = "id";
        idInput.value = data.id || "";
        this.form.appendChild(idInput);
        
        // Create form fields
        fields.forEach(field => {
            const label = document.createElement("label");
            label.textContent = this.formatHeaderName(field);
            
            const input = document.createElement("input");
            input.type = this.getInputType(field);
            input.name = field;
            input.value = data[field] || "";
            input.required = true;
            
            this.form.appendChild(label);
            this.form.appendChild(input);
        });
        
        // Save button
        const saveBtn = document.createElement("button");
        saveBtn.type = "submit";
        saveBtn.textContent = data.id ? "Update" : "Save";
        
        // Cancel button
        const cancelBtn = document.createElement("button");
        cancelBtn.type = "button";
        cancelBtn.id = "cancelBtn";
        cancelBtn.textContent = "Cancel";
        
        this.form.appendChild(saveBtn);
        this.form.appendChild(cancelBtn);
    }

    // Get input type based on field name
    getInputType(field) {
        if (field === "email") return "email";
        if (field === "age") return "number";
        if (field === "phoneNumber") return "tel";
        return "text";
    }

    // Update pagination info
    updatePagination(currentPage, totalPages) {
        const pageInfo = document.getElementById("pageInfo");
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
        
        const prevBtn = document.getElementById("prevPage");
        const nextBtn = document.getElementById("nextPage");
        
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }

    // Show error message
    showError(message) {
        alert(`Error: ${message}`);
    }

    // Show success message
    showSuccess(message) {
        // You can implement a toast notification here
        console.log(`Success: ${message}`);
    }

    // Confirm dialog
    confirm(message) {
        return window.confirm(message);
    }
}
