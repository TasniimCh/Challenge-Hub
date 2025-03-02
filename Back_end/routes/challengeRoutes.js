const express = require('express');
const challengeController = require('../controllers/challengeController'); // Importez le contrôleur des challenges
const router = express.Router();

// Route pour supprimer un challenge
router.delete('/:id', challengeController.requestDeleteChallenge);
router.post('/', challengeController.Creation);
router.put('/:idchall', challengeController.Modification);
router.post('/register/:id', challengeController.registerParticipant);
module.exports = router;