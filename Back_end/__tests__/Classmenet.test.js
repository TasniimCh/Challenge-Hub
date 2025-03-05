const request = require("supertest");
const app = require("../index");
const participationController = require('../controllers/participationController');
const pool = require('../db');

describe('Participation Controller Tests', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
test('test',()=>{
    
})
    /* describe('Modification', () => { */
/*         test('Devrait mettre à jour le statut avec succès', async () => {
            const idchall = 123;
            const userID = 34;
            const status = 'stopped';

            pool.query = jest.fn()
                .mockResolvedValueOnce({ rows: [{ idchallenge: idchall, idutilisateur: userID }] })
                .mockResolvedValueOnce({ rows: [{ idchallenge: idchall, idutilisateur: userID, statut: status }] });

            const res = await request(app)
                .put(`/participations/${idchall}`) // Route corrigée
                .send({ userID: userID, status: status });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Status updated successfully');
        });

        test('Devrait retourner une erreur 403 si le statut est invalide', async () => {
            const idchall = 123;
            const userID = 34;
            const status = 'invalid';

            const res = await request(app)
                .put(`/participations/${idchall}`) // Route corrigée
                .send({ userID: userID, status: status });

            expect(res.status).toBe(403);
            expect(res.body.message).toBe('Status change must be ongoing or stopped');
        });

        test('Devrait retourner une erreur 403 si l\'utilisateur ne participe pas au challenge', async () => {
            const idchall = 123;
            pool.query = jest.fn()
                .mockResolvedValueOnce({ rows: [] });

            const res = await request(app)
                .put(`/participations/${idchall}`) // Route corrigée
                .send({ userID: 9999, status: 'stopped' });

            expect(res.status).toBe(403);
            expect(res.body.message).toBe('You are not participating in that challenge');
        });
    });

    describe('classement', () => {
        test('Devrait retourner le classement avec succès', async () => {
            const idchall = 123;
            const rankingData = [
                { idutilisateur: 34, progress_count: 10 },
                { idutilisateur: 35, progress_count: 5 }
            ];

            pool.query = jest.fn()
                .mockResolvedValueOnce({ rows: [{ idchallenge: idchall }] })
                .mockResolvedValueOnce({ rows: rankingData });

            const res = await request(app).get(`/participations/${idchall}`); // Route corrigée

            expect(res.status).toBe(200);
            expect(res.body).toEqual(rankingData);
        });

        test('Devrait retourner une erreur 403 si le challenge n\'existe pas', async () => {
            const idchall = 9999999;

            pool.query = jest.fn()
                .mockResolvedValueOnce({ rows: [] });

            const res = await request(app).get(`/participations/${idchall}`); // Route corrigée

            expect(res.status).toBe(403);
            expect(res.body.message).toBe('There is no challenge with that id');
        });
    }); */
});

