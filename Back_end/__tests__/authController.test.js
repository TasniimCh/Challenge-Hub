const request = require('supertest');
const app = require('../index');
const { v4: uuidv4 } = require('uuid');
const pool = require('../db');
const bcrypt = require('bcrypt');

jest.mock('../db');
jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

let server;

beforeAll(() => {
    server = app.listen(3000);
});

afterAll(() => {
    server.close();
});

afterEach(() => {
    jest.clearAllMocks();
});

describe("Vérifier Routes API", () => {
    describe('API Signin', () => {
        test("Vérifier la connexion réussie avec des identifiants valides - POST /auth/signin", async () => {
            const user = {
                email: "ali@gmail.com",
                motdepasse: "hashedpassword"
            };

            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    email: "ali@gmail.com",
                    motdepasse: "hashedpassword"
                }]
            });

            bcrypt.compare.mockResolvedValueOnce(true);

            const response = await request(app).post("/auth/signin").send(user);
            expect(response.status).toBe(200);
            expect(response.body.message).toBe('Login successful');
        });

        test("Vérifier la réponse lorsque le mot de passe est incorrect", async () => {
            const user = {
                email: "ali@gmail.com",
                motdepasse: "wrongpassword"
            };

            pool.query.mockResolvedValueOnce({
                rows: [{
                    id: 1,
                    email: "ali@gmail.com",
                    motdepasse: "hashedpassword"
                }]
            });

            bcrypt.compare.mockResolvedValueOnce(false); // Simulation d'un mauvais mot de passe

            const response = await request(app).post("/auth/signin").send(user);
            expect(response.status).toBe(401);
            expect(response.body.message).toBe('Invalid username/email or password');
        });

        test("Vérifier la réponse lorsqu'un champ manque", async () => {
            const user = {
                email: "ali@gmail.com"
                // motdepasse manquant
            };

            const response = await request(app).post("/auth/signin").send(user);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username/email and password are required');
        });
    });

    describe('API Signup', () => {
        test("Vérifier la création d’un utilisateur avec des champs valides", async () => {
            const user = {
                username: `said${uuidv4()}`,
                nom: "said2",
                prenom: "nichan",
                email: `said${uuidv4()}@gmail.com`,
                motdepasse: "hashedpassword"
            };

            pool.query.mockResolvedValueOnce({ rows:[] }); // Simule l'absence de conflit email/username
            bcrypt.hash.mockResolvedValueOnce("hashedpassword");
            pool.query.mockResolvedValueOnce({ rows:[{
                userID:1,
                username: `said${uuidv4()}`,
                nom: "said2",
                prenom: "nichan",
                email: `said${uuidv4()}@gmail.com`,
                motdepasse: "hashedpassword"
            }]}); // Simule l'insertion réussie
          
            const response = await request(app).post("/auth/signup").send(user);
            console.log(response.body);
            expect(response.status).toBe(201);
            expect(response.body.message).toBe('User created successfully');
        });

        test("Vérifier si un champ existe déjà (email ou username)", async () => {
            const user = {
                username: "said123",
                nom: "said",
                prenom: "nichan",
                email: "said123@gmail.com",
                motdepasse: "123456789"
            };

            pool.query.mockResolvedValueOnce({rows:[{ id:1, username: "said123",
                nom: "said",
                prenom: "nichan",
                email: "said123@gmail.com",
                motdepasse: "123456789" }]}); // Simule un email déjà utilisé

            const response = await request(app).post("/auth/signup").send(user);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username or email already exists');
        });

        test("Vérifier si un champ est manquant dans la requête", async () => {
            const user = {
                username: "ssss",
                nom: "said",
                prenom: "nichan",
                email: "saidnichan@gmail.com"
                // motdepasse manquant
            };

            const response = await request(app).post("/auth/signup").send(user);
            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Username/email and password are required');
        });
    });
});
