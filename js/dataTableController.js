// dataTableController.js - Controller for DataTable operations
import API from "./api.js";
import UIManager from "./ui.js";

export default class DataTableController {
    constructor(EntityClass) {
        this.EntityClass = EntityClass;
        this.api = new API();
        this.ui = new UIManager();
        
        // State
        this.currentPage = 1;
        this.recordsPerPage = 10;
        this.sortColumn = null;
        this.sortOrder = "asc";
        this.searchQuery = "";
        this.totalRecords = 0;
        
        this.initializeEventListeners();
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Add New button
        document.getElementById("addNewBtn").addEventListener("click", () => {
            this.handleAddNew();
        });

        // Search input
        document.getElementById("searchInput").addEventListener("input", (e) => {
            this.handleSearch(e.target.value);
        });

        // Pagination buttons
        document.getElementById("prevPage").addEventListener("click", () => {
            this.handlePreviousPage();
        });

        document.getElementById("nextPage").addEventListener("click", () => {
            this.handleNextPage();
        });

        // Table events (edit, delete, sort)
        this.ui.table.addEventListener("click", (e) => {
            this.handleTableClick(e);
        });

        // Form submit
        this.ui.form.addEventListener("submit", (e) => {
            this.handleFormSubmit(e);
        });

        // Cancel button (delegated)
        document.addEventListener("click", (e) => {
            if (e.target.id === "cancelBtn") {
                this.ui.hideForm();
            }
        });
    }

    // Load records from server
    async loadRecords() {
        try {
            const params = {
                page: this.currentPage,
                limit: this.recordsPerPage
            };

            // Add search if exists
            if (this.searchQuery) {
                params.search = this.searchQuery;
            }

            // Add sort if exists
            if (this.sortColumn) {
                params.sort = this.sortColumn;
                params.order = this.sortOrder;
            }

            const result = await this.api.get(this.EntityClass.getEntity(), params);
            
            this.totalRecords = result.totalCount;
            this.ui.renderTable(result.data, this.sortColumn, this.sortOrder);
            this.updatePaginationUI();
            
            return result.data;
        } catch (error) {
            this.ui.showError("Failed to load records");
            console.error(error);
        }
    }

    // Handle add new record
    handleAddNew() {
        this.ui.renderForm(this.EntityClass.getFields(), {});
        this.ui.showForm();
    }

    // Handle search
    async handleSearch(query) {
        this.searchQuery = query.trim();
        this.currentPage = 1; // Reset to first page
        await this.loadRecords();
    }

    // Handle previous page
    async handlePreviousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            await this.loadRecords();
        }
    }

    // Handle next page
    async handleNextPage() {
        const totalPages = this.getTotalPages();
        if (this.currentPage < totalPages) {
            this.currentPage++;
            await this.loadRecords();
        }
    }

    // Handle table clicks (edit, delete, sort)
    async handleTableClick(e) {
        const target = e.target;

        // Edit button
        if (target.classList.contains("editBtn")) {
            await this.handleEdit(target.dataset.id);
        }

        // Delete button
        else if (target.classList.contains("deleteBtn")) {
            await this.handleDelete(target.dataset.id);
        }

        // Column header (sort)
        else if (target.tagName === "TH" && target.dataset.column) {
            await this.handleSort(target.dataset.column);
        }
    }

    // Handle edit record
    async handleEdit(id) {
        try {
            // Fetch single record
            const result = await this.api.get(this.EntityClass.getEntity() + `/${id}`);
            const recordData = result.data;
            
            this.ui.renderForm(this.EntityClass.getFields(), recordData);
            this.ui.showForm();
        } catch (error) {
            this.ui.showError("Failed to load record for editing");
            console.error(error);
        }
    }

    // Handle delete record
    async handleDelete(id) {
        if (!this.ui.confirm("Are you sure you want to delete this record?")) {
            return;
        }

        try {
            await this.api.delete(this.EntityClass.getEntity(), id);
            this.ui.showSuccess("Record deleted successfully");
            
            // If current page becomes empty, go to previous page
            const totalPages = this.getTotalPages();
            if (this.currentPage > totalPages && this.currentPage > 1) {
                this.currentPage--;
            }
            
            await this.loadRecords();
        } catch (error) {
            this.ui.showError("Failed to delete record");
            console.error(error);
        }
    }

    // Handle sort
    async handleSort(column) {
        // Toggle sort order if same column
        if (this.sortColumn === column) {
            this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
        } else {
            this.sortColumn = column;
            this.sortOrder = "asc";
        }

        await this.loadRecords();
    }

    // Handle form submit (create or update)
    async handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.ui.form);
        const data = Object.fromEntries(formData.entries());
        
        // Remove empty id
        if (!data.id || data.id.trim() === '') {
            delete data.id;
        }
        
        // Create entity instance
        const entity = new this.EntityClass(data);
        
        // Validate
        const validation = entity.validate();
        if (!validation.isValid) {
            this.ui.showError(validation.errors.join("\n"));
            return;
        }

        try {
            if (data.id) {
                // Update existing
                await this.api.put(this.EntityClass.getEntity(), data.id, entity.toJSON());
                this.ui.showSuccess("Record updated successfully");
            } else {
                // Create new
                await this.api.post(this.EntityClass.getEntity(), entity.toJSON());
                this.ui.showSuccess("Record created successfully");
            }

            this.ui.hideForm();
            await this.loadRecords();
        } catch (error) {
            this.ui.showError("Failed to save record");
            console.error(error);
        }
    }

    // Update pagination UI
    updatePaginationUI() {
        const totalPages = this.getTotalPages();
        this.ui.updatePagination(this.currentPage, totalPages);
    }

    // Get total pages
    getTotalPages() {
        return Math.ceil(this.totalRecords / this.recordsPerPage) || 1;
    }

    // Initialize the controller
    async init() {
        await this.loadRecords();
    }
}
