const express = require('express');
const participationController = require('../controllers/participationController');
const router = express.Router();

router.put('/:idchall',participationController.Modification);
router.get('/:idchall',participationController.classement)

module.exports = router;