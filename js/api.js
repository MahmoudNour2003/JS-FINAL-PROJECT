const BASE_URL = "http://localhost:3000/";

export async function getData(entity,query="") {
    try {
        const res = await fetch(`${BASE_URL}${entity}${query}`);
        if (!res.ok) {
            throw new Error(`Error fetching ${entity}: ${res.statusText}`);
        }return await res.json();
    } catch (error) {
        console.error(`Error fetching ${entity}:`, error);
        return [];
    }
    }
export async function createData(entity, data) {
    try {
        const res = await fetch(`${BASE_URL}${entity}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            throw new Error(`Error creating ${entity}: ${res.statusText}`);
        }
        return await res.json();
    } catch (error) {
        console.error(`Error creating ${entity}:`, error);
        throw error;
    }
}
export async function updateData(entity, id, data) {
    try {
        const res = await fetch(`${BASE_URL}${entity}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("Failed to update record");
        return await res.json();
    } catch (err) {
        alert(err.message);
    }
}

export async function deleteData(entity, id) {
    try {
        const res = await fetch(`${BASE_URL}${entity}/${id}`, {
            method: "DELETE"
        });
        if (!res.ok) throw new Error("Failed to delete record");
        return true;
    } catch (err) {
        alert(err.message);
        return false;
    }
}