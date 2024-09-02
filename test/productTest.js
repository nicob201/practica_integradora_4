import mongoose from 'mongoose';
import supertest from 'supertest';
import { expect } from 'chai';
import config from "../src/config/config.js";
import app from '../src/app.js';
import Product from '../src/dao/models/productModel.js';

const requester = supertest('http://localhost:8080');

// Conexion a la base de datos
before(async function () {
    this.timeout(10000);
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(config.MONGO_URL);
    }
});

// Desconectar la base de datos
after(async function () {
    this.timeout(10000);
    if (mongoose.connection.readyState !== 0) {
        try {
            await Product.deleteMany({});
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
        await mongoose.disconnect();
    }
});

describe('Product API Tests', function () {
    this.timeout(10000);

    // Almaceno datos de prueba
    let productId;

    // Test para crear un producto
    it('should create a new product', async function () {
        const res = await requester.post('/api/products').send({
            title: 'Test Product',
            description: 'Test Description',
            price: 99.99,
            code: 'TEST123',
            status: true,
            stock: 10
        });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('result').that.equals('Product created ok!');
        expect(res.body.payload).to.have.property('_id');
        productId = res.body.payload._id;
    });

    // Test para obtener todos los productos
    it('should get all products', async function () {
        const res = await requester.get('/api/products');
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('payload').that.is.an('array');
    });

    // Test para obtener un producto por su ID
    it('should get a product by ID', async function () {
        const res = await requester.get(`/api/products/${productId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('_id').that.equals(productId);
    });

    // Test para actualizar un producto
    it('should update a product', async function () {
        const res = await requester.put(`/api/products/${productId}`).send({
            title: 'Updated Product',
            description: 'Updated Description',
            price: 89.99,
            code: 'UPDATED123',
            status: false,
            stock: 20
        });
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('result').that.equals('Product edited!');
    });

    // Test para eliminar un producto
    it('should delete a product', async function () {
        const res = await requester.delete(`/api/products/${productId}`);
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('result').that.equals('Product deleted!');
    });
});
