// api.js - API Service Class
export default class API {
    constructor(baseURL = "http://localhost:3000/") {
        this.baseURL = baseURL;
    }

    // GET with query parameters for pagination, search, sort
    async get(entity, params = {}) {
        try {
            const queryString = this.buildQueryString(params);
            const url = `${this.baseURL}${entity}${queryString}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // If data is an array, it's a list request
            if (Array.isArray(data)) {
                // Get total count from headers (json-server provides this)
                const totalCount = response.headers.get('X-Total-Count');
                return {
                    data: data,
                    totalCount: totalCount ? parseInt(totalCount) : data.length
                };
            } else {
                // Single record request
                return {
                    data: data,
                    totalCount: 1
                };
            }
        } catch (error) {
            console.error(`Error fetching ${entity}:`, error);
            throw error;
        }
    }

    // POST - Create new record
    async post(entity, data) {
        try {
            // Remove id if it exists (json-server will auto-generate)
            const dataToSend = { ...data };
            delete dataToSend.id;
            
            const response = await fetch(`${this.baseURL}${entity}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dataToSend)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error creating ${entity}:`, error);
            throw error;
        }
    }

    // PUT - Update record
    async put(entity, id, data) {
        try {
            const response = await fetch(`${this.baseURL}${entity}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error(`Error updating ${entity}:`, error);
            throw error;
        }
    }

    // DELETE - Remove record
    async delete(entity, id) {
        try {
            const response = await fetch(`${this.baseURL}${entity}/${id}`, {
                method: "DELETE"
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error(`Error deleting ${entity}:`, error);
            throw error;
        }
    }

    // Build query string from parameters
    buildQueryString(params) {
        const query = [];
        
        // Pagination
        if (params.page) {
            query.push(`_page=${params.page}`);
        }
        if (params.limit) {
            query.push(`_limit=${params.limit}`);
        }
        
        // Search
        if (params.search) {
            query.push(`q=${encodeURIComponent(params.search)}`);
        }
        
        // Sort
        if (params.sort) {
            query.push(`_sort=${params.sort}`);
        }
        if (params.order) {
            query.push(`_order=${params.order}`);
        }
        
        return query.length > 0 ? `?${query.join('&')}` : '';
    }
}
