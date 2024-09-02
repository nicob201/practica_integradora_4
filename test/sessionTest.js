import mongoose from 'mongoose';
import supertest from 'supertest';
import { expect } from 'chai';
import config from "../src/config/config.js";
import app from '../src/app.js';
import User from '../src/dao/models/userModel.js';

const requester = supertest('http://localhost:8080');

// Variables para almacenar datos de prueba
let cookie;
let testUser;

// Conexion a la base de datos
before(async function () {
    this.timeout(10000);
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(config.MONGO_URL);
    }
});

before(async function () {
    this.timeout(10000);

    // Crear un usuario de prueba
    await requester.post('/api/sessions/register').send({
        first_name: 'Leo',
        last_name: 'Messi',
        email: 'leomessi@gmail.com',
        password: 'crack1010',
        age: 34
    });

    const resLogin = await requester
        .post('/api/sessions/login')
        .send({ email: 'leomessi@gmail.com', password: 'crack1010' });

    cookie = resLogin.headers['set-cookie'];

    const user = await User.findOne({ email: 'leomessi@gmail.com' });
    if (user) {
        testUser = user._id;
    }
});

// Desconectar la base de datos
after(async function () {
    this.timeout(10000);
    try {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(config.MONGO_URL);
        }
        if (testUser) {
            await User.deleteOne({ _id: testUser });
        }
    } catch (error) {
        console.error('Error during cleanup:', error);
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
    }
});

describe('Session API Tests', function () {
    this.timeout(10000);

    // Test para el registro de usuarios
    it('should register a user', async function () {
        const res = await requester.post('/api/sessions/register').send({
            first_name: 'Leo',
            last_name: 'Messi',
            email: 'leomessi@gmail.com',
            password: 'crack1010',
            age: 34
        });

        expect(res.status).to.equal(302);

        const user = await User.findOne({ email: 'leomessi@gmail.com' });
        if (user) {
            testUser = user._id;
        }
    });

    // Test para el inicio de sesion
    it('should login a user', async function () {
        await requester.post('/api/sessions/register').send({
            email: 'leomessi@gmail.com',
            password: 'crack1010',
        });

        const res = await requester
            .post('/api/sessions/login')
            .send({ email: 'leomessi@gmail.com', password: 'crack1010' });

        expect(res.status).to.equal(302);
        cookie = res.headers['set-cookie'];
    });

    // Test para obtener el usuario actual
    it('should get the current user', async function () {
        const res = await requester
            .get('/api/sessions/current')
            .set('Cookie', cookie);

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('email').that.equals('leomessi@gmail.com');
    });

    // Test para cerrar la sesion
    it('should logout a user', async function () {
        const res = await requester
            .post('/api/sessions/logout')
            .set('Cookie', cookie);

        expect(res.status).to.equal(302);
    });
});
