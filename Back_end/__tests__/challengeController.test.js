const request = require("supertest");
const app = require("../index");
const { v4: uuidv4 } = require('uuid');
const authService = require('../services/authservice'); // Import du service à mocker
const pool = require('../db');
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

       /*  test("Inscription réussie", async () => {
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
        }); */

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
       /*  test('Devrait mettre à jour un challenge avec succès', async () => {
            const idchall = 123;
            const userID = 34;
            const nom = "defi sport modifié";
            const Description = "description modifiée";

            authService.isChallengeCreator.mockResolvedValue(true);
            authService.updateChallenge.mockResolvedValue({updated:true}); //Simule une mise à jour réussie

            const res = await request(app)
                .put(`/challenges/${idchall}`)
                .send({ userID: userID, nom: nom, Description: Description });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Challenge updated successfully');
        });
 */

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

            const res = await request(app).put(`/challenges/${idchall}`).send(user);
            expect(res.status).toBe(403);
            expect(res.body).toHaveProperty('message', 'Challenge not found or unauthorized modification');
        });
    });

    describe('requestDeleteChallenge', () => {
        //Je suis pas capable de mocker correctement avec pool.query car je n'ai pas acces au code

        test('Devrait supprimer un challenge avec succès si l\'utilisateur est le créateur et tous les participants ont terminé', async () => {
            // Mock des fonctions pour simuler un scénario de suppression réussie
            pool.query = jest.fn()
                .mockResolvedValueOnce({ rows: [{ createur: 34 }] }) // Simule le créateur
                .mockResolvedValueOnce({ rows: [] }); // Simule l'absence de participants actifs

            const idchall = 123;
            const iduser = 34;

            const res = await request(app)
                .delete(`/challenges/${idchall}`)
                .send({ iduser: iduser });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Challenge successfully deleted.');
        });

        test('Devrait retourner une erreur 403 si l\'utilisateur n\'est pas le créateur', async () => {
            // Mock de pool.query pour simuler que l'utilisateur n'est pas le créateur
            pool.query = jest.fn()
                .mockResolvedValueOnce({ rows: [] }); // Retourne une liste vide de créateurs

            const idchall = 123;
            const iduser = 34;

            const res = await request(app)
                .delete(`/challenges/${idchall}`)
                .send({ iduser: iduser });

            expect(res.status).toBe(403);
            expect(res.body.message).toBe('You are not the creator of this challenge or the challenge does not exist');
        });

        test('Devrait retourner une erreur 400 si des participants sont toujours en cours', async () => {
            // Mock de pool.query pour simuler que des participants sont toujours en cours
            pool.query = jest.fn()
                .mockResolvedValueOnce({ rows: [{ createur: 34 }] }) // Simule le créateur
                .mockResolvedValueOnce({ rows: [{ statut: 'ongoing' }] }); // Simule des participants en cours

            const idchall = 123;
            const iduser = 34;

            const res = await request(app)
                .delete(`/challenges/${idchall}`)
                .send({ iduser: iduser });

            expect(res.status).toBe(400);
            expect(res.body.message).toBe('Cannot delete challenge. Some participants are still ongoing.');
        });
    });


});