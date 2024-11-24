const frisby = require('frisby');
const baseUrl = 'http://localhost:3000/products';

describe('Product API Tests', () => {

    it('GET /products should return all products with status code 200', async () => {
        const res = await frisby.get(baseUrl);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.json)).toBe(true);
    });

    it('GET /products should return an empty array when no products exist', async () => {
        const allProducts = await frisby.get(baseUrl);
        await Promise.all(allProducts.json.map(p => frisby.del(`${baseUrl}/${p.id}`)));
        const res = await frisby.get(baseUrl);
        expect(res.status).toBe(200);
        expect(res.json).toEqual([]);
    });

    it('POST /products should create a product and return status 201', async () => {
        const res = await frisby.post(baseUrl, {
            body: { productName: 'Test Product' },
        });
        expect(res.status).toBe(201);
        expect(res.json.productName).toBe('Test Product');
    });

    it('POST /products should return 400 for missing productName', async () => {
        const res = await frisby.post(baseUrl, {
            body: {},
        });
        expect(res.status).toBe(400);
        expect(res.body).toBe('Product name is required');
    });

    it('GET /products/:id should return a single product with status 200 for a valid ID', async () => {
        const createRes = await frisby.post(baseUrl, { body: { productName: 'Single Test' } });
        const productId = createRes.json.id;

        const res = await frisby.get(`${baseUrl}/${productId}`);
        expect(res.status).toBe(200);
        expect(res.json.productName).toBe('Single Test');
    });

    it('GET /products/:id should return 404 for an invalid product ID', async () => {
        const res = await frisby.get(`${baseUrl}/invalid-id`);
        expect(res.status).toBe(404);
        expect(res.body).toBe('Product not found');
    });

    it('PUT /products/:id should update a product with status 200 for valid data', async () => {
        const createRes = await frisby.post(baseUrl, { body: { productName: 'Old Name' } });
        const productId = createRes.json.id;

        const res = await frisby.put(`${baseUrl}/${productId}`, {
            body: { productName: 'New Name' },
        });
        expect(res.status).toBe(200);
        expect(res.json.productName).toBe('New Name');
    });

    it('PUT /products/:id should return 404 for an invalid product ID', async () => {
        const res = await frisby.put(`${baseUrl}/invalid-id`, {
            body: { productName: 'Invalid Product' },
        });
        expect(res.status).toBe(404);
        expect(res.body).toBe('Product not found');
    });

    it('PUT /products/:id should return 400 for missing productName', async () => {
        const createRes = await frisby.post(baseUrl, { body: { productName: 'Old Name' } });
        const productId = createRes.json.id;

        const res = await frisby.put(`${baseUrl}/${productId}`, { body: {} });
        expect(res.status).toBe(400);
        expect(res.body).toBe('Product name is required');
    });

    it('DELETE /products/:id should delete a product with status 200', async () => {
        const createRes = await frisby.post(baseUrl, { body: { productName: 'Delete Me' } });
        const productId = createRes.json.id;

        const res = await frisby.del(`${baseUrl}/${productId}`);
        expect(res.status).toBe(200);
        expect(res.json.productName).toBe('Delete Me');
    });

    it('DELETE /products/:id should return 404 for an invalid product ID', async () => {
        const res = await frisby.del(`${baseUrl}/invalid-id`);
        expect(res.status).toBe(404);
        expect(res.body).toBe('Product not found');
    });
});
