const request = require("supertest");
const app = require("../index");
const { v4: uuidv4 } = require('uuid');
const authService = require('../services/authservice'); // Import du service à mocker

// Mock de la fonction authService
jest.mock('../services/authservice');

describe('Gestion de challenges', () => {
    beforeEach(() => {
        jest.clearAllMocks(); // Réinitialiser les mocks avant chaque test
    });

    describe('Création d’un challenge', () => {
        test('Devrait retourner une erreur 400 si l\'utilisateur n\'existe pas', async () => {
            authService.findUserByID.mockResolvedValue(null); // Simuler un utilisateur inexistant

            const user = {
                userID: 99999999,
                nom: "defi sport",
                Description: "30 jours de course",
                tache: "30 minutes par jour",
                duree: "30",
                categorie: "sport"
            };

            const res = await request(app).post('/challenges').send(user);
            expect(res.status).toBe(400);
            expect(res.body.message).toBe('User not found');
        });

        test("Inscription réussie", async () => {
            // Simuler un utilisateur existant
            authService.findUserByID.mockResolvedValue({
                id: 34,
                nom: "defi sport",
                email: "test@example.com",
            });

            const user = {
                userID: 34,
                nom: "defi sport",
                Description: "30 jours de course",
                tache: "30 minutes par jour",
                duree: 30,
                categorie: "sport"
            };

            // Simuler la création du challenge
            authService.updateChallenge.mockResolvedValue({
                id: uuidv4(),
                ...user,
                progress: Array(user.duree).fill(false) // Simuler la création du tableau progress
            });

            const res = await request(app).post('/challenges').send(user);
            expect(res.status).toBe(201);
            expect(res.body.message).toBe('Defi created successfully');
            expect(res.body.participation).toHaveProperty("progress");
            expect(res.body.participation.progress.length).toBe(user.duree);
            expect(res.body.participation.progress[0]).toBe(false);
        });

        test('Retourne 400 si un champ est absent', async () => {
            authService.findUserByID.mockResolvedValue({userID:34}); // Utilisateur valide
            const user = {
                userID: 34,
                nom: "defi sport",
                Description: "30 jours de course",
                tache: "30 minutes par jour",
                duree: 30,
                categorie: ""
            };

            const res = await request(app).post('/challenges').send(user);
            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'All fields are required');
        });
    });

    describe("Modification d'un challenge", () => {
        
        

        test('Devrait retourner 403 si le challenge n\'existe pas ou si l\'utilisateur n\'est pas autorisé', async () => {
            const idchall = 99999999; // ID d'un challenge inexistant
            const user = {
                userID: 9999999, // ID utilisateur non créateur
                nom: "defi cuisine",
                Description: "chgchgcghcgcg",
            };

            // Simuler que l'utilisateur n'est pas le créateur
            authService.isChallengeCreator.mockResolvedValue(false);

            const res = await request(app).put(`/challenges/${idchall}`).send(user);
            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('message', 'Challenge not found or unauthorized modification');
        });

        test('Devrait retourner 403 si le challenge existe mais que updateChallenge renvoie null', async () => {
            const idchall = 38;
            const user = {
                userID: 34,
                nom: "defi cuisine",
                Description: "Nouveau défi de cuisine",
            };

            // Simuler que l'utilisateur est bien le créateur
            authService.isChallengeCreator.mockResolvedValue(true);
            authService.updateChallenge.mockResolvedValue(null); // Simuler que la mise à jour échoue
            console.log(authService.updateChallenge); // Devrait afficher une fonction mockée
            console.log(authService.findUserByID);
            
            const res = await request(app).put(`/challenges/${idchall}`).send(user);
            expect(res.status).toBe(403);  
            expect(res.body).toHaveProperty('message', 'Challenge not found or unauthorized modification');
        });
    });
});
