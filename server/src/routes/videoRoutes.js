const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');

router.post('/', videoController.create);
router.get('/', videoController.getAll);

module.exports = router;
