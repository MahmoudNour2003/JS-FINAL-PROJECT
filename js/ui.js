// ui.js
export function renderTable(headers, data, tableId = "dataTable") {
    const table = document.getElementById(tableId);
    const thead = table.querySelector("thead tr");
    const tbody = table.querySelector("tbody");

    // Clear previous content
    thead.innerHTML = "";
    tbody.innerHTML = "";

    // Render headers
    headers.forEach(header => {
        const th = document.createElement("th");
        th.textContent = header;
        thead.appendChild(th);
    });

    // Render rows
    data.forEach(row => {
        const tr = document.createElement("tr");
        headers.forEach(header => {
            const td = document.createElement("td");
            td.textContent = row[header.toLowerCase()] || "";
            tr.appendChild(td);
        });

        // Add Edit/Delete buttons
        const actionTd = document.createElement("td");
        actionTd.innerHTML = `
            <button class="editBtn" data-id="${row.id}">Edit</button>
            <button class="deleteBtn" data-id="${row.id}">Delete</button>
        `;
        tr.appendChild(actionTd);

        tbody.appendChild(tr);
    });
}

export function showForm(sectionId = "formSection") {
    document.getElementById(sectionId).classList.remove("hidden");
}

export function hideForm(sectionId = "formSection") {
    document.getElementById(sectionId).classList.add("hidden");
}

export function populateForm(data, formId = "recordForm") {
    const form = document.getElementById(formId);
    Object.keys(data).forEach(key => {
        const input = form.querySelector(`[name=${key}]`);
        if (input) input.value = data[key];
    });
}

export function clearForm(formId = "recordForm") {
    const form = document.getElementById(formId);
    form.reset();
}


export function renderForm(
    data = {},
    fields = [],   
    formId = "recordForm"
) {
    const form = document.getElementById(formId);
    form.innerHTML = "";

    const idInput = document.createElement("input");
    idInput.type = "hidden";
    idInput.name = "id";
    idInput.value = data.id ?? "";
    form.appendChild(idInput);

    fields.forEach(field => {
        const label = document.createElement("label");
        label.textContent = field;

        const input = document.createElement("input");
        input.type = "text";
        input.name = field;
        input.value = data[field] ?? ""; 

        form.appendChild(label);
        form.appendChild(input);
    });

    const saveBtn = document.createElement("button");
    saveBtn.type = "submit";
    saveBtn.textContent = "Save";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.id = "cancelBtn";
    cancelBtn.textContent = "Cancel";

    form.appendChild(saveBtn);
    form.appendChild(cancelBtn);
}



