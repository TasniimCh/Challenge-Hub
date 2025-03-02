// authController.test.js
const request = require('supertest');
const app = require('../index');
const authService = require('../services/authservice'); // Import du service
const { v4: uuidv4 } = require('uuid');

// Mock des fonctions de service
jest.mock('../services/authservice'); 

let server;

beforeAll(() => {
    server = app.listen(3000); 
});

afterAll(() => {
    server.close();
});

describe("Vérifier Routes API", () => {
    describe('API Signin', () => {
        test("Vérifier la connexion réussie avec des identifiants valides - POST /auth/signin", async () => {
            const user = {
                email: "ali@gmail.com",
                motdepasse: "123456789"
            };

            // Mock de la fonction signin
            authService.signin.mockResolvedValue({ message: 'Login successful' });

            const response = await request(app).post("/auth/signin").send(user);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
        });

        test('Vérifier la réponse lorsque le mot de passe est incorrect', async () => {
            const user = {
                email: "ali@gmail.com",
                motdepasse: "12345678910"
            };

            // Mock de la fonction signin pour simuler un échec
            authService.signin.mockResolvedValue({ message: 'Invalid username/email or password' });

            const response = await request(app).post("/auth/signin").send(user);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid username/email or password');
        });

        test('Vérifier la réponse lorsque un champ manque', async () => {
            const user = {
                email: "ali@gmail.com",
                // absent de mot de passe 
            };

            // Mock de la fonction signin pour simuler une erreur de champ manquant
            authService.signin.mockResolvedValue({ message: 'Username/email and password are required' });

            const response = await request(app).post("/auth/signin").send(user);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username/email and password are required');
        });
    });

    describe('API Signup', () => {
        test('Vérifier la création d’un utilisateur avec des champs valides', async () => {
            const user = {
                username: `said${uuidv4()}`,
                nom: "said2",
                prenom: "nichan",
                email: `said${uuidv4()}@gmail.com`,
                motdepasse: "123456789"
            };

            // Mock de la fonction signup
            authService.signup.mockResolvedValue({ message: 'User created successfully' });

            const response = await request(app).post("/auth/signup").send(user);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User created successfully');
        });

        test('Vérifier si un champ existe déjà (email ou username)', async () => {
            const user = {
                username: "said123",
                nom: "said",
                prenom: "nichan",
                email: "said123@gmail.com",
                motdepasse: "123456789"
            };

            // Mock pour simuler un conflit de nom d'utilisateur ou d'email
            authService.signup.mockResolvedValue({ message: 'Username or email already exists' });

            const response = await request(app).post("/auth/signup").send(user);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username or email already exists');
        });

        test('Vérifier si un champ est manquant dans la requête', async () => {
            const user = {
                username: "ssss",
                nom: "said",
                prenom: "nichan",
                email: "saidnichan@gmail.com"
                // absent de mote de passe
            };

            // Mock pour simuler une erreur de champ manquant
            authService.signup.mockResolvedValue({ message: 'Username/email and password are required' });

            const response = await request(app).post("/auth/signup").send(user);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username/email and password are required');
        });
    });
});
