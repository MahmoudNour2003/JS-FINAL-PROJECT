# Students Affairs System - OOP Architecture

## 📋 Project Overview
A web-based system for managing Students, Courses, Instructors, and Employees using Object-Oriented Programming principles with ES6 JavaScript modules.

## 🏗️ Architecture

### Class-Based Structure

#### 1. **API Class** (`api.js`)
- Handles all HTTP requests to json-server
- Methods:
  - `get(entity, params)` - GET with query parameters
  - `post(entity, data)` - POST for creating
  - `put(entity, id, data)` - PUT for updating
  - `delete(entity, id)` - DELETE for removing
  - `buildQueryString(params)` - Builds query string for pagination, search, sort

#### 2. **Entity Classes** (Student, Course, Instructor, Employee)
Each entity class contains:
- Constructor for object initialization
- `getFields()` - Static method returning form fields
- `getEntity()` - Static method returning API endpoint name
- `toJSON()` - Converts instance to plain object for API
- `fromJSON(data)` - Creates instance from API response
- `validate()` - Validates entity data before saving

#### 3. **UIManager Class** (`ui.js`)
- Manages all DOM manipulations
- Methods:
  - `renderTable(data, sortColumn, sortOrder)` - Renders data table
  - `renderHeaders()` - Renders table headers with sort indicators
  - `renderRows()` - Renders table rows
  - `showForm()` / `hideForm()` - Toggle form visibility
  - `renderForm(fields, data)` - Dynamically creates form
  - `updatePagination()` - Updates pagination UI
  - `showError()` / `showSuccess()` - User feedback

#### 4. **DataTableController Class** (`dataTableController.js`)
- Main controller coordinating all operations
- State management:
  - `currentPage` - Current page number
  - `recordsPerPage` - Records per page (10)
  - `sortColumn` - Current sort column
  - `sortOrder` - Sort direction (asc/desc)
  - `searchQuery` - Current search term
  - `totalRecords` - Total record count from server

- Methods:
  - `loadRecords()` - Fetches data from server with params
  - `handleSearch()` - Handles search functionality
  - `handleSort()` - Handles column sorting
  - `handleEdit()` - Handles edit operation
  - `handleDelete()` - Handles delete operation
  - `handleFormSubmit()` - Handles form submission
  - `handlePreviousPage()` / `handleNextPage()` - Pagination

#### 5. **Application Class** (`app.js`)
- Main entry point
- Initializes navigation
- Manages entity switching

## 🚀 Features Implementation

### ✅ Server-Side Pagination
- Uses json-server `_page` and `_limit` parameters
- Loads only current page data from server
- Reduces data transfer and improves performance

**Example Request:**
```
GET http://localhost:3000/students?_page=2&_limit=10
```

### ✅ Server-Side Search
- Uses json-server `q` parameter for full-text search
- Server filters data before sending
- Searches across all fields

**Example Request:**
```
GET http://localhost:3000/students?q=mahmoud&_page=1&_limit=10
```

### ✅ Server-Side Sort
- Uses json-server `_sort` and `_order` parameters
- Server sorts data before sending
- Supports ascending and descending order

**Example Request:**
```
GET http://localhost:3000/students?_sort=name&_order=asc&_page=1&_limit=10
```

### ✅ Combined Operations
All operations can be combined in a single request:

**Example Request:**
```
GET http://localhost:3000/students?q=mahmoud&_sort=age&_order=desc&_page=1&_limit=10
```

## 📁 File Structure

```
js/
├── api.js                    # API service class
├── student.js                # Student entity class
├── course.js                 # Course entity class
├── instructor.js             # Instructor entity class
├── employee.js               # Employee entity class
├── ui.js                     # UI manager class
├── dataTableController.js    # Main controller class
└── app.js                    # Application entry point

style/
└── main.css                  # All styles

index.html                    # Main HTML file
db.json                       # Database file
```

## 🔧 How to Use

### 1. Start json-server
```bash
json-server --watch db.json --port 3000
```

### 2. Open index.html in browser

### 3. Features Available:
- **View Records**: Automatic on page load
- **Search**: Type in search box (searches name, email, phone)
- **Sort**: Click column headers (shows ▲ or ▼)
- **Paginate**: Use Previous/Next buttons
- **Add**: Click "Add New" button
- **Edit**: Click "Edit" button on any row
- **Delete**: Click "Delete" button on any row (with confirmation)

## 🎯 Benefits of This Architecture

### 1. **Separation of Concerns**
- API logic separate from UI logic
- Each class has single responsibility
- Easy to maintain and test

### 2. **Reusability**
- Same controller works for all entities
- Just pass different entity class
- No code duplication

### 3. **Scalability**
- Easy to add new entities (just create new entity class)
- Easy to add new features to controller
- Modular structure

### 4. **Server-Side Operations**
- Reduces client-side processing
- Better performance with large datasets
- Leverages json-server capabilities

### 5. **Maintainability**
- Clear class responsibilities
- Easy to debug
- Self-documenting code

## 📝 Adding New Entity

To add a new entity (e.g., Department):

1. **Create Entity Class** (`department.js`):
```javascript
export default class Department {
    constructor(data = {}) {
        this.id = data.id || null;
        this.name = data.name || "";
        // ... other fields
    }

    static getFields() {
        return ["name", ...];
    }

    static getEntity() {
        return "departments";
    }

    toJSON() { /* ... */ }
    validate() { /* ... */ }
}
```

2. **Update db.json**:
```json
{
  "departments": []
}
```

3. **Add to app.js navigation**:
```javascript
import Department from "./department.js";

const navButtons = {
    studentsBtn: Student,
    departmentsBtn: Department
};
```

4. **Add button to HTML**:
```html
<button id="departmentsBtn">Departments</button>
```

That's it! The controller handles everything else automatically.

## 🔍 Testing json-server Queries

You can test the API directly in browser:

```
# Get all students
http://localhost:3000/students

# Page 2, 10 per page
http://localhost:3000/students?_page=2&_limit=10

# Search for "mahmoud"
http://localhost:3000/students?q=mahmoud

# Sort by name ascending
http://localhost:3000/students?_sort=name&_order=asc

# Combined
http://localhost:3000/students?q=mahmoud&_sort=age&_order=desc&_page=1&_limit=10
```

## 💡 Key Differences from Previous Version

| Feature | Old Version | New Version (OOP) |
|---------|------------|-------------------|
| Structure | Functional | Class-Based OOP |
| Search | Client-side filter | Server-side with `?q=` |
| Pagination | Client-side slice | Server-side with `?_page=&_limit=` |
| Sort | Client-side array.sort() | Server-side with `?_sort=&_order=` |
| Code Organization | Scattered functions | Organized classes |
| Reusability | Limited | High (works for all entities) |
| Scalability | Manual for each entity | Automatic for new entities |

## 🎓 Meets All Requirements

✅ Class-based OOP with JavaScript ES6  
✅ ES6 Modules (import/export)  
✅ json-server as backend  
✅ Fetch API for requests  
✅ CRUD operations  
✅ Server-side pagination with `_page` and `_limit`  
✅ Server-side search with `q`  
✅ Server-side sort with `_sort` and `_order`  
✅ Grid/Table view with all features  
✅ Separation of concerns  
✅ Easy to read and maintain  

---

**Built with ❤️ following OOP best practices**
