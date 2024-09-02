import mongoose from 'mongoose';
import supertest from 'supertest';
import { expect } from 'chai';
import config from "../src/config/config.js";
import app from '../src/app.js';
import User from '../src/dao/models/userModel.js';
import Cart from '../src/dao/models/cartModel.js';
import Product from '../src/dao/models/productModel.js';

const requester = supertest('http://localhost:8080');

// Variables para almacenar datos de prueba
let testUser;
let testCart;
let testProduct;
let cookie;

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
    try {
        if (testCart) {
            await Cart.deleteOne({ _id: testCart._id });
        }
        if (testProduct) {
            await Product.deleteOne({ _id: testProduct._id });
        }
        if (testUser) {
            await User.deleteOne({ _id: testUser._id });
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
});

before(async function () {
    this.timeout(10000);

    // Crear un usuario de prueba
    testUser = await User.create({
        first_name: 'User',
        last_name: 'Test',
        email: 'usertest@gmail.com',
        password: 'password123',
        role: 'user'
    });

    // Inicio de sesion con el usuario creado
    const resLogin = await requester
        .post('/api/login')
        .send({ email: 'usertest@gmail.com', password: 'password123' });

    cookie = resLogin.headers['set-cookie'];

    // Crear un producto de prueba
    testProduct = await Product.create({
        title: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        code: 'TEST123',
        status: true,
        stock: 10
    });

    // Crear un carrito de prueba
    testCart = await Cart.create({
        user: testUser._id,
        products: [{ product: testProduct._id, units: 10 }]
    });
});

describe('Cart API Tests', function () {
    // Test para actualizar la cantidad de unidades de un producto de un carrito
    it('should update the quantity of a product in the cart', async function () {
        const res = await requester
            .put(`/api/carts/${testCart._id}/product/${testProduct._id}`)
            .set('Cookie', cookie)
            .send({ units: 5 });

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('result').that.equals('Success updating product units in cart!');
    });

    // Test para renderizar los carritos
    it('should render the carts page', async function () {
        const res = await requester
            .get('/api/carts')
            .set('Cookie', cookie);

        expect(res.status).to.equal(200);
        expect(res.text).to.include('Test Product');
    });

    // Test para eliminar un producto de un carrito
    it('should delete a product from the cart', async function () {
        const res = await requester
            .delete(`/api/carts/${testCart._id}/product/${testProduct._id}`)
            .set('Cookie', cookie);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('result').that.equals('Success removing product from cart!');
    });

    // Test para eliminar un carrito
    it('should delete a cart', async function () {
        const res = await requester
            .delete(`/api/carts/${testCart._id}`)
            .set('Cookie', cookie);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('result').that.equals('Success deleting cart!');
    });
});
